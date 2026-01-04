'use client';

import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, User, Briefcase, Activity, Wrench, FileQuestion, CheckCircle } from "lucide-react";
import { QuestionnaireDialog } from "@/components/clients/QuestionnaireDialog";
import { Progress } from "@/components/ui/progress";
import { type Client } from "@/lib/clients-data";

interface ClientEditDialogProps {
  client: Client | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (updatedClient: Client) => void;
}

export function ClientEditDialog({ client, isOpen, onOpenChange, onSave }: ClientEditDialogProps) {
  const [editedClient, setEditedClient] = useState<Client | null>(client);
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);

  useEffect(() => {
    setEditedClient(client);
    setIsQuestionnaireCompleted(Math.random() > 0.5);
  }, [client]);

  const calculateProfileCompletion = useMemo(() => {
    if (!editedClient) return 0;

    const fields = [
      editedClient.identifiantInterne,
      editedClient.siren,
      editedClient.raisonSociale,
      editedClient.formeJuridique,
      editedClient.outils,
      editedClient.contactPrincipal.nom,
      editedClient.contactPrincipal.prenom,
      editedClient.contactPrincipal.email,
      editedClient.missionsActuelles.collaborateurReferent,
      editedClient.missionsActuelles.expertComptable,
      editedClient.missionsActuelles.typeMission,
      editedClient.activites.codeAPE,
      editedClient.activites.secteurActivites,
      editedClient.activites.regimeTVA,
      editedClient.activites.regimeFiscal,
      editedClient.activites.typologieClientele,
    ];

    const filledFields = fields.filter(field => field && String(field).trim() !== '').length;
    const totalFields = fields.length;
    const fieldsProgress = (filledFields / totalFields) * 50;

    const obligationsDefined = editedClient.obligationsLegales && Object.values(editedClient.obligationsLegales).every(val => val !== "À définir" && val !== undefined);
    const obligationsProgress = obligationsDefined ? 25 : 0;

    const questionnaireProgress = isQuestionnaireCompleted ? 25 : 0;
    
    return fieldsProgress + obligationsProgress + questionnaireProgress;
  }, [editedClient, isQuestionnaireCompleted]);

  if (!editedClient) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    setEditedClient(prev => {
      if (!prev) return null;
      const newClient = JSON.parse(JSON.stringify(prev)); // Deep copy
      let current: any = newClient;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newClient;
    });
  };

  const handleSave = () => {
    if (editedClient) {
      onSave(editedClient);
      onOpenChange(false);
    }
  }
  
  const inputStyle = "bg-white dark:bg-zinc-800 border-none";
  const completionPercentage = calculateProfileCompletion;

  const obligationFields = [
    { id: "assujettiReforme", label: "Assujetti à la réforme" },
    { id: "eInvoicing", label: "Concerné par le e-invoicing" },
    { id: "eReportingTransaction", label: "Concerné par le e-reporting transaction" },
    { id: "eReportingPaiement", label: "Concerné par le e-reporting paiement" },
    { id: "paEmission", label: "Obligation PA émission" },
    { id: "paReception", label: "Obligation PA réception" },
  ];

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-full w-full h-full max-h-full sm:max-w-[95vw] sm:max-h-[95vh] rounded-3xl flex flex-col">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle>Modifier le client : {client?.raisonSociale}</DialogTitle>
                 <DialogDescription>
                  Gérez les informations de votre client.
                </DialogDescription>
                 <div className="text-muted-foreground mt-2 flex items-center gap-4">
                  <div>
                    {completionPercentage === 100 ? (
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span>Profil complet</span>
                      </div>
                    ) : (
                      <span className='text-sm'>Profil complet à {Math.round(completionPercentage)}%</span>
                    )}
                    <Progress value={completionPercentage} className="mt-1 h-2" />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" onClick={() => setIsQuestionnaireOpen(true)}>
                  <FileQuestion className="mr-2 h-4 w-4" />
                  Questionnaire
                </Button>
                <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                <Button onClick={handleSave}>Sauvegarder</Button>
              </div>
              <DialogClose className="invisible mr-8" />
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                 <div className="space-y-2">
                  <Label htmlFor="outils" className="text-muted-foreground">Outils</Label>
                  <Input id="outils" name="outils" value={editedClient.outils} onChange={handleChange} className={inputStyle} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-3xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-muted-foreground" />Contact Principal</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <Label htmlFor="contactPrincipal.nom" className="text-muted-foreground">Nom</Label>
                  <Input id="contactPrincipal.nom" name="contactPrincipal.nom" value={editedClient.contactPrincipal.nom} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPrincipal.prenom" className="text-muted-foreground">Prénom</Label>
                  <Input id="contactPrincipal.prenom" name="contactPrincipal.prenom" value={editedClient.contactPrincipal.prenom} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="contactPrincipal.email" className="text-muted-foreground">Email</Label>
                  <Input id="contactPrincipal.email" name="contactPrincipal.email" type="email" value={editedClient.contactPrincipal.email} onChange={handleChange} className={inputStyle} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-muted-foreground" />Missions Actuelles</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <Label htmlFor="missionsActuelles.collaborateurReferent" className="text-muted-foreground">Collaborateur référent</Label>
                  <Input id="missionsActuelles.collaborateurReferent" name="missionsActuelles.collaborateurReferent" value={editedClient.missionsActuelles.collaborateurReferent} onChange={handleChange} className={inputStyle} />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="missionsActuelles.expertComptable" className="text-muted-foreground">Expert-comptable</Label>
                  <Input id="missionsActuelles.expertComptable" name="missionsActuelles.expertComptable" value={editedClient.missionsActuelles.expertComptable} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="missionsActuelles.typeMission" className="text-muted-foreground">Type de mission</Label>
                  <Input id="missionsActuelles.typeMission" name="missionsActuelles.typeMission" value={editedClient.missionsActuelles.typeMission} onChange={handleChange} className={inputStyle} />
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-1 rounded-3xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="w-5 h-5 text-muted-foreground" />Activités du client</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-2">
                  <Label htmlFor="activites.codeAPE" className="text-muted-foreground">Code APE</Label>
                  <Input id="activites.codeAPE" name="activites.codeAPE" value={editedClient.activites.codeAPE} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activites.secteurActivites" className="text-muted-foreground">Secteur d’activités</Label>
                  <Input id="activites.secteurActivites" name="activites.secteurActivites" value={editedClient.activites.secteurActivites} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activites.regimeTVA" className="text-muted-foreground">Régime de TVA</Label>
                  <Input id="activites.regimeTVA" name="activites.regimeTVA" value={editedClient.activites.regimeTVA} onChange={handleChange} className={inputStyle} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activites.regimeFiscal" className="text-muted-foreground">Régime fiscal</Label>
                  <Input id="activites.regimeFiscal" name="activites.regimeFiscal" value={editedClient.activites.regimeFiscal} onChange={handleChange} className={inputStyle} />
                </div>
                 <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="activites.typologieClientele" className="text-muted-foreground">Typologie de clientèle</Label>
                  <Input id="activites.typologieClientele" name="activites.typologieClientele" value={editedClient.activites.typologieClientele} onChange={handleChange} className={inputStyle} />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5 text-muted-foreground" />Obligations</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-left">
                {obligationFields.map(field => (
                  <div key={field.id} className="flex items-center justify-between space-y-2 text-sm">
                    <Label htmlFor={`obligationsLegales.${field.id}`} className="text-muted-foreground">{field.label}</Label>
                    <Input 
                      id={`obligationsLegales.${field.id}`} 
                      name={`obligationsLegales.${field.id}`} 
                      // @ts-ignore
                      value={editedClient.obligationsLegales[field.id] || "À définir"} 
                      onChange={handleChange} 
                      className={`${inputStyle} text-right max-w-[100px]`} 
                      disabled 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="p-4 border-t sr-only">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
            <Button onClick={handleSave}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {client && <QuestionnaireDialog 
          client={client} 
          isOpen={isQuestionnaireOpen} 
          onOpenChange={setIsQuestionnaireOpen} 
          onCompleteChange={setIsQuestionnaireCompleted}
        />}
    </>
  );
}
