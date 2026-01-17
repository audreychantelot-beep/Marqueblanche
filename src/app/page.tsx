'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { Hand, Users, UserCheck, Clock, X } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { collection } from "firebase/firestore";
import type { Client, Questionnaire } from "@/lib/clients-data";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";

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

  const clientsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'clients');
  }, [firestore, user]);

  const { data: clientList, isLoading: isLoadingClients } = useCollection<ClientWithId>(clientsQuery);

  const [filters, setFilters] = useState({
    collaborateur: 'all',
    expertComptable: 'all',
    dateDeCloture: 'all',
  });

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const resetFilters = () => {
    setFilters({
      collaborateur: 'all',
      expertComptable: 'all',
      dateDeCloture: 'all',
    });
  };

  const filterOptions = useMemo(() => {
    if (!clientList) return { collaborateurs: [], expertsComptables: [], datesDeCloture: [] };
    const collaborateurs = [...new Set(clientList.map(c => c.missionsActuelles.collaborateurReferent).filter(Boolean))];
    const expertsComptables = [...new Set(clientList.map(c => c.missionsActuelles.expertComptable).filter(Boolean))];
    const datesDeCloture = [...new Set(clientList.map(c => c.dateDeCloture).filter(Boolean).sort())];
    return { collaborateurs, expertsComptables, datesDeCloture };
  }, [clientList]);

  const filteredClients = useMemo(() => {
    if (!clientList) return [];
    return clientList.filter(client => {
      const matchCollaborateur = filters.collaborateur === 'all' || client.missionsActuelles.collaborateurReferent === filters.collaborateur;
      const matchExpertComptable = filters.expertComptable === 'all' || client.missionsActuelles.expertComptable === filters.expertComptable;
      const matchDateDeCloture = filters.dateDeCloture === 'all' || client.dateDeCloture === filters.dateDeCloture;
      return matchCollaborateur && matchExpertComptable && matchDateDeCloture;
    });
  }, [clientList, filters]);

  const dashboardMetrics = useMemo(() => {
    if (!filteredClients) {
        return {
            clientsACompleter: 0,
            clientsEnMigration: 0,
            clientsRestantsAMigrer: 0,
        };
    }

    const clientsACompleter = filteredClients.filter(c => getProfileCompletion(c) < 100).length;
    const clientsEnMigrationList = filteredClients.filter(c => c.actionsAMener?.includes("Migration sur l'outil du cabinet"));
    const clientsEnMigration = clientsEnMigrationList.length;
    const clientsRestantsAMigrer = clientsEnMigrationList.filter(c => !isMigrationComplete(c)).length;

    return { clientsACompleter, clientsEnMigration, clientsRestantsAMigrer };
  }, [filteredClients]);

  const hasActiveFilters = filters.collaborateur !== 'all' || filters.expertComptable !== 'all' || filters.dateDeCloture !== 'all';

  return (
    <main className="flex flex-col flex-1 p-4 md:px-6 max-w-full mx-auto w-full">
       <Card className="mb-6 rounded-3xl">
        <CardHeader>
          <CardTitle>Tableau de bord suivi des clients</CardTitle>
          <CardDescription>Filtrez et visualisez les données de vos clients.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground">Filtres :</p>
                <Select value={filters.collaborateur} onValueChange={(value) => handleFilterChange('collaborateur', value)}>
                    <SelectTrigger className="w-[200px] rounded-3xl bg-background">
                        <SelectValue placeholder="Collaborateur" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les collaborateurs</SelectItem>
                        {filterOptions.collaborateurs.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Select value={filters.expertComptable} onValueChange={(value) => handleFilterChange('expertComptable', value)}>
                    <SelectTrigger className="w-[200px] rounded-3xl bg-background">
                        <SelectValue placeholder="Expert-comptable" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Tous les experts-comptables</SelectItem>
                        {filterOptions.expertsComptables.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                    </SelectContent>
                </Select>

                <Select value={filters.dateDeCloture} onValueChange={(value) => handleFilterChange('dateDeCloture', value)}>
                    <SelectTrigger className="w-[200px] rounded-3xl bg-background">
                        <SelectValue placeholder="Date de clôture" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Toutes les dates de clôture</SelectItem>
                        {filterOptions.datesDeCloture.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                </Select>
                {hasActiveFilters && (
                    <Button variant="ghost" onClick={resetFilters}>
                        <X className="mr-2 h-4 w-4" />
                        Réinitialiser
                    </Button>
                )}
            </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/clients?filter=a_completer" className="block">
          <Card className="rounded-3xl hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients à compléter</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingClients ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{dashboardMetrics.clientsACompleter}</div>}
              <p className="text-xs text-muted-foreground">Profils clients non finalisés</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/suivi-migration" className="block">
          <Card className="rounded-3xl hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients en migration</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingClients ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{dashboardMetrics.clientsEnMigration}</div>}
              <p className="text-xs text-muted-foreground">Clients avec le plan de migration</p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/suivi-migration?filter=restants_a_migrer" className="block">
          <Card className="rounded-3xl hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clients restants à migrer</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingClients ? <Skeleton className="h-8 w-1/4" /> : <div className="text-2xl font-bold">{dashboardMetrics.clientsRestantsAMigrer}</div>}
              <p className="text-xs text-muted-foreground">Migrations non terminées</p>
            </CardContent>
          </Card>
        </Link>
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
