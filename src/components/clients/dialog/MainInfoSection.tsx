'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { GeneralInfoSection } from "./GeneralInfoSection";
import { ContactSection } from "./ContactSection";
import { ActivitiesSection } from "./ActivitiesSection";
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
            <CardContent className="p-6 flex flex-col gap-6">
                <GeneralInfoSection editedClient={editedClient} handleChange={handleChange} />
                <ContactSection editedClient={editedClient} handleChange={handleChange} />
                <ActivitiesSection editedClient={editedClient} handleChange={handleChange} handleValueChange={handleValueChange} />
            </CardContent>
        </Card>
    );
}
