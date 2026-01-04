'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';
import { GeneralInfoSection } from "./GeneralInfoSection";
import { ContactSection } from "./ContactSection";
import { MissionsSection } from "./MissionsSection";
import { type Client } from "@/lib/clients-data";

type ClientWithId = Client & { id: string };

interface MainInfoSectionProps {
    editedClient: ClientWithId;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleValueChange: (name: string, value: string) => void;
}

export function MainInfoSection({ editedClient, handleChange, handleValueChange }: MainInfoSectionProps) {
    return (
        <Card className="rounded-3xl p-0">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <GeneralInfoSection editedClient={editedClient} handleChange={handleChange} handleValueChange={handleValueChange} />
                    </div>
                    <div className="space-y-6">
                        <ContactSection editedClient={editedClient} handleChange={handleChange} />
                        <Separator />
                        <MissionsSection editedClient={editedClient} handleChange={handleChange} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
