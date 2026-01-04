'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { type Client } from "@/lib/clients-data";

type ClientWithId = Client & { id: string };

interface GeneralInfoSectionProps {
    editedClient: ClientWithId;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const inputStyle = "bg-white dark:bg-zinc-800 border-none";

export function GeneralInfoSection({ editedClient, handleChange }: GeneralInfoSectionProps) {
    return (
        <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Info className="w-5 h-5 text-muted-foreground" />Informations Générales</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                    <Label htmlFor="identifiantInterne" className="text-muted-foreground">Identifiant interne</Label>
                    <Input id="identifiantInterne" name="identifiantInterne" value={editedClient.identifiantInterne} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="siren" className="text-muted-foreground">SIREN</Label>
                    <Input id="siren" name="siren" value={editedClient.siren} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="raisonSociale" className="text-muted-foreground">Raison sociale</Label>
                    <Input id="raisonSociale" name="raisonSociale" value={editedClient.raisonSociale} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="formeJuridique" className="text-muted-foreground">Forme juridique</Label>
                    <Input id="formeJuridique" name="formeJuridique" value={editedClient.formeJuridique} onChange={handleChange} className={inputStyle} />
                </div>
            </CardContent>
        </Card>
    );
}
