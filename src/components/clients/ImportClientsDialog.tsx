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
import { type Client } from '@/lib/clients-data';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

interface ImportClientsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  clientsToImport: Partial<Client>[];
  onImportConfirm: () => void;
  importErrors: string[];
}

// A simplified client type for the preview table
type ClientPreview = {
  raisonSociale: string;
  siren: string;
  email: string;
  status: 'valid' | 'invalid';
  errors: string[];
};

const validateClient = (client: Partial<Client>): { isValid: boolean, errors: string[] } => {
    const errors: string[] = [];
    if (!client.raisonSociale) errors.push("Raison sociale manquante");
    if (!client.siren) errors.push("SIREN manquant");
    
    return { isValid: errors.length === 0, errors };
}

export function ImportClientsDialog({
  isOpen,
  onOpenChange,
  clientsToImport,
  onImportConfirm,
  importErrors
}: ImportClientsDialogProps) {

  const clientPreviews: ClientPreview[] = clientsToImport.map(client => {
      const { isValid, errors } = validateClient(client);
      return {
          raisonSociale: client.raisonSociale || 'N/A',
          siren: client.siren || 'N/A',
          email: client.contactPrincipal?.email || 'N/A',
          status: isValid ? 'valid' : 'invalid',
          errors: errors
      }
  });

  const validClientsCount = clientPreviews.filter(c => c.status === 'valid').length;
  const invalidClientsCount = clientPreviews.length - validClientsCount;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-full h-[90vh] flex flex-col rounded-3xl">
        <DialogHeader>
          <DialogTitle>Aperçu de l'importation</DialogTitle>
          <DialogDescription>
            Vérifiez les données des clients avant de finaliser l'importation. Seuls les clients valides (en vert) seront importés.
          </DialogDescription>
        </DialogHeader>
        
        {(importErrors.length > 0) && (
             <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Erreurs de lecture du fichier</AlertTitle>
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
                    <TableHead>Statut</TableHead>
                    <TableHead>Raison Sociale</TableHead>
                    <TableHead>SIREN</TableHead>
                    <TableHead>Email Contact</TableHead>
                    <TableHead>Erreurs</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {clientPreviews.map((client, index) => (
                    <TableRow key={index} className={client.status === 'invalid' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}>
                        <TableCell>
                            {client.status === 'valid' ? <CheckCircle className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-red-600" />}
                        </TableCell>
                        <TableCell>{client.raisonSociale}</TableCell>
                        <TableCell>{client.siren}</TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell className="text-red-600 text-xs">
                           {client.errors.join(', ')}
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </ScrollArea>
        </div>

        <DialogFooter className="flex-row justify-between items-center w-full">
            <div className="text-sm text-muted-foreground">
                <p><span className="font-bold text-green-600">{validClientsCount}</span> clients valides prêts à être importés.</p>
                {invalidClientsCount > 0 && <p><span className="font-bold text-red-600">{invalidClientsCount}</span> clients invalides seront ignorés.</p>}
            </div>
            <div>
                 <DialogClose asChild>
                    <Button variant="outline">Annuler</Button>
                </DialogClose>
                <Button onClick={onImportConfirm} disabled={validClientsCount === 0} className="ml-2">
                    Importer {validClientsCount} client(s)
                </Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
