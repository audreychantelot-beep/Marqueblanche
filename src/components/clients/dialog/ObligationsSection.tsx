'use client';

import React, { useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Client } from "@/lib/clients-data";

type ClientWithId = Client & { id: string };

interface ObligationsSectionProps {
    editedClient: ClientWithId;
    setEditedClient: React.Dispatch<React.SetStateAction<ClientWithId | null>>;
}

const inputStyle = "bg-white dark:bg-zinc-800 border-none font-medium";

const obligationFields = [
    { id: "assujettiReforme", label: "Assujetti à la réforme" },
    { id: "eInvoicing", label: "Concerné par le e-invoicing" },
    { id: "eReportingTransaction", label: "Concerné par le e-reporting transaction" },
    { id: "eReportingPaiement", label: "Concerné par le e-reporting paiement" },
    { id: "paEmission", label: "Obligation PA émission" },
    { id: "paReception", label: "Obligation PA réception" },
];

const getStatusColorText = (value: string | undefined) => {
    if (value === 'Oui') return 'text-green-600 dark:text-green-500';
    if (value === 'Non') return 'text-red-600 dark:text-red-500';
    return 'text-muted-foreground';
};

const getScoringColor = (value: string | undefined) => {
    if (value === 'Fortes') return 'text-green-600 dark:text-green-500';
    if (value === 'Intermédiaire') return 'text-orange-500 dark:text-orange-400';
    if (value === 'Faibles') return 'text-blue-600 dark:text-blue-500';
    return 'text-muted-foreground';
};

export function ObligationsSection({ editedClient, setEditedClient }: ObligationsSectionProps) {

    const assujettiReformeValue = useMemo(() => {
        if (!editedClient) return "À définir";
        const regimeTVA = editedClient.activites.regimeTVA;
        if (regimeTVA === "Débit" || regimeTVA === "Encaissement") return "Oui";
        if (regimeTVA === "Non concerné") return "Non";
        return "À définir";
    }, [editedClient]);

    const eInvoicingValue = useMemo(() => {
        if (!editedClient) return "À définir";
        const typologie = editedClient.activites.typologieClientele;
        if (typologie === "B to B" || typologie === "Mixtes") return "Oui";
        if (typologie === "B to C" || typologie === "Organismes publics") return "Non";
        return "À définir";
    }, [editedClient]);

    const eReportingTransactionValue = useMemo(() => {
        if (!editedClient) return "À définir";
        const typologie = editedClient.activites.typologieClientele;
        if (typologie === "B to C" || typologie === "Mixtes") return "Oui";
        if (typologie === "B to B" || typologie === "Organismes publics") return "Non";
        return "À définir";
    }, [editedClient]);

    const eReportingPaiementValue = useMemo(() => {
        if (!editedClient) return "À définir";
        const regimeTVA = editedClient.activites.regimeTVA;
        if (regimeTVA === "Encaissement") return "Oui";
        return "Non";
    }, [editedClient]);

    const paEmissionValue = useMemo(() => {
        if (eInvoicingValue === "Oui") return "Oui";
        if (eInvoicingValue === "Non") return "Non";
        return "À définir";
    }, [eInvoicingValue]);

    const paReceptionValue = useMemo(() => {
        if (assujettiReformeValue === "Oui") return "Oui";
        if (assujettiReformeValue === "Non") return "Non";
        return "À définir";
    }, [assujettiReformeValue]);

    const obligationScore = useMemo(() => {
        if (!editedClient) return { score: 0, level: "À définir" };

        let score = 0;
        const { regimeTVA, typologieClientele } = editedClient.activites;

        // Scoring for regimeTVA
        if (regimeTVA === "Débit") {
            score += 1;
        } else if (regimeTVA === "Encaissement") {
            score += 2;
        }

        // Scoring for typologieClientele
        if (typologieClientele === "Mixtes") {
            score += 3;
        } else if (["B to B", "B to C", "Organismes publics"].includes(typologieClientele)) {
            score += 1;
        }

        let level = "À définir";
        if (score >= 3) {
            level = "Fortes";
        } else if (score === 2) {
            level = "Intermédiaire";
        } else if (score === 1) {
            level = "Faibles";
        } else if (score === 0 && (regimeTVA || typologieClientele)) {
             // If we have data but score is 0, it's considered low.
             level = "Faibles";
        }
        
        return { score, level };
    }, [editedClient]);

    useEffect(() => {
        if (editedClient) {
            const newObligations = {
                assujettiReforme: assujettiReformeValue,
                eInvoicing: eInvoicingValue,
                eReportingTransaction: eReportingTransactionValue,
                eReportingPaiement: eReportingPaiementValue,
                paEmission: paEmissionValue,
                paReception: paReceptionValue,
                niveauObligation: obligationScore.level,
            };
            
            if (JSON.stringify(newObligations) !== JSON.stringify(editedClient.obligationsLegales)) {
                setEditedClient(prev => {
                    if (!prev) return null;
                    const newClient = JSON.parse(JSON.stringify(prev));
                    newClient.obligationsLegales = newObligations;
                    return newClient;
                });
            }
        }
    }, [editedClient, assujettiReformeValue, eInvoicingValue, eReportingTransactionValue, eReportingPaiementValue, paEmissionValue, paReceptionValue, obligationScore.level, setEditedClient]);
    
    return (
        <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5 text-muted-foreground" />Obligations</CardTitle></CardHeader>
            <CardContent>
                <div className="flex items-center justify-between text-sm">
                    <Label className="font-semibold">Niveau d'obligation</Label>
                    <p className={cn("font-bold text-lg", getScoringColor(obligationScore.level))}>
                        {obligationScore.level}
                    </p>
                </div>
                 <div className="flex items-center justify-between text-sm mt-2">
                    <Label className="text-muted-foreground">Score</Label>
                    <p className="font-medium">{obligationScore.score}</p>
                </div>
                
                <div className='border-b my-4'></div>

                <div className="grid grid-cols-1 sm:grid-cols-1 gap-x-4 gap-y-2 text-left">
                    {obligationFields.map(field => {
                        const value = (editedClient.obligationsLegales as any)?.[field.id] || "À définir";
                        return (
                            <div key={field.id} className="flex items-center justify-between space-y-2 text-sm">
                                <Label htmlFor={`obligationsLegales.${field.id}`} className="text-muted-foreground">{field.label}</Label>
                                <Input
                                    id={`obligationsLegales.${field.id}`}
                                    name={`obligationsLegales.${field.id}`}
                                    value={value}
                                    readOnly
                                    className={cn(inputStyle, "text-right max-w-[100px] border-none p-0 h-auto", getStatusColorText(value))}
                                    disabled
                                />
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
