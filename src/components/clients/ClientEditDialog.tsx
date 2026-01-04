'use client';

import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, User, Briefcase, Activity, Wrench, FileQuestion, CheckCircle, Construction } from "lucide-react";
import { QuestionnaireDialog } from "@/components/clients/QuestionnaireDialog";
import { Progress } from "@/components/ui/progress";
import { type Client, type Questionnaire } from "@/lib/clients-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    if(client?.questionnaire) {
        const answeredQuestions = Object.keys(client.questionnaire).filter(key => !key.endsWith('_software') && !key.endsWith('_method') && !key.endsWith('_function') && !key.endsWith('_actions') && !key.endsWith('_project') && (client.questionnaire as any)[key]).length;
        setIsQuestionnaireCompleted(answeredQuestions >= 13);
    } else {
        setIsQuestionnaireCompleted(false);
    }
  }, [client]);

  const handleQuestionnaireSave = (data: Questionnaire) => {
    if (editedClient) {
      const updatedClient = { ...editedClient, questionnaire: data };
      setEditedClient(updatedClient);
      onSave(updatedClient); // also save the main client object
    }
  };

  const calculateProfileCompletion = useMemo(() => {
    if (!editedClient) return 0;

    const fields = [
      editedClient.identifiantInterne,
      editedClient.siren,
      editedClient.raisonSociale,
      editedClient.formeJuridique,
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
  
  const assujettiReformeValue = useMemo(() => {
    if (!editedClient) return "À définir";
    const regimeTVA = editedClient.activites.regimeTVA;
    if (regimeTVA === "Débit" || regimeTVA === "Encaissement") {
      return "Oui";
    }
    if (regimeTVA === "Non concerné") {
      return "Non";
    }
    return "À définir";
  }, [editedClient]);

  const eInvoicingValue = useMemo(() => {
    if (!editedClient) return "À définir";
    const typologie = editedClient.activites.typologieClientele;
    if (typologie === "B to B" || typologie === "Mixtes") {
      return "Oui";
    }
    if (typologie === "B to C" || typologie === "Organismes publics") {
      return "Non";
    }
    return "À définir";
  }, [editedClient]);

  const eReportingTransactionValue = useMemo(() => {
    if (!editedClient) return "À définir";
    const typologie = editedClient.activites.typologieClientele;
    if (typologie === "B to C" || typologie === "Mixtes") {
      return "Oui";
    }
    if (typologie === "B to B" || typologie === "Organismes publics") {
      return "Non";
    }
    return "À définir";
  }, [editedClient]);

  const eReportingPaiementValue = useMemo(() => {
    if (!editedClient) return "À définir";
    const regimeTVA = editedClient.activites.regimeTVA;
    if (regimeTVA === "Encaissement") {
      return "Oui";
    }
    return "Non";
  }, [editedClient]);

  const paEmissionValue = useMemo(() => {
    if (eInvoicingValue === "Oui") {
      return "Oui";
    }
    if (eInvoicingValue === "Non") {
      return "Non";
    }
    return "À définir";
  }, [eInvoicingValue]);

  const paReceptionValue = useMemo(() => {
    if (assujettiReformeValue === "Oui") {
      return "Oui";
    }
    if (assujettiReformeValue === "Non") {
      return "Non";
    }
    return "À définir";
  }, [assujettiReformeValue]);


  useEffect(() => {
    if (editedClient) {
      const newObligations = { ...editedClient.obligationsLegales };
      let changed = false;

      // @ts-ignore
      if (newObligations.assujettiReforme !== assujettiReformeValue) {
        // @ts-ignore
        newObligations.assujettiReforme = assujettiReformeValue;
        changed = true;
      }
      // @ts-ignore
      if (newObligations.eInvoicing !== eInvoicingValue) {
        // @ts-ignore
        newObligations.eInvoicing = eInvoicingValue;
        changed = true;
      }
      // @ts-ignore
      if (newObligations.eReportingTransaction !== eReportingTransactionValue) {
        // @ts-ignore
        newObligations.eReportingTransaction = eReportingTransactionValue;
        changed = true;
      }
      // @ts-ignore
      if (newObligations.eReportingPaiement !== eReportingPaiementValue) {
        // @ts-ignore
        newObligations.eReportingPaiement = eReportingPaiementValue;
        changed = true;
      }
      // @ts-ignore
      if (newObligations.paEmission !== paEmissionValue) {
        // @ts-ignore
        newObligations.paEmission = paEmissionValue;
        changed = true;
      }
      // @ts-ignore
      if (newObligations.paReception !== paReceptionValue) {
        // @ts-ignore
        newObligations.paReception = paReceptionValue;
        changed = true;
      }

      if (changed) {
        setEditedClient(prev => {
          if (!prev) return null;
          const newClient = JSON.parse(JSON.stringify(prev));
          newClient.obligationsLegales = newObligations;
          return newClient;
        });
      }
    }
  }, [editedClient, assujettiReformeValue, eInvoicingValue, eReportingTransactionValue, eReportingPaiementValue, paEmissionValue, paReceptionValue]);


  if (!editedClient) return null;

  const handleValueChange = (name: string, value: string) => {
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
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleValueChange(e.target.name, e.target.value);
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
  
  const
   toolFields = [
    { id: "logicielCaisse", label: "Logiciel de caisse", type: "questionnaire" },
    { id: "genereEReporting", label: "Génère le e-reporting", type: "select" },
    { id: "logicielFacturation", label: "Logiciel de facturation", type: "text" },
    { id: "conformeFacturationElectronique", label: "Conforme facturation électronique", type: "select" },
    { id: "logicielGestionAchats", label: "Logiciel de gestion des achats", type: "text" },
    { id: "interoperableComptable", label: "Interopérable avec le logiciel comptable", type: "select" },
    { id: "interoperablePaEmission", label: "Interopérable avec la PA en émission", type: "select" },
    { id: "logicielComptableClient", label: "Logiciel comptable du client", type: "text" },
    { id: "interoperableAutresLogiciels", label: "Interopérable avec les autres logiciels", type: "select" },
    { id: "logicielNotesFrais", label: "Logiciel de gestion des notes de frais", type: "select" },
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
                  <Input id="activites.regimeFiscal" name="activites.regimeFiscal" value={editedClient.activites.regimeFiscal} onChange={handleChange} className={inputStyle} />
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

            <Card className="rounded-3xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5 text-muted-foreground" />Obligations</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-left">
                {obligationFields.map(field => (
                  <div key={field.id} className="flex items-center justify-between space-y-2 text-sm">
                    <Label htmlFor={`obligationsLegales.${field.id}`} className="text-muted-foreground">{field.label}</Label>
                    <Input
                      id={`obligationsLegales.${field.id}`}
                      name={`obligationsLegales.${field.id}`}
                      value={
                        field.id === 'assujettiReforme' ? assujettiReformeValue :
                        field.id === 'eInvoicing' ? eInvoicingValue :
                        field.id === 'eReportingTransaction' ? eReportingTransactionValue :
                        field.id === 'eReportingPaiement' ? eReportingPaiementValue :
                        field.id === 'paEmission' ? paEmissionValue :
                        field.id === 'paReception' ? paReceptionValue :
                        (editedClient.obligationsLegales as any)[field.id] || "À définir"
                      }
                      onChange={handleChange}
                      className={`${inputStyle} text-right max-w-[100px]`}
                      disabled
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

             <Card className="rounded-3xl">
              <CardHeader><CardTitle className="flex items-center gap-2"><Construction className="w-5 h-5 text-muted-foreground" />Outils</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 gap-y-4 text-left text-sm">
                {toolFields.map(field => (
                  <div key={field.id} className="flex items-center justify-between">
                    <Label htmlFor={`outils.${field.id}`} className="text-muted-foreground">{field.label}</Label>
                    {field.type === 'questionnaire' ? (
                       <div className="flex items-center gap-2 max-w-[200px]">
                        <Input
                            value={editedClient.questionnaire?.q4 || "N/A"}
                            disabled
                            className={`${inputStyle} w-16 text-center`}
                        />
                        <Input
                            value={editedClient.questionnaire?.q4 === 'Oui' ? editedClient.questionnaire?.q4_software : editedClient.questionnaire?.q4_method}
                            disabled
                            className={`${inputStyle} flex-1`}
                        />
                       </div>
                    ) : field.type === 'text' ? (
                       <Input
                        id={`outils.${field.id}`}
                        name={`outils.${field.id}`}
                        // @ts-ignore
                        value={editedClient.outils?.[field.id] || ''}
                        onChange={handleChange}
                        className={`${inputStyle} max-w-[200px]`}
                      />
                    ) : (
                      <Select 
                        name={`outils.${field.id}`} 
                        // @ts-ignore
                        value={editedClient.outils?.[field.id] || "À définir"}
                        onValueChange={(value) => handleValueChange(`outils.${field.id}`, value)}
                      >
                        <SelectTrigger className={`${inputStyle} max-w-[120px] rounded-xl text-right`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Oui">Oui</SelectItem>
                          <SelectItem value="Non">Non</SelectItem>
                          <SelectItem value="À définir">À définir</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
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
          onSaveSuccess={handleQuestionnaireSave}
        />}
    </>
  );
}
