'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
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
        <Card className="rounded-3xl p-0 h-full">
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <GeneralInfoSection editedClient={editedClient} handleChange={handleChange} handleValueChange={handleValueChange} />
                    </div>
                    <div className="space-y-6 md:col-span-2">
                        <ContactSection editedClient={editedClient} handleChange={handleChange} />
                    </div>
                    <div className="relative aspect-square md:aspect-auto rounded-2xl overflow-hidden row-start-2 md:row-start-auto md:col-span-1">
                         <Image
                            src="https://cdn.dribbble.com/userupload/32708980/file/original-50cec0836d7d5d7bee386d9749bc44df.png?resize=1504x1131&vertical=center"
                            alt="Illustration pour les informations générales"
                            fill
                            className="object-cover"
                        />
                    </div>
                     <div className="space-y-6 md:col-span-3">
                        <MissionsSection editedClient={editedClient} handleChange={handleChange} />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
