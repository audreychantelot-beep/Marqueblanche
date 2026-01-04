'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { type Client } from "@/lib/clients-data";

type ClientWithId = Client & { id: string };

interface ContactSectionProps {
    editedClient: ClientWithId;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const inputStyle = "bg-white dark:bg-zinc-800 border-none";

export function ContactSection({ editedClient, handleChange }: ContactSectionProps) {
    return (
        <div>
            <CardTitle className="flex items-center gap-2 mb-4"><User className="w-5 h-5 text-muted-foreground" />Contact Principal</CardTitle>
            <div className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="contactPrincipal.nom" className="text-muted-foreground">Nom</Label>
                        <Input id="contactPrincipal.nom" name="contactPrincipal.nom" value={editedClient.contactPrincipal.nom || ''} onChange={handleChange} className={inputStyle} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contactPrincipal.prenom" className="text-muted-foreground">Prénom</Label>
                        <Input id="contactPrincipal.prenom" name="contactPrincipal.prenom" value={editedClient.contactPrincipal.prenom || ''} onChange={handleChange} className={inputStyle} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contactPrincipal.email" className="text-muted-foreground">Email</Label>
                    <Input id="contactPrincipal.email" name="contactPrincipal.email" type="email" value={editedClient.contactPrincipal.email || ''} onChange={handleChange} className={inputStyle} />
                </div>
            </div>
        </div>
    );
}
