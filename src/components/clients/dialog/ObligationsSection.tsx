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

const inputStyle = "bg-white dark:bg-zinc-800 border-none";

const obligationFields = [
    { id: "assujettiReforme", label: "Assujetti à la réforme" },
    { id: "eInvoicing", label: "Concerné par le e-invoicing" },
    { id: "eReportingTransaction", label: "Concerné par le e-reporting transaction" },
    { id: "eReportingPaiement", label: "Concerné par le e-reporting paiement" },
    { id: "paEmission", label: "Obligation PA émission" },
    { id: "paReception", label: "Obligation PA réception" },
];

const getStatusColor = (value: string | undefined) => {
    if (value === 'Oui') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (value === 'Non') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return '';
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

    useEffect(() => {
        if (editedClient) {
            const newObligations = {
                assujettiReforme: assujettiReformeValue,
                eInvoicing: eInvoicingValue,
                eReportingTransaction: eReportingTransactionValue,
                eReportingPaiement: eReportingPaiementValue,
                paEmission: paEmissionValue,
                paReception: paReceptionValue,
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
    }, [editedClient, assujettiReformeValue, eInvoicingValue, eReportingTransactionValue, eReportingPaiementValue, paEmissionValue, paReceptionValue, setEditedClient]);

    return (
        <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5 text-muted-foreground" />Obligations</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-left">
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
                                className={cn(inputStyle, "text-right max-w-[100px]", getStatusColor(value))}
                                disabled
                            />
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}
