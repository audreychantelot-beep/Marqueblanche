'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, FileQuestion, ArrowLeft } from "lucide-react";
import { type Client } from "@/lib/clients-data";
import { useRouter } from 'next/navigation';

type ClientWithId = Client & { id: string };

interface ClientPageHeaderProps {
    client: ClientWithId | null;
    raisonSociale: string;
    completionPercentage: number;
    handleSave: () => void;
    isNewClient: boolean;
    onOpenQuestionnaire: () => void;
}

export function ClientPageHeader({ client, raisonSociale, completionPercentage, handleSave, isNewClient, onOpenQuestionnaire }: ClientPageHeaderProps) {
    const router = useRouter();
    
    return (
        <header className="bg-card p-4 border-b">
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/clients')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl font-semibold">{isNewClient ? 'Ajouter un nouveau client' : `Modifier: ${raisonSociale}`}</h1>
                    </div>
                    <div className="text-muted-foreground ml-14 flex items-center gap-4">
                        <div>
                            {completionPercentage === 100 ? (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle className="w-4 h-4" />
                                    <span>Profil complet</span>
                                </div>
                            ) : (
                                <span className='text-sm'>Profil complet à {Math.round(completionPercentage)}%</span>
                            )}
                            <Progress value={completionPercentage} className="mt-1 h-2 w-48" />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Button 
                        variant="outline" 
                        onClick={onOpenQuestionnaire}
                        disabled={isNewClient}
                    >
                        <FileQuestion className="mr-2 h-4 w-4" />
                        Questionnaire
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/clients')}>Annuler</Button>
                    <Button onClick={handleSave}>Sauvegarder</Button>
                </div>
            </div>
        </header>
    );
}
