'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Settings2, GripVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AppLayout } from "@/components/AppLayout";
import React, { useState, useEffect, useRef } from "react";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";
import { clients, type Client, allColumns } from "@/lib/clients-data";
import { ClientEditDialog } from "@/components/clients/ClientEditDialog";

type ColumnKeys = keyof typeof allColumns;
const PAGE_ID = 'clients';

const defaultVisibleColumns = Object.keys(allColumns).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<ColumnKeys, boolean>);
const defaultColumnOrder = Object.keys(allColumns) as ColumnKeys[];

function ClientsContent() {
  const [clientList, setClientList] = useState(clients);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const { user } = useUser();
  const firestore = useFirestore();

  const preferencesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid, 'columnPreferences', PAGE_ID);
  }, [firestore, user]);
  
  const { data: preferencesData, isLoading: isLoadingPreferences } = useDoc(preferencesQuery);

  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKeys, boolean>>(defaultVisibleColumns);
  const [columnOrder, setColumnOrder] = useState<ColumnKeys[]>(defaultColumnOrder);
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoadingPreferences) {
      if (preferencesData) {
        const mergedColumns = { ...defaultVisibleColumns, ...preferencesData.columns };
        setVisibleColumns(mergedColumns);
        if(preferencesData.order) {
            setColumnOrder(preferencesData.order);
        } else {
            setColumnOrder(defaultColumnOrder);
        }
      } else {
        setVisibleColumns(defaultVisibleColumns);
        setColumnOrder(defaultColumnOrder);
      }
    }
  }, [preferencesData, isLoadingPreferences]);

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };
  
  const handleSaveClient = (updatedClient: Client) => {
    setClientList(prevList => 
      prevList.map(c => c.identifiantInterne === updatedClient.identifiantInterne ? updatedClient : c)
    );
  };

  const savePreferences = (newVisibleColumns: Record<ColumnKeys, boolean>, newColumnOrder: ColumnKeys[]) => {
    if (user && firestore) {
      const prefDocRef = doc(firestore, 'users', user.uid, 'columnPreferences', PAGE_ID);
      setDocumentNonBlocking(prefDocRef, {
        id: PAGE_ID,
        userId: user.uid,
        page: PAGE_ID,
        columns: newVisibleColumns,
        order: newColumnOrder,
      }, { merge: true });
    }
  };

  const toggleColumn = (column: ColumnKeys) => {
    const newVisibleColumns = { ...visibleColumns, [column]: !visibleColumns[column] };
    setVisibleColumns(newVisibleColumns);
    savePreferences(newVisibleColumns, columnOrder);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    const newColumnOrder = [...columnOrder];
    const dragItemContent = newColumnOrder[dragItem.current];
    newColumnOrder.splice(dragItem.current, 1);
    newColumnOrder.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setColumnOrder(newColumnOrder);
    savePreferences(visibleColumns, newColumnOrder);
  };

  return (
    <main className="flex flex-col p-4 md:p-6 max-w-full mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-semibold md:text-3xl">Clients</h1>
          <p className="text-muted-foreground">Gérez vos clients et visualisez leurs informations.</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Settings2 className="mr-2 h-4 w-4" />
                Personnaliser
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <DropdownMenuLabel>Afficher et ordonner les colonnes</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div onDragEnd={handleDrop}>
                {columnOrder.map((key, index) => (
                  <div
                    key={key}
                    className="flex items-center"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnter={(e) => handleDragEnter(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab mr-2" />
                    <DropdownMenuCheckboxItem
                      className="flex-1"
                      checked={visibleColumns[key]}
                      onCheckedChange={() => toggleColumn(key)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {allColumns[key]}
                    </DropdownMenuCheckboxItem>
                  </div>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importer des clients
          </Button>
          <Button className="rounded-3xl">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un client
          </Button>
        </div>
      </div>
      <Card className="flex-1 flex flex-col rounded-3xl">
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
          <CardDescription>
            Une liste de tous les clients de votre compte.
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
                    visibleColumns[key] && <TableHead key={key} className="whitespace-nowrap">{allColumns[key]}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientList.map((client) => (
                  <TableRow key={client.identifiantInterne} onClick={() => handleEditClick(client)} className="cursor-pointer">
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
                          <DropdownMenuItem onSelect={() => handleEditClick(client)}>Modifier</DropdownMenuItem>
                          <DropdownMenuItem>Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    {columnOrder.map(key => visibleColumns[key] && (
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
                                : client[key as keyof Omit<Client, 'contactPrincipal'|'missionsActuelles'|'activites'|'obligationsLegales'|'avatar'|'status'>]
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
      {selectedClient && <ClientEditDialog 
        client={selectedClient} 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveClient}
      />}
    </main>
  );
}

export default function ClientsPage() {
  return (
    <AppLayout>
      <ClientsContent />
    </AppLayout>
  );
}
