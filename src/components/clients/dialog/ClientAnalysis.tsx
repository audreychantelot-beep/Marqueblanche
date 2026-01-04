'use client';

import React, { useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Client, type Questionnaire } from "@/lib/clients-data";

type ClientWithId = Client & { id: string };

interface ClientAnalysisProps {
    editedClient: ClientWithId;
    setEditedClient: React.Dispatch<React.SetStateAction<ClientWithId | null>>;
}

const getMaturityColor = (value: string | undefined) => {
    if (value === 'Élevée') return 'text-green-600 dark:text-green-500';
    if (value === 'Intermédiaire') return 'text-orange-500 dark:text-orange-400';
    if (value === 'Faible') return 'text-red-600 dark:text-red-500';
    return 'text-muted-foreground';
};

const getObligationColor = (value: string | undefined) => {
    if (value === 'Fortes') return 'text-green-600 dark:text-green-500';
    if (value === 'Intermédiaire') return 'text-orange-500 dark:text-orange-400';
    if (value === 'Faibles') return 'text-blue-600 dark:text-blue-500';
    return 'text-muted-foreground';
};

export function ClientAnalysis({ editedClient, setEditedClient }: ClientAnalysisProps) {

    const digitalMaturity = useMemo(() => {
        const questionnaire = editedClient.questionnaire;
        if (!questionnaire || Object.keys(questionnaire).length === 0) {
            return { score: 0, level: "À définir" };
        }

        let score = 0;
        if (questionnaire.q4 === 'Oui') score += 2;
        if (questionnaire.q5 === 'Oui') score += 2;
        if (questionnaire.q6 === 'Oui') score += 3;
        if (questionnaire.q7 === 'Oui') score += 2;
        if (questionnaire.q8 === 'Oui') score += 3;
        if (questionnaire.q9 === 'digital') score += 1;
        else if (questionnaire.q9 === 'paper') score -= 2;
        else if (questionnaire.q9 === 'mixed') score -= 1;
        if (questionnaire.q11 === 'platform') score += 2;
        else if (questionnaire.q11 === 'papier') score -= 2;
        if (questionnaire.q12 === 'Oui') score += 2;

        let level = "À définir";
        if (score <= 6) level = "Faible";
        if (score >= 7 && score <=10) level = "Intermédiaire";
        if (score >= 11) level = "Élevée";

        return { score, level };
    }, [editedClient.questionnaire]);
    
    const obligationScore = useMemo(() => {
        if (!editedClient) return { score: 0, level: "À définir" };

        let score = 0;
        const { regimeTVA, typologieClientele } = editedClient.activites;

        if (regimeTVA === "Débit") score += 1;
        else if (regimeTVA === "Encaissement") score += 2;

        if (typologieClientele === "Mixtes") score += 3;
        else if (["B to B", "B to C", "Organismes publics"].includes(typologieClientele)) score += 1;

        let level = "À définir";
        if (score >= 3) level = "Fortes";
        else if (score === 2) level = "Intermédiaire";
        else if (score <= 1 && (regimeTVA || typologieClientele)) level = "Faibles";
        
        return { score, level };
    }, [editedClient.activites]);

    useEffect(() => {
        setEditedClient(prev => {
            if (!prev) return null;
            if (prev.maturiteDigitale === digitalMaturity.level && prev.obligationsLegales.niveauObligation === obligationScore.level) return prev;
            
            const newClient = JSON.parse(JSON.stringify(prev));
            newClient.maturiteDigitale = digitalMaturity.level;
            newClient.obligationsLegales.niveauObligation = obligationScore.level;
            return newClient;
        });
    }, [digitalMaturity.level, obligationScore.level, setEditedClient]);

    return (
        <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-muted-foreground" />Analyse du client</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between text-sm">
                            <Label className="font-semibold">Niveau de maturité Digitale</Label>
                            <p className={cn("font-bold text-lg", getMaturityColor(digitalMaturity.level))}>
                                {digitalMaturity.level}
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <Label className="text-muted-foreground">Score</Label>
                            <p className="font-medium">{digitalMaturity.score}</p>
                        </div>
                    </div>
                    <div className='border-b'></div>
                    <div>
                        <div className="flex items-center justify-between text-sm">
                            <Label className="font-semibold">Niveau d'obligation</Label>
                            <p className={cn("font-bold text-lg", getObligationColor(obligationScore.level))}>
                                {obligationScore.level}
                            </p>
                        </div>
                        <div className="flex items-center justify-between text-sm mt-1">
                            <Label className="text-muted-foreground">Score</Label>
                            <p className="font-medium">{obligationScore.score}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
