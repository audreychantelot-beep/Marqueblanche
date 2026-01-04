'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity } from "lucide-react";
import { type Client } from "@/lib/clients-data";

type ClientWithId = Client & { id: string };

interface ActivitiesSectionProps {
    editedClient: ClientWithId;
    handleValueChange: (name: string, value: string) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const inputStyle = "bg-white dark:bg-zinc-800 border-none";

export function ActivitiesSection({ editedClient, handleValueChange, handleChange }: ActivitiesSectionProps) {
    return (
        <Card className="md:col-span-2 lg:col-span-1 rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-muted-foreground" />Activités du client</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                    <Label htmlFor="activites.codeAPE" className="text-muted-foreground">Code APE</Label>
                    <Input id="activites.codeAPE" name="activites.codeAPE" value={editedClient.activites.codeAPE || ''} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="activites.secteurActivites" className="text-muted-foreground">Secteur d’activités</Label>
                    <Input id="activites.secteurActivites" name="activites.secteurActivites" value={editedClient.activites.secteurActivites || ''} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="activites.regimeTVA" className="text-muted-foreground">Régime de TVA</Label>
                    <Select name="activites.regimeTVA" value={editedClient.activites.regimeTVA} onValueChange={(value) => handleValueChange("activites.regimeTVA", value)}>
                        <SelectTrigger className="bg-white dark:bg-zinc-800 border-none rounded-3xl hover:bg-accent">
                            <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Débit">Débit</SelectItem>
                            <SelectItem value="Encaissement">À l’encaissement</SelectItem>
                            <SelectItem value="Non concerné">Non concerné</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="activites.regimeFiscal" className="text-muted-foreground">Régime fiscal</Label>
                    <Input id="activites.regimeFiscal" name="activites.regimeFiscal" value={editedClient.activites.regimeFiscal || ''} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="activites.typologieClientele" className="text-muted-foreground">Typologie de clientèle</Label>
                    <Select name="activites.typologieClientele" value={editedClient.activites.typologieClientele} onValueChange={(value) => handleValueChange("activites.typologieClientele", value)}>
                        <SelectTrigger className="bg-white dark:bg-zinc-800 border-none rounded-3xl hover:bg-accent">
                            <SelectValue placeholder="Sélectionner..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="B to B">B to B</SelectItem>
                            <SelectItem value="B to C">B to C</SelectItem>
                            <SelectItem value="Organismes publics">Organismes publics</SelectItem>
                            <SelectItem value="Mixtes">Mixtes</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}
