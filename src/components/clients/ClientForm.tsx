'use client';

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { QuestionnaireDialog } from "@/components/clients/QuestionnaireDialog";
import { type Client, type Questionnaire } from "@/lib/clients-data";
import { useUser, useFirestore } from '@/firebase';
import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc, collection } from 'firebase/firestore';

import { ClientPageHeader } from "./dialog/ClientDialogHeader";
import { MainInfoSection } from "./dialog/MainInfoSection";
import { ObligationsSection } from "./dialog/ObligationsSection";
import { ClientAnalysis } from "./dialog/ClientAnalysis";
import { ToolsSection } from "./dialog/ToolsSection";
import { useToast } from "@/hooks/use-toast";

type ClientWithId = Client & { id: string };

interface ClientFormProps {
  client?: ClientWithId;
}

const emptyClientTemplate: Omit<Client, 'identifiantInterne'> = {
  siren: "",
  raisonSociale: "",
  formeJuridique: "",
  contactPrincipal: {
    nom: "",
    prenom: "",
    email: "",
  },
  avatar: `https://picsum.photos/seed/${Math.random()}/40/40`,
  missionsActuelles: {
    collaborateurReferent: "",
    expertComptable: "",
    typeMission: "",
  },
  activites: {
    codeAPE: "",
    secteurActivites: "",
    regimeTVA: "Débit",
    regimeFiscal: "",
    typologieClientele: "B to B",
  },
  obligationsLegales: {},
  questionnaire: {},
  outils: {},
  maturiteDigitale: "À définir",
  cartographieClient: "À définir",
};


export function ClientForm({ client }: ClientFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const isNewClient = !client;
  
  const [editedClient, setEditedClient] = useState<ClientWithId | null>(() => {
    if (isNewClient) {
      const newId = `client_${Date.now()}`;
      return {
        id: newId,
        identifiantInterne: newId,
        ...emptyClientTemplate,
      };
    }
    return client || null;
  });

  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isQuestionnaireCompleted, setIsQuestionnaireCompleted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const firstRender = useRef(true);

  useEffect(() => {
    if(client?.questionnaire) {
        const answeredQuestions = Object.keys(client.questionnaire).filter(key => !key.endsWith('_software') && !key.endsWith('_method') && !key.endsWith('_function') && !key.endsWith('_actions') && !key.endsWith('_project') && (client.questionnaire as any)[key]).length;
        setIsQuestionnaireCompleted(answeredQuestions >= 13);
    } else {
        setIsQuestionnaireCompleted(false);
    }
  }, [client]);

  // Auto-save effect
  useEffect(() => {
    if (firstRender.current) {
        firstRender.current = false;
        return;
    }

    if (isNewClient || !editedClient || !user || !firestore) {
      return;
    }

    setSaveStatus('saving');
    const handler = setTimeout(() => {
      const { id, ...clientData } = editedClient;
      const clientDocRef = doc(firestore, 'users', user.uid, 'clients', id);
      setDocumentNonBlocking(clientDocRef, clientData, { merge: true });
      setSaveStatus('saved');
      
      const statusHandler = setTimeout(() => setSaveStatus('idle'), 2000);
      return () => clearTimeout(statusHandler);

    }, 1500); // 1.5s debounce

    return () => {
      clearTimeout(handler);
    };
  }, [editedClient, isNewClient, user, firestore]);

  const handleQuestionnaireSave = (data: Questionnaire) => {
    if (editedClient) {
      const updatedClient = { ...editedClient, questionnaire: data };
      setEditedClient(updatedClient);
      
      toast({
          title: "Questionnaire sauvegardé",
          description: `Les réponses pour ${updatedClient.raisonSociale} ont été enregistrées.`,
      });
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
    if (isNewClient && editedClient && user && firestore) {
      const { id, ...clientData } = editedClient;
      const clientsCollectionRef = collection(firestore, 'users', user.uid, 'clients');
      addDocumentNonBlocking(clientsCollectionRef, clientData)
        .then((docRef) => {
            if (docRef?.id) {
                toast({
                    title: "Client créé",
                    description: `Le client ${editedClient.raisonSociale} a été créé.`,
                });
                router.push(`/clients/${docRef.id}`);
            }
        });
    }
  }
  
  const completionPercentage = calculateProfileCompletion;

  return (
    <>
      <ClientPageHeader
         client={client || null}
         raisonSociale={editedClient.raisonSociale}
         completionPercentage={completionPercentage}
         handleSave={handleSave}
         isNewClient={isNewClient}
         onOpenQuestionnaire={() => setIsQuestionnaireOpen(true)}
         saveStatus={saveStatus}
      />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-3 flex flex-col h-full">
            <MainInfoSection 
              editedClient={editedClient}
              handleChange={handleChange}
              handleValueChange={handleValueChange}
            />
        </div>
        <div className="lg:col-span-1 flex flex-col h-full">
          <ClientAnalysis editedClient={editedClient} setEditedClient={setEditedClient} />
        </div>
        <div className="lg:col-span-2 flex flex-col h-full">
          <ObligationsSection editedClient={editedClient} setEditedClient={setEditedClient} />
        </div>
        <div className="lg:col-span-3">
          <ToolsSection editedClient={editedClient} handleChange={handleChange} handleValueChange={handleValueChange} />
        </div>
      </div>
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
