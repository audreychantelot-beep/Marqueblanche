'use client';

import React from 'react';
import Image from 'next/image';
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

const placeholderText = "À compléter";

const getStatusColorText = (value: string | undefined) => {
    if (value === 'Oui') return 'text-green-600 dark:text-green-500';
    if (value === 'Non') return 'text-red-600 dark:text-red-500';
    return 'text-orange-500 dark:text-orange-400';
};

const getStatusColorSelect = (value: string | undefined) => {
    if (value === 'Oui') return 'text-green-600 dark:text-green-500 bg-white dark:bg-zinc-800';
    if (value === 'Non') return 'text-red-600 dark:text-red-500 bg-white dark:bg-zinc-800';
    return 'text-orange-500 dark:text-orange-400 bg-white dark:bg-zinc-800';
}

const toolFields = [
    { id: "logicielCaisse", label: "Logiciel de caisse", type: "questionnaire", question: "q4" },
    { id: "genereEReporting", label: "Génère le e-reporting", type: "select" },
    { id: "logicielFacturation", label: "Logiciel de facturation", type: "questionnaire", question: "q5" },
    { id: "conformeFacturationElectronique", label: "Conforme facturation électronique", type: "select" },
    { id: "logicielGestionAchats", label: "Logiciel de gestion commerciale", type: "questionnaire", question: "q6" },
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
            <CardContent className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-1/3 relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <Image
                        src="https://cdn.dribbble.com/userupload/32583993/file/original-5161968c87ad1b7f553d7a1fd00628cc.png?resize=1504x1131&vertical=center"
                        alt="Illustration pour les outils"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="w-full md:w-2/3 grid grid-cols-1 gap-y-4 text-left text-sm">
                    {toolFields.map(field => {
                        if (field.id === 'genereEReporting' && editedClient.questionnaire?.q4 === 'Non') {
                            return null;
                        }

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
                                            className={cn("w-16 text-center font-medium border-none", getStatusColorText(answer.toString()))}
                                            placeholder={placeholderText}
                                        />
                                        <Input
                                            value={detail || ''}
                                            disabled
                                            className={cn("flex-1 border-none")}
                                            placeholder={placeholderText}
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
                                        className={cn("max-w-[200px] border-none")}
                                        placeholder={placeholderText}
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
                                    <SelectTrigger className={cn("max-w-[120px] rounded-xl text-right border-none font-medium", getStatusColorSelect(selectValue))}>
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
                </div>
            </CardContent>
        </Card>
    );
}
