'use client';

import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, FileQuestion } from "lucide-react";
import { type Client } from "@/lib/clients-data";

type ClientWithId = Client & { id: string };

interface ClientDialogHeaderProps {
    client: ClientWithId | null;
    raisonSociale: string;
    completionPercentage: number;
    onOpenChange: (isOpen: boolean) => void;
    setIsQuestionnaireOpen: (isOpen: boolean) => void;
    handleSave: () => void;
}

export function ClientDialogHeader({ client, raisonSociale, completionPercentage, onOpenChange, setIsQuestionnaireOpen, handleSave }: ClientDialogHeaderProps) {
    return (
        <DialogHeader>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <DialogTitle>{client?.id ? 'Modifier le client' : 'Ajouter un nouveau client'}: {raisonSociale}</DialogTitle>
                    <DialogDescription>
                        Gérez les informations de votre client.
                    </DialogDescription>
                    <div className="text-muted-foreground mt-2 flex items-center gap-4">
                        <div>
                            {completionPercentage === 100 ? (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Profil complet</span>
                                </div>
                            ) : (
                                <span className='text-sm'>Profil complet à {Math.round(completionPercentage)}%</span>
                            )}
                            <Progress value={completionPercentage} className="mt-1 h-2" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="outline" onClick={() => setIsQuestionnaireOpen(true)}>
                        <FileQuestion className="mr-2 h-4 w-4" />
                        Questionnaire
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                    <Button onClick={handleSave}>Sauvegarder</Button>
                </div>
                <DialogClose className="invisible mr-8" />
            </div>
        </DialogHeader>
    );
}
