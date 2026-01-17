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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { XCircle, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { clientImportFields } from '@/lib/clients-data';

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

  const handleMappingChange = (header: string, targetField: string) => {
    const newMappings = { ...mappings };

    // Find which header is already using this target and clear its mapping
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

        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
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
          </ScrollArea>
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
            <Button>
              Vérifier les données <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
