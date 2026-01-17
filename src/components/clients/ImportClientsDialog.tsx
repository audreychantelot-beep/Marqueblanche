'use client';

import React from 'react';
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
import { XCircle } from 'lucide-react';

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full h-[90vh] flex flex-col rounded-3xl">
        <DialogHeader>
          <DialogTitle>Aperçu des données importées</DialogTitle>
          <DialogDescription>
            Voici les données lues depuis votre fichier. Vérifiez que les colonnes et les lignes sont correctes. L'étape suivante consistera à faire correspondre ces colonnes aux champs des clients.
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
                    <TableHead key={index}>{header || `Colonne ${index + 1}`}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {headers.map((_, cellIndex) => (
                       <TableCell key={cellIndex}>{row[cellIndex]}</TableCell>
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
              ? `Aperçu des ${data.length} premières lignes de données.`
              : 'Aucune donnée à afficher.'}
          </div>
          <div>
            <DialogClose asChild>
              <Button variant="outline">Fermer</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
