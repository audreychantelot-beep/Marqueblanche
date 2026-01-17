'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Filter } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AppLayout } from "@/components/AppLayout";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useMemoFirebase, useCollection } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { type Client } from "@/lib/clients-data";
import { Checkbox } from "@/components/ui/checkbox";
import { setDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({});

  const filterOptions = useMemo(() => {
    if (!migrationClients) return { expertsComptables: [], collaborateursReferents: [], datesDeCloture: [] };
    const expertsComptables = [...new Set(migrationClients.map(c => c.missionsActuelles.expertComptable).filter(Boolean))];
    const collaborateursReferents = [...new Set(migrationClients.map(c => c.missionsActuelles.collaborateurReferent).filter(Boolean))];
    const datesDeCloture = [...new Set(migrationClients.map(c => c.dateDeCloture).filter(Boolean).sort())];
    return { expertsComptables, collaborateursReferents, datesDeCloture };
  }, [migrationClients]);

  const filteredClients = useMemo(() => {
    if (!migrationClients) return [];
    return migrationClients.filter(client => {
      const {
        identifiantInterne, raisonSociale, expertComptable, collaborateurReferent, dateDeCloture,
        paramInfoClient, paramBanque, remonteeFEC, remonteeImmobilisations, infoMail, presentationOutil, mandatPA
      } = columnFilters;

      if (identifiantInterne && !client.identifiantInterne.toLowerCase().includes(identifiantInterne.toLowerCase())) {
        return false;
      }
      if (raisonSociale && !client.raisonSociale.toLowerCase().includes(raisonSociale.toLowerCase())) {
        return false;
      }
      if (expertComptable?.length && !expertComptable.includes(client.missionsActuelles.expertComptable)) {
        return false;
      }
      if (collaborateurReferent?.length && !collaborateurReferent.includes(client.missionsActuelles.collaborateurReferent)) {
        return false;
      }
      if (dateDeCloture?.length && (!client.dateDeCloture || !dateDeCloture.includes(client.dateDeCloture))) {
        return false;
      }

      const steps = client.migrationSteps;
      if (paramInfoClient === 'oui' && !steps?.step1?.paramInfoClient) return false;
      if (paramInfoClient === 'non' && steps?.step1?.paramInfoClient) return false;

      if (paramBanque === 'oui' && !steps?.step1?.paramBanque) return false;
      if (paramBanque === 'non' && steps?.step1?.paramBanque) return false;

      if (remonteeFEC === 'oui' && !steps?.step2?.remonteeFEC) return false;
      if (remonteeFEC === 'non' && steps?.step2?.remonteeFEC) return false;
      
      if (remonteeImmobilisations === 'oui' && !steps?.step2?.remonteeImmobilisations) return false;
      if (remonteeImmobilisations === 'non' && steps?.step2?.remonteeImmobilisations) return false;

      if (infoMail === 'oui' && !steps?.step3?.infoMail) return false;
      if (infoMail === 'non' && steps?.step3?.infoMail) return false;

      if (presentationOutil === 'oui' && !steps?.step3?.presentationOutil) return false;
      if (presentationOutil === 'non' && steps?.step3?.presentationOutil) return false;

      if (mandatPA === 'oui' && !steps?.step3?.mandatPA) return false;
      if (mandatPA === 'non' && steps?.step3?.mandatPA) return false;

      return true;
    });
  }, [migrationClients, columnFilters]);


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
  
  const handleDateChange = (client: ClientWithId, date: string) => {
    if (!user || !firestore) return;
    const clientDocRef = doc(firestore, 'users', user.uid, 'clients', client.id);

    const updateData = {
        datePrevisionnelleMigration: date
    };

    setDocumentNonBlocking(clientDocRef, updateData, { merge: true });
  };
  
  const renderTextFilter = (columnId: 'identifiantInterne' | 'raisonSociale', title: string) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2 h-auto text-left justify-start w-full">
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

  const renderCheckboxFilter = (columnId: 'expertComptable' | 'collaborateurReferent' | 'dateDeCloture', title: string, options: string[]) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2 h-auto text-left justify-start w-full">
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
  
  const renderStepFilter = (columnId: string, title: string) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 p-2 h-auto text-left justify-start w-full">
          {title}
          {columnFilters[columnId] ? <Filter className="h-3 w-3 text-primary" /> : <Filter className="h-3 w-3 opacity-50" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="space-y-2">
          <Label>Filtrer par {title}</Label>
          <RadioGroup
            value={columnFilters[columnId] || 'tous'}
            onValueChange={value => {
              setColumnFilters(prev => ({ ...prev, [columnId]: value === 'tous' ? undefined : value }));
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tous" id={`${columnId}-tous`} />
              <Label htmlFor={`${columnId}-tous`} className="font-normal">Tous</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="oui" id={`${columnId}-oui`} />
              <Label htmlFor={`${columnId}-oui`} className="font-normal">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="non" id={`${columnId}-non`} />
              <Label htmlFor={`${columnId}-non`} className="font-normal">Non</Label>
            </div>
          </RadioGroup>
        </div>
      </PopoverContent>
    </Popover>
  );

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
                  <TableHead rowSpan={2} className="align-bottom whitespace-nowrap p-0">{renderTextFilter('identifiantInterne', 'Identifiant interne')}</TableHead>
                  <TableHead rowSpan={2} className="align-bottom whitespace-nowrap p-0">{renderTextFilter('raisonSociale', 'Raison sociale')}</TableHead>
                  <TableHead rowSpan={2} className="align-bottom whitespace-nowrap p-0">{renderCheckboxFilter('expertComptable', 'Expert-comptable', filterOptions.expertsComptables)}</TableHead>
                  <TableHead rowSpan={2} className="align-bottom whitespace-nowrap p-0">{renderCheckboxFilter('collaborateurReferent', 'Collaborateur référent', filterOptions.collaborateursReferents)}</TableHead>
                  <TableHead rowSpan={2} className="align-bottom whitespace-nowrap p-0">{renderCheckboxFilter('dateDeCloture', 'Date de clôture', filterOptions.datesDeCloture)}</TableHead>
                  <TableHead rowSpan={2} className="align-bottom whitespace-nowrap px-4">Date prévisionnelle</TableHead>
                  <TableHead colSpan={2} className="text-center border-l">1. Création & Paramétrage</TableHead>
                  <TableHead colSpan={2} className="text-center border-l">2. Remontée Données</TableHead>
                  <TableHead colSpan={3} className="text-center border-l">3. Information Client</TableHead>
                </TableRow>
                <TableRow>
                    <TableHead className="text-center border-l p-0">{renderStepFilter('paramInfoClient', 'Param. Infos Client')}</TableHead>
                    <TableHead className="text-center p-0">{renderStepFilter('paramBanque', 'Param. Banque')}</TableHead>
                    <TableHead className="text-center border-l p-0">{renderStepFilter('remonteeFEC', 'FEC')}</TableHead>
                    <TableHead className="text-center p-0">{renderStepFilter('remonteeImmobilisations', 'Immobilisations')}</TableHead>
                    <TableHead className="text-center border-l p-0">{renderStepFilter('infoMail', 'Info Mail')}</TableHead>
                    <TableHead className="text-center p-0">{renderStepFilter('presentationOutil', 'Présentation Outil')}</TableHead>
                    <TableHead className="text-center p-0">{renderStepFilter('mandatPA', 'Mandat PA')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingClients && Array.from({length: 3}).map((_, i) => (
                    <TableRow key={`loading-${i}`}>
                        <TableCell><MoreHorizontal className="h-4 w-4" /></TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell>...</TableCell>
                        <TableCell colSpan={7} className="text-center">...</TableCell>
                    </TableRow>
                ))}
                {filteredClients && filteredClients.map((client) => (
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
                    
                    <TableCell onClick={() => handleRowClick(client)} className={cn("whitespace-nowrap cursor-pointer")}>
                        {client.identifiantInterne}
                    </TableCell>
                     <TableCell onClick={() => handleRowClick(client)} className={cn("whitespace-nowrap cursor-pointer", "font-medium")}>
                        {client.raisonSociale}
                    </TableCell>
                     <TableCell onClick={() => handleRowClick(client)} className={cn("whitespace-nowrap cursor-pointer")}>
                        {client.missionsActuelles.expertComptable}
                    </TableCell>
                     <TableCell onClick={() => handleRowClick(client)} className={cn("whitespace-nowrap cursor-pointer")}>
                        {client.missionsActuelles.collaborateurReferent}
                    </TableCell>
                     <TableCell onClick={() => handleRowClick(client)} className={cn("whitespace-nowrap cursor-pointer")}>
                        {client.dateDeCloture}
                    </TableCell>
                    
                    <TableCell onClick={(e) => e.stopPropagation()}>
                        <Input 
                            type="text" 
                            placeholder="JJ/MM/AAAA" 
                            value={client.datePrevisionnelleMigration || ''}
                            onChange={(e) => handleDateChange(client, e.target.value)}
                            className="w-32"
                        />
                    </TableCell>

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
