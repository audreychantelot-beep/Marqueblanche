'use client';

import React, { useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Client, type Questionnaire } from "@/lib/clients-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type ClientWithId = Client & { id: string };

interface ClientAnalysisProps {
    editedClient: ClientWithId;
    setEditedClient: React.Dispatch<React.SetStateAction<ClientWithId | null>>;
}

const getMaturityColor = (value: string | undefined) => {
    if (value === 'Élevée') return 'text-blue-500 dark:text-blue-400';
    if (value === 'Intermédiaire') return 'text-blue-500 dark:text-blue-400';
    if (value === 'Faible') return 'text-red-600 dark:text-red-500';
    return 'text-orange-500 dark:text-orange-400';
};

const getObligationColor = (value: string | undefined) => {
    if (value === 'Fortes') return 'text-blue-500 dark:text-blue-400';
    if (value === 'Intermédiaire') return 'text-blue-500 dark:text-blue-400';
    if (value === 'Faibles') return 'text-blue-500 dark:text-blue-400';
    return 'text-orange-500 dark:text-orange-400';
};

const getCartographieStyle = (cartographie: string) => {
    if (cartographie.startsWith('Priorité haute')) return { text: 'text-red-800 dark:text-red-200', bg: 'bg-red-100 dark:bg-red-900/50' };
    return { text: 'text-blue-800 dark:text-blue-200', bg: 'bg-blue-100 dark:bg-blue-900/50' };
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

    const cartographieClient = useMemo(() => {
        const maturite = digitalMaturity.level;
        const obligation = obligationScore.level;

        if (maturite === 'À définir' || obligation === 'À définir') return 'À définir';

        const isObligationHighOrMedium = obligation === 'Fortes' || obligation === 'Intermédiaire';
        const isMaturiteLowOrMedium = maturite === 'Faible' || maturite === 'Intermédiaire';

        if (isObligationHighOrMedium && maturite === 'Faible') {
            return 'Priorité haute - Clients en risques de non conformité';
        }
        
        if (isObligationHighOrMedium && maturite === 'Intermédiaire') {
            return 'priorité intermédiaire - clients à opportunités émergentes';
        }

        if (isObligationHighOrMedium && maturite === 'Élevée') {
            return 'priorité faible - clients innovants et stratégiques';
        }

        if (obligation === 'Faibles' && maturite === 'Élevée') {
            return 'Priorité faible - Clients innovants et stratégiques';
        }

        if (obligation === 'Faibles' && isMaturiteLowOrMedium) {
            return 'priorité intermédiaire - clients à opportunités émergentes';
        }

        return 'À définir';
    }, [digitalMaturity.level, obligationScore.level]);

    useEffect(() => {
        setEditedClient(prev => {
            if (!prev) return null;
            if (prev.maturiteDigitale === digitalMaturity.level && prev.obligationsLegales.niveauObligation === obligationScore.level && prev.cartographieClient === cartographieClient) return prev;
            
            const newClient = JSON.parse(JSON.stringify(prev));
            newClient.maturiteDigitale = digitalMaturity.level;
            newClient.obligationsLegales.niveauObligation = obligationScore.level;
            newClient.cartographieClient = cartographieClient;
            return newClient;
        });
    }, [digitalMaturity.level, obligationScore.level, cartographieClient, setEditedClient]);

    const handleActionChange = (value: string) => {
        setEditedClient(prev => {
            if (!prev) return null;
            if (prev.actionsAMener === value) {
                return prev;
            }
            const newClient = JSON.parse(JSON.stringify(prev));
            newClient.actionsAMener = value;
            return newClient;
        });
    };
    
    const cartoStyle = getCartographieStyle(cartographieClient);

    return (
        <Card className="rounded-3xl h-full flex flex-col">
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-muted-foreground" />Analyse du client</CardTitle></CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <div className="space-y-6 flex-1 flex flex-col justify-between">
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
                    <div className='border-b'></div>
                    <div>
                        <Label className="font-semibold text-sm">Cartographie du client</Label>
                        <div className={cn("mt-2 rounded-lg p-3 text-center", cartoStyle.bg)}>
                            <p className={cn("font-semibold text-sm", cartoStyle.text)}>
                                {cartographieClient}
                            </p>
                        </div>
                    </div>
                    <div className='border-b'></div>
                    <div>
                        <Label className="font-semibold text-sm">Actions à mener</Label>
                        <Select onValueChange={handleActionChange} value={editedClient.actionsAMener || ''}>
                            <SelectTrigger className={cn("w-full mt-2 rounded-3xl", !editedClient.actionsAMener && "border border-orange-500 text-orange-500")}>
                                <SelectValue placeholder="Sélectionner une action..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="migration">Migration sur l'outil du cabinet</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
