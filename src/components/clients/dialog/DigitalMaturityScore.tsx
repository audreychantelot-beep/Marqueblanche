'use client';

import React, { useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Questionnaire, type Client } from "@/lib/clients-data";

type ClientWithId = Client & { id: string };

interface DigitalMaturityScoreProps {
    questionnaire?: Questionnaire;
    setEditedClient: React.Dispatch<React.SetStateAction<ClientWithId | null>>;
}

const getScoringColor = (value: string | undefined) => {
    if (value === 'Élevée') return 'text-green-600 dark:text-green-500';
    if (value === 'Intermédiaire') return 'text-orange-500 dark:text-orange-400';
    if (value === 'Faible') return 'text-red-600 dark:text-red-500';
    return 'text-muted-foreground';
};

export function DigitalMaturityScore({ questionnaire, setEditedClient }: DigitalMaturityScoreProps) {

    const digitalMaturity = useMemo(() => {
        if (!questionnaire || Object.keys(questionnaire).length === 0) {
            return { score: 0, level: "À définir" };
        }

        let score = 0;
        if (questionnaire.q4 === 'Oui') score += 2;
        if (questionnaire.q5 === 'Oui') score += 2;
        if (questionnaire.q6 === 'Oui') score += 3;
        if (questionnaire.q7 === 'Oui') score += 2;
        if (questionnaire.q8 === 'Oui') score += 3;
        
        if (questionnaire.q9 === 'paper') score -= 2;
        else if (questionnaire.q9 === 'digital') score += 1;
        else if (questionnaire.q9 === 'mixed') score -= 1;
        
        if (questionnaire.q11 === 'papier') score -= 2;
        else if (questionnaire.q11 === 'platform') score += 2;
        
        if (questionnaire.q12 === 'Oui') score += 2;

        let level = "À définir";
        if (score <= 6) level = "Faible";
        if (score >= 7) level = "Intermédiaire";
        if (score >= 11) level = "Élevée";

        return { score, level };
    }, [questionnaire]);

    useEffect(() => {
        setEditedClient(prev => {
            if (!prev) return null;
            if (prev.maturiteDigitale === digitalMaturity.level) return prev;
            
            const newClient = JSON.parse(JSON.stringify(prev));
            newClient.maturiteDigitale = digitalMaturity.level;
            return newClient;
        });
    }, [digitalMaturity.level, setEditedClient]);

    return (
        <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-muted-foreground" />Maturité Digitale</CardTitle></CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm">
                    <Label className="font-semibold">Niveau de maturité</Label>
                    <p className={cn("font-bold text-lg", getScoringColor(digitalMaturity.level))}>
                        {digitalMaturity.level}
                    </p>
                </div>
                 <div className="flex items-center justify-between text-sm mt-2">
                    <Label className="text-muted-foreground">Score</Label>
                    <p className="font-medium">{digitalMaturity.score}</p>
                </div>
            </CardContent>
        </Card>
    );
}
