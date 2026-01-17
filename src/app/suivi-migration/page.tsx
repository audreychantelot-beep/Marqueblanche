'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AppLayout } from "@/components/AppLayout";
import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { collection } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { type Client, allColumns } from "@/lib/clients-data";

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

  const visibleColumns = Object.keys(allColumns).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<keyof typeof allColumns, boolean>);
  const columnOrder = Object.keys(allColumns) as (keyof typeof allColumns)[];

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
                    visibleColumns[key as keyof typeof allColumns] && <TableHead key={key} className="whitespace-nowrap">{allColumns[key as keyof typeof allColumns]}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingClients && Array.from({length: 3}).map((_, i) => (
                    <TableRow key={`loading-${i}`}>
                        <TableCell><MoreHorizontal className="h-4 w-4" /></TableCell>
                        {columnOrder.map(key => visibleColumns[key as keyof typeof allColumns] && <TableCell key={key}>...</TableCell>)}
                    </TableRow>
                ))}
                {migrationClients && migrationClients.map((client) => (
                  <TableRow key={client.id} onClick={() => handleRowClick(client)} className="cursor-pointer">
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
                    {columnOrder.map(key => visibleColumns[key as keyof typeof allColumns] && (
                        <TableCell key={key} className={cn("whitespace-nowrap", key === 'raisonSociale' && "font-medium")}>
                            {
                                key === 'contactPrincipal' ? (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-9 w-9">
                                            <AvatarImage src={client.avatar} alt="Avatar" />
                                            <AvatarFallback>{client.contactPrincipal.prenom.charAt(0)}{client.contactPrincipal.nom.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div>{client.contactPrincipal.prenom} {client.contactPrincipal.nom}</div>
                                            <div className="text-muted-foreground text-xs">{client.contactPrincipal.email}</div>
                                        </div>
                                    </div>
                                ) : key === 'typeMission' ? (
                                    <Badge variant={client.missionsActuelles.typeMission === 'Tenue' ? 'default' : client.missionsActuelles.typeMission === 'Révision' ? 'secondary' : 'outline'}>
                                        {client.missionsActuelles.typeMission}
                                    </Badge>
                                ) : key === 'collaborateurReferent' ? client.missionsActuelles.collaborateurReferent
                                : key === 'expertComptable' ? client.missionsActuelles.expertComptable
                                : key === 'codeAPE' ? client.activites.codeAPE
                                : key === 'secteurActivites' ? client.activites.secteurActivites
                                : key === 'regimeTVA' ? client.activites.regimeTVA
                                : key === 'regimeFiscal' ? client.activites.regimeFiscal
                                : key === 'typologieClientele' ? client.activites.typologieClientele
                                : key === 'obligationsLegales' ? "À définir"
                                : client[key as keyof Omit<Client, 'contactPrincipal'|'missionsActuelles'|'activites'|'obligationsLegales'|'avatar'|'status'|'questionnaire'>]
                            }
                        </TableCell>
                    ))}
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
