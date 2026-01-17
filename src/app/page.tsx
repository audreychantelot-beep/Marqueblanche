'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Hand, ChevronLeft, ChevronRight, Users, UserCheck, Clock } from "lucide-react";
import { WeekCalendar } from "@/components/ui/week-calendar";
import React, { useState, useMemo } from "react";
import { getWeek, addWeeks, subWeeks, format } from "date-fns";
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { collection } from "firebase/firestore";
import type { Client, Questionnaire } from "@/lib/clients-data";
import { Skeleton } from "@/components/ui/skeleton";

type ClientWithId = Client & { id: string };

// Helper functions for metrics
const isQuestionnaireComplete = (questionnaire: Questionnaire | undefined) => {
    if (!questionnaire) return false;
    const answeredQuestions = Object.keys(questionnaire).filter(key => !key.endsWith('_software') && !key.endsWith('_method') && !key.endsWith('_function') && !key.endsWith('_actions') && !key.endsWith('_project') && (questionnaire as any)[key]).length;
    return answeredQuestions >= 13;
}

const getProfileCompletion = (client: Client) => {
    if (!client) return 0;
    const fields = [
      client.identifiantInterne,
      client.siren,
      client.raisonSociale,
      client.formeJuridique,
      client.dateDeCloture,
      client.contactPrincipal.nom,
      client.contactPrincipal.prenom,
      client.contactPrincipal.email,
      client.missionsActuelles.collaborateurReferent,
      client.missionsActuelles.expertComptable,
      client.missionsActuelles.typeMission,
      client.activites.codeAPE,
      client.activites.secteurActivites,
      client.activites.regimeTVA,
      client.activites.regimeFiscal,
      client.activites.typologieClientele,
    ];

    const filledInFieldsCount = fields.filter(field => field && String(field).trim() !== '').length;

    const totalChecklistItems = fields.length + 2; // fields + questionnaire + actionsAMener
    let completedChecklistItems = filledInFieldsCount;

    if (isQuestionnaireComplete(client.questionnaire)) {
        completedChecklistItems += 1;
    }
    if (client.actionsAMener && client.actionsAMener.length > 0) {
        completedChecklistItems += 1;
    }
    
    return (completedChecklistItems / totalChecklistItems) * 100;
}

const isMigrationComplete = (client: Client) => {
    const steps = client.migrationSteps;
    if (!steps) return false;
    return (
        steps.step1.paramInfoClient &&
        steps.step1.paramBanque &&
        steps.step2.remonteeFEC &&
        steps.step2.remonteeImmobilisations &&
        steps.step3.infoMail &&
        steps.step3.presentationOutil &&
        steps.step3.mandatPA
    );
};


function DashboardContent() {
  const { user } = useUser();
  const firestore = useFirestore();
  const dashboardImage = PlaceHolderImages.find(p => p.id === 'dashboard-hero');
  const [currentDate, setCurrentDate] = useState(new Date());

  const clientsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'clients');
  }, [firestore, user]);

  const { data: clientList, isLoading: isLoadingClients } = useCollection<ClientWithId>(clientsQuery);

  const dashboardMetrics = useMemo(() => {
    if (!clientList) {
        return {
            clientsACompleter: 0,
            clientsEnMigration: 0,
            clientsRestantsAMigrer: 0,
        };
    }

    const clientsACompleter = clientList.filter(c => getProfileCompletion(c) < 100).length;
    const clientsEnMigrationList = clientList.filter(c => c.actionsAMener?.includes("Migration sur l'outil du cabinet"));
    const clientsEnMigration = clientsEnMigrationList.length;
    const clientsRestantsAMigrer = clientsEnMigrationList.filter(c => !isMigrationComplete(c)).length;

    return { clientsACompleter, clientsEnMigration, clientsRestantsAMigrer };
  }, [clientList]);

  const weekNumber = getWeek(currentDate, { weekStartsOn: 1 });

  const goToPreviousWeek = () => {
    setCurrentDate(prev => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };

  return (
    <main className="flex flex-col flex-1 p-4 md:px-6 max-w-full mx-auto w-full">
       <Card className="mb-6 rounded-3xl">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between space-y-0 pb-2">
            <span>Bonjour, {user?.displayName?.split(' ')[0] || 'Utilisateur'} !</span>
            <Hand className="h-5 w-5 text-amber-500" />
          </CardTitle>
          <CardDescription>Voici un aperçu de votre activité.</CardDescription>
        </CardHeader>
      </Card>
      <div className="flex-1 flex gap-6">
        <div className="w-2/3">
            <Card className="h-full w-full overflow-hidden flex flex-col rounded-3xl">
                {dashboardImage && (
                <div className="h-1/2 w-full relative">
                    <Image
                        src={dashboardImage.imageUrl}
                        alt={dashboardImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={dashboardImage.imageHint}
                    />
                </div>
                )}
                <div className="h-1/2 flex flex-col">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                        <CardTitle>Échéances à venir</CardTitle>
                        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Button variant="ghost" size="icon" onClick={goToPreviousWeek} className="h-6 w-6">
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span>{format(currentDate, 'MMMM yyyy', { locale: fr })}</span>
                            <Button variant="ghost" size="icon" onClick={goToNextWeek} className="h-6 w-6">
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 p-6">
                        <WeekCalendar 
                        currentDate={currentDate}
                        />
                    </CardContent>
                </div>
            </Card>
        </div>

        <div className="w-1/3 flex flex-col gap-6">
          <Card className="rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients à compléter</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingClients ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{dashboardMetrics.clientsACompleter}</div>}
              <p className="text-xs text-muted-foreground">Profils clients non finalisés</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients en migration</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingClients ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{dashboardMetrics.clientsEnMigration}</div>}
              <p className="text-xs text-muted-foreground">Clients avec le plan de migration</p>
            </CardContent>
          </Card>
          <Card className="rounded-3xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients restants à migrer</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingClients ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{dashboardMetrics.clientsRestantsAMigrer}</div>}
              <p className="text-xs text-muted-foreground">Migrations non terminées</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}


export default function DashboardPage() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}
