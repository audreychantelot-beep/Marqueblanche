'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Construction } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Client, type Questionnaire } from "@/lib/clients-data";

type ClientWithId = Client & { id: string };

interface ToolsSectionProps {
    editedClient: ClientWithId;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleValueChange: (name: string, value: string) => void;
}

const inputStyle = "bg-white dark:bg-zinc-800 border-none";

const getStatusColor = (value: string | undefined) => {
    if (value === 'Oui') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    if (value === 'Non') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    return '';
};

const toolFields = [
    { id: "logicielCaisse", label: "Logiciel de caisse", type: "questionnaire", question: "q4" },
    { id: "genereEReporting", label: "Génère le e-reporting", type: "select" },
    { id: "logicielFacturation", label: "Logiciel de facturation", type: "questionnaire", question: "q5" },
    { id: "conformeFacturationElectronique", label: "Conforme facturation électronique", type: "select" },
    { id: "logicielGestionAchats", label: "Logiciel de gestion des achats", type: "questionnaire", question: "q6" },
    { id: "interoperableComptable", label: "Interopérable avec le logiciel comptable", type: "select" },
    { id: "interoperablePaEmission", label: "Interopérable avec la PA en émission", type: "select" },
    { id: "logicielComptableClient", label: "Logiciel comptable du client", type: "questionnaire", question: "q7" },
    { id: "interoperableAutresLogiciels", label: "Interopérable avec les autres logiciels", type: "select" },
    { id: "logicielNotesFrais", label: "Logiciel de gestion des notes de frais", type: "select" },
];

export function ToolsSection({ editedClient, handleChange, handleValueChange }: ToolsSectionProps) {
    return (
        <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Construction className="w-5 h-5 text-muted-foreground" />Outils</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 gap-y-4 text-left text-sm">
                {toolFields.map(field => {
                    if (field.type === 'questionnaire') {
                        const qKey = field.question as keyof Questionnaire;
                        const answer = editedClient.questionnaire?.[qKey] || "N/A";
                        let detail: string | undefined;

                        if (answer === 'Oui') {
                            const softwareKey = `${qKey}_software` as keyof Questionnaire;
                            detail = editedClient.questionnaire?.[softwareKey]
                        } else if (answer === 'Non') {
                            const methodKey = `${qKey}_method` as keyof Questionnaire;
                            detail = editedClient.questionnaire?.[methodKey]
                        }

                        return (
                            <div key={field.id} className="flex items-center justify-between">
                                <Label htmlFor={`outils.${field.id}`} className="text-muted-foreground">{field.label}</Label>
                                <div className="flex items-center gap-2 max-w-[200px]">
                                    <Input
                                        value={answer.toString()}
                                        disabled
                                        className={cn(inputStyle, "w-16 text-center", getStatusColor(answer.toString()))}
                                    />
                                    <Input
                                        value={detail || ''}
                                        disabled
                                        className={cn(inputStyle, "flex-1")}
                                    />
                                </div>
                            </div>
                        )
                    }

                    if (field.type === 'text') {
                        return (
                            <div key={field.id} className="flex items-center justify-between">
                                <Label htmlFor={`outils.${field.id}`} className="text-muted-foreground">{field.label}</Label>
                                <Input
                                    id={`outils.${field.id}`}
                                    name={`outils.${field.id}`}
                                    value={(editedClient.outils as any)?.[field.id] || ''}
                                    onChange={handleChange}
                                    className={cn(inputStyle, "max-w-[200px]")}
                                />
                            </div>
                        )
                    }

                    const selectValue = (editedClient.outils as any)?.[field.id] || "À définir";
                    return (
                        <div key={field.id} className="flex items-center justify-between">
                            <Label htmlFor={`outils.${field.id}`} className="text-muted-foreground">{field.label}</Label>
                            <Select
                                name={`outils.${field.id}`}
                                value={selectValue}
                                onValueChange={(value) => handleValueChange(`outils.${field.id}`, value)}
                            >
                                <SelectTrigger className={cn(inputStyle, "max-w-[120px] rounded-xl text-right", getStatusColor(selectValue))}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Oui">Oui</SelectItem>
                                    <SelectItem value="Non">Non</SelectItem>
                                    <SelectItem value="À définir">À définir</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )
                })}
            </CardContent>
        </Card>
    );
}
