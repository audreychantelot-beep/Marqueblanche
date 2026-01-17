'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AppLayout } from "@/components/AppLayout";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { type Client } from "@/lib/clients-data";
import { Checkbox } from "@/components/ui/checkbox";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";

type ClientWithId = Client & { id: string };

function SuiviMigrationContent() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const clientsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'clients');
  }, [firestore, user]);

  const { data: allClients, isLoading: isLoadingClients } = useCollection<ClientWithId>(clientsQuery);

  const migrationClients = useMemo(() => {
    if (!allClients) return [];
    return allClients.filter(client =>
      client.actionsAMener?.includes("Migration sur l'outil du cabinet")
    );
  }, [allClients]);

  const handleRowClick = (client: ClientWithId) => {
    router.push(`/clients/${client.id}`);
  };

  const handleStepChange = (client: ClientWithId, stepPath: string, checked: boolean) => {
    if (!user || !firestore) return;
    const clientDocRef = doc(firestore, 'users', user.uid, 'clients', client.id);

    const [mainStep, subStep] = stepPath.split('.') as [('step1' | 'step2' | 'step3'), string];
    
    const currentSteps = client.migrationSteps || {
        step1: { paramInfoClient: false, paramBanque: false },
        step2: { remonteeFEC: false, remonteeImmobilisations: false },
        step3: { infoMail: false, presentationOutil: false, mandatPA: false }
    };
    
    const newMigrationSteps = JSON.parse(JSON.stringify(currentSteps));
    
    if (newMigrationSteps[mainStep]) {
        (newMigrationSteps[mainStep] as any)[subStep] = checked;
    }

    const updateData = {
        migrationSteps: newMigrationSteps
    };

    setDocumentNonBlocking(clientDocRef, updateData, { merge: true });
  };
  
  const staticColumns = [
    { key: 'identifiantInterne', label: 'Identifiant interne' },
    { key: 'raisonSociale', label: 'Raison sociale' },
    { key: 'expertComptable', label: 'Expert-comptable' },
    { key: 'collaborateurReferent', label: 'Collaborateur référent' },
    { key: 'dateDeCloture', label: 'Date de clôture' },
  ];

  return (
    <main className="flex flex-col p-4 md:p-6 max-w-full mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-semibold md:text-3xl">Suivi Migration</h1>
          <p className="text-muted-foreground">Clients avec l'action "Migration sur l'outil du cabinet".</p>
        </div>
      </div>
      <Card className="flex-1 flex flex-col rounded-3xl">
        <CardHeader>
          <CardTitle>Clients en cours de migration</CardTitle>
          <CardDescription>
            Liste des clients pour lesquels une migration sur l'outil du cabinet est prévue.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead rowSpan={2} className="align-bottom">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                  {staticColumns.map(col => <TableHead rowSpan={2} key={col.key} className="align-bottom whitespace-nowrap">{col.label}</TableHead>)}
                  <TableHead colSpan={2} className="text-center border-l">1. Création & Paramétrage</TableHead>
                  <TableHead colSpan={2} className="text-center border-l">2. Remontée Données</TableHead>
                  <TableHead colSpan={3} className="text-center border-l">3. Information Client</TableHead>
                </TableRow>
                <TableRow>
                    <TableHead className="text-center border-l">Param. Infos Client</TableHead>
                    <TableHead className="text-center">Param. Banque</TableHead>
                    <TableHead className="text-center border-l">FEC</TableHead>
                    <TableHead className="text-center">Immobilisations</TableHead>
                    <TableHead className="text-center border-l">Info Mail</TableHead>
                    <TableHead className="text-center">Présentation Outil</TableHead>
                    <TableHead className="text-center">Mandat PA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingClients && Array.from({length: 3}).map((_, i) => (
                    <TableRow key={`loading-${i}`}>
                        <TableCell><MoreHorizontal className="h-4 w-4" /></TableCell>
                        {staticColumns.map(col => <TableCell key={col.key}>...</TableCell>)}
                        <TableCell colSpan={7} className="text-center">...</TableCell>
                    </TableRow>
                ))}
                {migrationClients && migrationClients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleRowClick(client)}>Modifier</DropdownMenuItem>
                          <DropdownMenuItem>Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    
                    {staticColumns.map(col => (
                         <TableCell key={col.key} onClick={() => handleRowClick(client)} className={cn("whitespace-nowrap cursor-pointer", col.key === 'raisonSociale' && "font-medium")}>
                             {
                                 col.key === 'collaborateurReferent' ? client.missionsActuelles.collaborateurReferent
                                 : col.key === 'expertComptable' ? client.missionsActuelles.expertComptable
                                 : client[col.key as keyof Pick<Client, 'identifiantInterne' | 'raisonSociale' | 'dateDeCloture'>]
                             }
                         </TableCell>
                    ))}

                    <TableCell className="text-center border-l" onClick={(e) => e.stopPropagation()}><Checkbox checked={client.migrationSteps?.step1?.paramInfoClient || false} onCheckedChange={(checked) => handleStepChange(client, 'step1.paramInfoClient', !!checked)}/></TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}><Checkbox checked={client.migrationSteps?.step1?.paramBanque || false} onCheckedChange={(checked) => handleStepChange(client, 'step1.paramBanque', !!checked)}/></TableCell>
                    
                    <TableCell className="text-center border-l" onClick={(e) => e.stopPropagation()}><Checkbox checked={client.migrationSteps?.step2?.remonteeFEC || false} onCheckedChange={(checked) => handleStepChange(client, 'step2.remonteeFEC', !!checked)}/></TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}><Checkbox checked={client.migrationSteps?.step2?.remonteeImmobilisations || false} onCheckedChange={(checked) => handleStepChange(client, 'step2.remonteeImmobilisations', !!checked)}/></TableCell>

                    <TableCell className="text-center border-l" onClick={(e) => e.stopPropagation()}><Checkbox checked={client.migrationSteps?.step3?.infoMail || false} onCheckedChange={(checked) => handleStepChange(client, 'step3.infoMail', !!checked)}/></TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}><Checkbox checked={client.migrationSteps?.step3?.presentationOutil || false} onCheckedChange={(checked) => handleStepChange(client, 'step3.presentationOutil', !!checked)}/></TableCell>
                    <TableCell className="text-center" onClick={(e) => e.stopPropagation()}><Checkbox checked={client.migrationSteps?.step3?.mandatPA || false} onCheckedChange={(checked) => handleStepChange(client, 'step3.mandatPA', !!checked)}/></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

export default function SuiviMigrationPage() {
  return (
    <AppLayout>
      <SuiviMigrationContent />
    </AppLayout>
  );
}

    