'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { clientImportFields, type Client } from '@/lib/clients-data';
import { useUser, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface ImportClientsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  headers: string[];
  data: any[][];
  importErrors: string[];
}

export function ImportClientsDialog({
  isOpen,
  onOpenChange,
  headers,
  data,
  importErrors,
}: ImportClientsDialogProps) {
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [isImporting, setIsImporting] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleMappingChange = (header: string, targetField: string) => {
    const newMappings = { ...mappings };

    if (targetField !== 'ignore' && Object.values(newMappings).includes(targetField)) {
        const existingHeader = Object.keys(newMappings).find(key => newMappings[key] === targetField);
        if (existingHeader) {
            delete newMappings[existingHeader];
        }
    }

    if (targetField === 'ignore') {
        delete newMappings[header];
    } else {
        newMappings[header] = targetField;
    }
    setMappings(newMappings);
  };
  
  const handleImport = async () => {
    if (!user || !firestore || data.length === 0 || Object.keys(mappings).length === 0) {
      toast({
        variant: "destructive",
        title: "Importation échouée",
        description: "Veuillez mapper au moins une colonne et réessayer.",
      });
      return;
    }

    setIsImporting(true);
    let importedCount = 0;
    const clientsCollectionRef = collection(firestore, 'users', user.uid, 'clients');

    const headerIndexMap: Record<string, number> = {};
    headers.forEach((header, index) => {
      headerIndexMap[header] = index;
    });

    const importPromises = data.map(async (row) => {
      const newClient: Partial<Client> & { contactPrincipal?: any; missionsActuelles?: any; activites?: any } = {
        avatar: `https://picsum.photos/seed/${Math.random()}/40/40`,
        obligationsLegales: {},
        questionnaire: {},
        outils: {},
        maturiteDigitale: "À définir",
        cartographieClient: "À définir",
        actionsAMener: [],
      };
      
      let hasRequiredField = false;

      for (const header in mappings) {
        const targetField = mappings[header];
        const cellIndex = headerIndexMap[header];
        const cellValue = row[cellIndex];
        
        if (cellValue !== undefined && cellValue !== null) {
          const keys = targetField.split('.');
          let current: any = newClient;
          for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined) {
              current[keys[i]] = {};
            }
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = String(cellValue);

          if (targetField === 'raisonSociale' && String(cellValue).trim() !== '') {
            hasRequiredField = true;
          }
        }
      }

      if (hasRequiredField) {
        if (!newClient.identifiantInterne) {
          newClient.identifiantInterne = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        }
        if(!newClient.contactPrincipal) newClient.contactPrincipal = {nom: '', prenom: '', email: ''};
        if(!newClient.missionsActuelles) newClient.missionsActuelles = {collaborateurReferent: '', expertComptable: '', typeMission: ''};
        if(!newClient.activites) newClient.activites = {codeAPE: '', secteurActivites: '', regimeTVA: '', regimeFiscal: '', typologieClientele: ''};

        try {
          await addDocumentNonBlocking(clientsCollectionRef, newClient);
          importedCount++;
        } catch (e) {
          console.error("Error importing a client row:", e);
        }
      }
    });

    await Promise.all(importPromises);

    setIsImporting(false);
    toast({
      title: "Importation terminée",
      description: `${importedCount} client(s) sur ${data.length} ont été importés avec succès.`,
    });
    onOpenChange(false);
  };

  const usedTargetFields = Object.values(mappings);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full h-[90vh] flex flex-col rounded-3xl">
        <DialogHeader>
          <DialogTitle>Étape 2: Mapper les colonnes</DialogTitle>
          <DialogDescription>
            Faites correspondre les colonnes de votre fichier aux champs de données des clients. Les colonnes non mappées seront ignorées.
          </DialogDescription>
        </DialogHeader>

        {importErrors.length > 0 && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Erreur de lecture du fichier</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5">
                {importErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead key={index} className="min-w-[200px]">
                    <div className="flex flex-col gap-2">
                        <span className="font-bold text-foreground">{header || `Colonne ${index + 1}`}</span>
                        <Select onValueChange={(value) => handleMappingChange(header, value)} value={mappings[header] || ''}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Mapper à un champ..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ignore">Ignorer cette colonne</SelectItem>
                                {Object.entries(clientImportFields).map(([key, label]) => (
                                    <SelectItem key={key} value={key} disabled={usedTargetFields.includes(key) && mappings[header] !== key}>
                                      {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.slice(0, 5).map((row, rowIndex) => ( // Show only first 5 rows as preview
                <TableRow key={rowIndex}>
                  {headers.map((_, cellIndex) => (
                     <TableCell key={cellIndex} className="truncate max-w-[200px]">{row[cellIndex]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <DialogFooter className="flex-row justify-between items-center w-full">
          <div className="text-sm text-muted-foreground">
            {data.length > 0
              ? `Prévisualisation des 5 premières lignes sur ${data.length}.`
              : 'Aucune donnée à afficher.'}
          </div>
          <div className='flex gap-2'>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Importer
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
