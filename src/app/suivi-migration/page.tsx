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
import { type Client, allColumns } from "@/lib/clients-data";
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

  const handleStepChange = (client: ClientWithId, step: 'step1' | 'step2' | 'step3', checked: boolean) => {
    if (!user || !firestore) return;
    const clientDocRef = doc(firestore, 'users', user.uid, 'clients', client.id);
    const updateData = {
        migrationSteps: {
            ...client.migrationSteps,
            [step]: checked
        }
    };
    setDocumentNonBlocking(clientDocRef, updateData, { merge: true });
  };

  const columnOrder: (keyof typeof allColumns | 'step1' | 'step2' | 'step3')[] = useMemo(() => [
    'identifiantInterne',
    'raisonSociale',
    'expertComptable',
    'collaborateurReferent',
    'dateDeCloture',
    'step1',
    'step2',
    'step3'
  ], []);

  const columnLabels = {
    ...allColumns,
    step1: "1. Création & Paramétrage",
    step2: "2. Remontée Données",
    step3: "3. Information Client",
  };

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
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                  {columnOrder.map(key =>
                    <TableHead key={key} className="whitespace-nowrap">{columnLabels[key as keyof typeof columnLabels]}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingClients && Array.from({length: 3}).map((_, i) => (
                    <TableRow key={`loading-${i}`}>
                        <TableCell><MoreHorizontal className="h-4 w-4" /></TableCell>
                        {columnOrder.map(key => <TableCell key={key}>...</TableCell>)}
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
                    {columnOrder.map(key => {
                      if (key === 'step1' || key === 'step2' || key === 'step3') {
                        return (
                          <TableCell key={key} className="text-center" onClick={(e) => e.stopPropagation()}>
                            <Checkbox
                                checked={client.migrationSteps?.[key] || false}
                                onCheckedChange={(checked) => handleStepChange(client, key, !!checked)}
                            />
                          </TableCell>
                        )
                      }
                      return (
                        <TableCell key={key} onClick={() => handleRowClick(client)} className={cn("whitespace-nowrap cursor-pointer", key === 'raisonSociale' && "font-medium")}>
                            {
                                key === 'collaborateurReferent' ? client.missionsActuelles.collaborateurReferent
                                : key === 'expertComptable' ? client.missionsActuelles.expertComptable
                                : client[key as keyof Pick<Client, 'identifiantInterne' | 'raisonSociale' | 'dateDeCloture'>]
                            }
                        </TableCell>
                      )
                    })}
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
