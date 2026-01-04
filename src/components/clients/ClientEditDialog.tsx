'use client';

import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QuestionnaireDialog } from "@/components/clients/QuestionnaireDialog";
import { type Client, type Questionnaire } from "@/lib/clients-data";

import { ClientDialogHeader } from "./dialog/ClientDialogHeader";
import { GeneralInfoSection } from "./dialog/GeneralInfoSection";
import { ContactSection } from "./dialog/ContactSection";
import { MissionsSection } from "./dialog/MissionsSection";
import { ActivitiesSection } from "./dialog/ActivitiesSection";
import { ObligationsSection } from "./dialog/ObligationsSection";
import { ToolsSection } from "./dialog/ToolsSection";

type ClientWithId = Client & { id: string };

interface ClientEditDialogProps {
  client: ClientWithId | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (updatedClient: ClientWithId) => void;
}

export function ClientEditDialog({ client, isOpen, onOpenChange, onSave }: ClientEditDialogProps) {
  const [editedClient, setEditedClient] = useState<ClientWithId | null>(client);
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
  
  if (!editedClient) return null;

  const handleValueChange = (name: string, value: string) => {
    const keys = name.split('.');
    
    setEditedClient(prev => {
      if (!prev) return null;
      const newClient = JSON.parse(JSON.stringify(prev)); // Deep copy
      let current: any = newClient;
      for (let i = 0; i < keys.length - 1; i++) {
        if (current[keys[i]] === undefined) {
          current[keys[i]] = {};
        }
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
  
  const completionPercentage = calculateProfileCompletion;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()} className="max-w-full w-full h-full max-h-full sm:max-w-[95vw] sm:max-h-[95vh] rounded-3xl flex flex-col">
          <ClientDialogHeader
             client={client}
             raisonSociale={editedClient.raisonSociale}
             completionPercentage={completionPercentage}
             onOpenChange={onOpenChange}
             setIsQuestionnaireOpen={setIsQuestionnaireOpen}
             handleSave={handleSave}
          />
          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <GeneralInfoSection editedClient={editedClient} handleChange={handleChange} />
            <ContactSection editedClient={editedClient} handleChange={handleChange} />
            <MissionsSection editedClient={editedClient} handleChange={handleChange} />
            <ActivitiesSection editedClient={editedClient} handleValueChange={handleValueChange} />
            <ObligationsSection editedClient={editedClient} setEditedClient={setEditedClient} />
            <ToolsSection editedClient={editedClient} handleChange={handleChange} handleValueChange={handleValueChange} />
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
