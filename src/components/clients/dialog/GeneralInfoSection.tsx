'use client';

import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Info } from "lucide-react";
import { type Client } from "@/lib/clients-data";
import { CardTitle } from '@/components/ui/card';

type ClientWithId = Client & { id: string };

interface GeneralInfoSectionProps {
    editedClient: ClientWithId;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleValueChange: (name: string, value: string) => void;
}

const placeholderText = "À compléter";

export function GeneralInfoSection({ editedClient, handleChange, handleValueChange }: GeneralInfoSectionProps) {
    return (
        <div>
            <CardTitle className="flex items-center gap-2 mb-4"><Info className="w-5 h-5 text-muted-foreground" />Informations Générales</CardTitle>
            <div className="space-y-4 text-left">
                 <div className="space-y-2">
                    <Label htmlFor="raisonSociale" className="text-muted-foreground">Raison sociale</Label>
                    <Input id="raisonSociale" name="raisonSociale" value={editedClient.raisonSociale || ''} onChange={handleChange} className="border-none" placeholder={placeholderText}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="siren" className="text-muted-foreground">SIREN</Label>
                        <Input id="siren" name="siren" value={editedClient.siren || ''} onChange={handleChange} className="border-none" placeholder={placeholderText}/>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="formeJuridique" className="text-muted-foreground">Forme juridique</Label>
                        <Input id="formeJuridique" name="formeJuridique" value={editedClient.formeJuridique || ''} onChange={handleChange} className="border-none" placeholder={placeholderText}/>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="activites.codeAPE" className="text-muted-foreground">Code APE</Label>
                        <Input id="activites.codeAPE" name="activites.codeAPE" value={editedClient.activites.codeAPE || ''} onChange={handleChange} className="border-none" placeholder={placeholderText}/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="activites.regimeFiscal" className="text-muted-foreground">Régime fiscal</Label>
                        <Input id="activites.regimeFiscal" name="activites.regimeFiscal" value={editedClient.activites.regimeFiscal || ''} onChange={handleChange} className="border-none" placeholder={placeholderText}/>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="activites.secteurActivites" className="text-muted-foreground">Secteur d’activités</Label>
                    <Input id="activites.secteurActivites" name="activites.secteurActivites" value={editedClient.activites.secteurActivites || ''} onChange={handleChange} className="border-none" placeholder={placeholderText}/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="activites.regimeTVA" className="text-muted-foreground">Régime de TVA</Label>
                      <Select name="activites.regimeTVA" value={editedClient.activites.regimeTVA} onValueChange={(value) => handleValueChange("activites.regimeTVA", value)}>
                          <SelectTrigger className="border-none rounded-3xl hover:bg-accent">
                              <SelectValue placeholder={placeholderText} />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="Débit">Débit</SelectItem>
                              <SelectItem value="Encaissement">À l’encaissement</SelectItem>
                              <SelectItem value="Non concerné">Non concerné</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="activites.typologieClientele" className="text-muted-foreground">Typologie de clientèle</Label>
                      <Select name="activites.typologieClientele" value={editedClient.activites.typologieClientele} onValueChange={(value) => handleValueChange("activites.typologieClientele", value)}>
                          <SelectTrigger className="border-none rounded-3xl hover:bg-accent">
                              <SelectValue placeholder={placeholderText} />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectItem value="B to B">B to B</SelectItem>
                              <SelectItem value="B to C">B to C</SelectItem>
                              <SelectItem value="Organismes publics">Organismes publics</SelectItem>
                              <SelectItem value="Mixtes">Mixtes</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                </div>
            </div>
        </div>
    );
}
