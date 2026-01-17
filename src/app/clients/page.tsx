'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Settings2, GripVertical, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuCheckboxItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { AppLayout } from "@/components/AppLayout";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser, useFirestore, useMemoFirebase, useCollection, useDoc } from "@/firebase";
import { doc, collection } from "firebase/firestore";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { cn } from "@/lib/utils";
import { type Client, allColumns, type Questionnaire } from "@/lib/clients-data";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

type ColumnKeys = keyof typeof allColumns;
const PAGE_ID = 'clients';

type ClientWithId = Client & { id: string };

const defaultVisibleColumns = Object.keys(allColumns).reduce((acc, key) => ({ ...acc, [key]: true }), {} as Record<ColumnKeys, boolean>);
const defaultColumnOrder = Object.keys(allColumns) as ColumnKeys[];

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

function ClientsContent() {
  const { user } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dashboardFilter = searchParams.get('filter');

  const clientsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'clients');
  }, [firestore, user]);

  const { data: clientList, isLoading: isLoadingClients } = useCollection<ClientWithId>(clientsQuery);

  const preferencesQuery = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid, 'columnPreferences', PAGE_ID);
  }, [firestore, user]);
  
  const { data: preferencesData, isLoading: isLoadingPreferences } = useDoc(preferencesQuery);

  const [visibleColumns, setVisibleColumns] = useState<Record<ColumnKeys, boolean>>(defaultVisibleColumns);
  const [columnOrder, setColumnOrder] = useState<ColumnKeys[]>(defaultColumnOrder);
  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});
  
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoadingPreferences) {
      if (preferencesData) {
        const mergedColumns = { ...defaultVisibleColumns, ...preferencesData.columns };
        setVisibleColumns(mergedColumns);
        if(preferencesData.order) {
            const currentKeys = Object.keys(allColumns);
            const savedOrder = preferencesData.order.filter((k: string) => currentKeys.includes(k));
            const newKeys = currentKeys.filter(k => !savedOrder.includes(k));
            setColumnOrder([...savedOrder, ...newKeys]);
        } else {
            setColumnOrder(defaultColumnOrder);
        }
      } else {
        setVisibleColumns(defaultVisibleColumns);
        setColumnOrder(defaultColumnOrder);
      }
    }
  }, [preferencesData, isLoadingPreferences]);

  const filterOptions = useMemo(() => {
    if (!clientList) return {
      formesJuridiques: [],
      datesDeCloture: [],
      collaborateursReferents: [],
      expertsComptables: [],
      typesMission: [],
      regimesTVA: [],
      typologiesClientele: []
    };
    const formesJuridiques = [...new Set(clientList.map(c => c.formeJuridique).filter(Boolean))];
    const datesDeCloture = [...new Set(clientList.map(c => c.dateDeCloture).filter(Boolean).sort())];
    const collaborateursReferents = [...new Set(clientList.map(c => c.missionsActuelles.collaborateurReferent).filter(Boolean))];
    const expertsComptables = [...new Set(clientList.map(c => c.missionsActuelles.expertComptable).filter(Boolean))];
    const typesMission = [...new Set(clientList.map(c => c.missionsActuelles.typeMission).filter(Boolean))];
    const regimesTVA = [...new Set(clientList.map(c => c.activites.regimeTVA).filter(Boolean))];
    const typologiesClientele = [...new Set(clientList.map(c => c.activites.typologieClientele).filter(Boolean))];

    return { formesJuridiques, datesDeCloture, collaborateursReferents, expertsComptables, typesMission, regimesTVA, typologiesClientele };
  }, [clientList]);

  const filteredClients = useMemo(() => {
    if (!clientList) return [];
    let clients = [...clientList];
    
    if (dashboardFilter === 'a_completer') {
      clients = clients.filter(client => getProfileCompletion(client) < 100);
    }

    Object.entries(columnFilters).forEach(([key, filterValue]) => {
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) {
        return;
      }

      clients = clients.filter(client => {
        const columnKey = key as ColumnKeys;

        switch (columnKey) {
          case 'identifiantInterne':
          case 'siren':
          case 'raisonSociale':
          case 'codeAPE':
          case 'secteurActivites':
          case 'regimeFiscal':
            const clientValueText = client[columnKey as keyof Client] as string;
            return clientValueText?.toLowerCase().includes((filterValue as string).toLowerCase());

          case 'formeJuridique':
          case 'dateDeCloture':
            const clientValueSelect = client[columnKey as keyof Client] as string;
            return (filterValue as string[]).includes(clientValueSelect);

          case 'collaborateurReferent':
          case 'expertComptable':
          case 'typeMission':
            const clientValueMission = client.missionsActuelles[columnKey as keyof Client['missionsActuelles']];
            return (filterValue as string[]).includes(clientValueMission);

          case 'regimeTVA':
          case 'typologieClientele':
            const clientValueActivite = client.activites[columnKey as keyof Client['activites']];
            return (filterValue as string[]).includes(clientValueActivite);
          
          case 'assujettiReforme':
          case 'eInvoicing':
          case 'eReportingTransaction':
          case 'eReportingPaiement':
            const clientValueObligation = (client.obligationsLegales as any)?.[columnKey] || 'À définir';
            return (filterValue as string[]).includes(clientValueObligation);

          default:
            return true;
        }
      });
    });

    return clients;
  }, [clientList, columnFilters, dashboardFilter]);

  const handleRowClick = (client: ClientWithId) => {
    router.push(`/clients/${client.id}`);
  };
  
  const handleAddNewClient = () => {
    router.push('/clients/new');
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

  const renderTextFilter = (columnId: string, title: string) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2 h-auto text-left justify-start w-full font-medium">
          {title}
          {columnFilters[columnId] ? <Filter className="h-3 w-3 text-primary" /> : <Filter className="h-3 w-3 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="space-y-2">
          <Label htmlFor={`filter-${columnId}`}>Filtrer par {title}</Label>
          <Input
            id={`filter-${columnId}`}
            placeholder="Rechercher..."
            value={columnFilters[columnId] || ''}
            onChange={(e) => setColumnFilters(prev => ({ ...prev, [columnId]: e.target.value || undefined }))}
          />
        </div>
      </PopoverContent>
    </Popover>
  );

  const renderCheckboxFilter = (columnId: string, title: string, options: string[]) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2 h-auto text-left justify-start w-full font-medium">
          {title}
          {columnFilters[columnId]?.length ? <Filter className="h-3 w-3 text-primary" /> : <Filter className="h-3 w-3 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="space-y-2">
          <Label>Filtrer par {title}</Label>
          <ScrollArea className="h-40">
            {options.map(option => (
              <div key={option} className="flex items-center space-x-2 p-1">
                <Checkbox
                  id={`filter-${columnId}-${option}`}
                  checked={(columnFilters[columnId] || []).includes(option)}
                  onCheckedChange={checked => {
                    const currentSelection = columnFilters[columnId] || [];
                    const newSelection = checked ? [...currentSelection, option] : currentSelection.filter((item: string) => item !== option);
                    setColumnFilters(prev => ({ ...prev, [columnId]: newSelection.length ? newSelection : undefined }));
                  }}
                />
                <Label htmlFor={`filter-${columnId}-${option}`} className="font-normal">{option}</Label>
              </div>
            ))}
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );

  const getHeader = (key: ColumnKeys) => {
    const title = allColumns[key];
    switch (key) {
      case 'identifiantInterne':
      case 'siren':
      case 'raisonSociale':
      case 'codeAPE':
      case 'secteurActivites':
      case 'regimeFiscal':
        return renderTextFilter(key, title);
      case 'formeJuridique':
        return renderCheckboxFilter(key, title, filterOptions.formesJuridiques);
      case 'dateDeCloture':
        return renderCheckboxFilter(key, title, filterOptions.datesDeCloture);
      case 'collaborateurReferent':
        return renderCheckboxFilter(key, title, filterOptions.collaborateursReferents);
      case 'expertComptable':
        return renderCheckboxFilter(key, title, filterOptions.expertsComptables);
      case 'typeMission':
        return renderCheckboxFilter(key, title, filterOptions.typesMission);
      case 'regimeTVA':
        return renderCheckboxFilter(key, title, filterOptions.regimesTVA);
      case 'typologieClientele':
        return renderCheckboxFilter(key, title, filterOptions.typologiesClientele);
      case 'assujettiReforme':
      case 'eInvoicing':
      case 'eReportingTransaction':
      case 'eReportingPaiement':
        return renderCheckboxFilter(key, title, ['Oui', 'Non', 'À définir']);
      case 'contactPrincipal':
      default:
        return <div className="p-2 font-medium">{title}</div>;
    }
  };

  const getObligationBadge = (value: string | undefined) => {
    const displayValue = value || 'À définir';
    let variant: 'default' | 'destructive' | 'secondary' | 'outline' = 'secondary';
    if (displayValue === 'Oui') variant = 'default';
    if (displayValue === 'Non') variant = 'destructive';
    return <Badge variant={variant}>{displayValue}</Badge>;
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
                      onCheckedChange={() => toggleColumn(key as ColumnKeys)}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {allColumns[key as ColumnKeys]}
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
          <Button className="rounded-3xl" onClick={handleAddNewClient}>
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
                    visibleColumns[key as ColumnKeys] && <TableHead key={key} className="whitespace-nowrap p-0">{getHeader(key as ColumnKeys)}</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingClients && Array.from({length: 3}).map((_, i) => (
                    <TableRow key={`loading-${i}`}>
                        <TableCell><MoreHorizontal className="h-4 w-4" /></TableCell>
                        {columnOrder.map(key => visibleColumns[key as ColumnKeys] && <TableCell key={key}>...</TableCell>)}
                    </TableRow>
                ))}
                {filteredClients && filteredClients.map((client) => (
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
                    {columnOrder.map(key => visibleColumns[key as ColumnKeys] && (
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
                                : key === 'dateDeCloture' ? client.dateDeCloture
                                : key === 'assujettiReforme' ? getObligationBadge(client.obligationsLegales?.assujettiReforme)
                                : key === 'eInvoicing' ? getObligationBadge(client.obligationsLegales?.eInvoicing)
                                : key === 'eReportingTransaction' ? getObligationBadge(client.obligationsLegales?.eReportingTransaction)
                                : key === 'eReportingPaiement' ? getObligationBadge(client.obligationsLegales?.eReportingPaiement)
                                : client[key as keyof Omit<Client, 'contactPrincipal'|'missionsActuelles'|'activites'|'obligationsLegales'|'avatar'|'status'|'questionnaire'|'dateDeCloture'>]
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

export default function ClientsPage() {
  return (
    <AppLayout>
      <ClientsContent />
    </AppLayout>
  );
}
