'use client';

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { type Client } from "@/lib/clients-data";
import { CardTitle } from '@/components/ui/card';

type ClientWithId = Client & { id: string };

interface MissionsSectionProps {
    editedClient: ClientWithId;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const inputStyle = "bg-white dark:bg-zinc-800 border-none";

export function MissionsSection({ editedClient, handleChange }: MissionsSectionProps) {
    return (
        <div>
            <CardTitle className="flex items-center gap-2 mb-4"><Briefcase className="w-5 h-5 text-muted-foreground" />Missions Actuelles</CardTitle>
            <div className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="missionsActuelles.collaborateurReferent" className="text-muted-foreground">Collaborateur référent</Label>
                        <Input id="missionsActuelles.collaborateurReferent" name="missionsActuelles.collaborateurReferent" value={editedClient.missionsActuelles.collaborateurReferent || ''} onChange={handleChange} className={inputStyle} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="missionsActuelles.expertComptable" className="text-muted-foreground">Expert-comptable</Label>
                        <Input id="missionsActuelles.expertComptable" name="missionsActuelles.expertComptable" value={editedClient.missionsActuelles.expertComptable || ''} onChange={handleChange} className={inputStyle} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="missionsActuelles.typeMission" className="text-muted-foreground">Type de mission</Label>
                    <Input id="missionsActuelles.typeMission" name="missionsActuelles.typeMission" value={editedClient.missionsActuelles.typeMission || ''} onChange={handleChange} className={inputStyle} />
                </div>
            </div>
        </div>
    );
}
