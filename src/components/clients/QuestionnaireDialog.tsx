'use client';

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Client, Questionnaire } from '@/lib/clients-data';
import { useUser, useFirestore } from '@/firebase';
import { setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type ClientWithId = Client & { id: string };

interface QuestionnaireDialogProps {
  client: ClientWithId;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onCompleteChange: (isComplete: boolean) => void;
  onSaveSuccess: (data: Questionnaire) => void;
}

const QuestionItem = ({ question, children }: { question: string, children: React.ReactNode }) => (
  <div className="py-4">
    <Label className="font-semibold text-base">{question}</Label>
    <div className="mt-3 space-y-3">{children}</div>
  </div>
);

const RadioOption = ({ id, value, label, subInputName, onSubInputChange, subInputValue, disabled }: { id: string, value: string, label: string, subInputName?: string, onSubInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, subInputValue?: string, disabled?: boolean }) => (
  <div className="flex items-center space-x-3">
    <RadioGroupItem value={value} id={id} />
    <Label htmlFor={id} className="font-normal flex-grow">{label}</Label>
    {subInputName && (
      <Input
        name={subInputName}
        placeholder="Précisez..."
        className="max-w-xs"
        onChange={onSubInputChange}
        value={subInputValue || ''}
        disabled={disabled}
      />
    )}
  </div>
);

const TOTAL_QUESTIONS = 13;

export function QuestionnaireDialog({ client, isOpen, onOpenChange, onCompleteChange, onSaveSuccess }: QuestionnaireDialogProps) {
  const [formState, setFormState] = useState<Questionnaire>(client.questionnaire || {});
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    if (client.questionnaire) {
        setFormState(client.questionnaire);
    }
  }, [client.questionnaire])

  useEffect(() => {
    const answeredQuestions = Object.keys(formState).filter(key => !key.endsWith('_software') && !key.endsWith('_method') && !key.endsWith('_function') && !key.endsWith('_actions') && !key.endsWith('_project') && formState[key as keyof Questionnaire]).length;
    onCompleteChange(answeredQuestions >= TOTAL_QUESTIONS);
  }, [formState, onCompleteChange]);


  const handleValueChange = (name: string, value: string) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (user && firestore) {
        const clientDocRef = doc(firestore, 'users', user.uid, 'clients', client.id);
        setDocumentNonBlocking(clientDocRef, { questionnaire: formState }, { merge: true });
        toast({
            title: "Questionnaire sauvegardé",
            description: `Les réponses pour ${client.raisonSociale} ont été enregistrées.`,
        });
        onSaveSuccess(formState);
        onOpenChange(false);
    } else {
        toast({
            variant: "destructive",
            title: "Erreur",
            description: "Impossible de sauvegarder, utilisateur non connecté.",
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full h-[90vh] flex flex-col rounded-3xl">
        <DialogHeader>
          <DialogTitle>Questionnaire pour {client.raisonSociale}</DialogTitle>
          <DialogDescription>
            Ce questionnaire a pour objectif de mieux connaître votre environnement administratif et numérique afin de vous accompagner dans la mise en conformité à la facturation électronique et d’identifier les solutions les plus adaptées à votre organisation.
            <br />
            Il ne s’agit pas d’un audit mais d’un outil d’échange pour améliorer notre accompagnement.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-1 pr-6 -mr-6">
            <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3", "item-4"]} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">I – Connaissance et perception de la réforme</AccordionTrigger>
              <AccordionContent>
                <QuestionItem question="1. Avez-vous entendu parler de la réforme de la facturation électronique ?">
                  <RadioGroup name="q1" onValueChange={(value) => handleValueChange("q1", value)} value={formState.q1 || ''}>
                    <RadioOption id="q1a" value="detailed" label="Oui, de manière détaillée" />
                    <RadioOption id="q1b" value="partial" label="Oui, mais partiellement" />
                    <RadioOption id="q1c" value="no" label="Non" />
                  </RadioGroup>
                </QuestionItem>
                <QuestionItem question="2. Souhaitez-vous être accompagné ou informé davantage sur les impacts de cette réforme pour votre entreprise ?">
                  <RadioGroup name="q2" onValueChange={(value) => handleValueChange("q2", value)} value={formState.q2 || ''}>
                    <RadioOption id="q2a" value="quickly" label="Oui, rapidement" />
                    <RadioOption id="q2b" value="medium-term" label="Oui, à moyen terme" />
                    <RadioOption id="q2c" value="not-yet" label="Non, pas pour le moment" />
                  </RadioGroup>
                </QuestionItem>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">II – Typologie de votre activité et de votre clientèle</AccordionTrigger>
              <AccordionContent>
                <QuestionItem question="3. Vos clients sont principalement :">
                  <RadioGroup name="q3" onValueChange={(value) => handleValueChange("q3", value)} value={formState.q3 || ''}>
                    <RadioOption id="q3a" value="b2c" label="Des particuliers (B2C)" />
                    <RadioOption id="q3b" value="b2b" label="Des entreprises (B2B)" />
                    <RadioOption id="q3c" value="b2g" label="Des organismes publics (B2G)" />
                    <RadioOption id="q3d" value="mixed" label="Un mélange de plusieurs catégories" />
                  </RadioGroup>
                </QuestionItem>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg font-medium">III – Outils et organisation interne</AccordionTrigger>
              <AccordionContent>
                <QuestionItem question="4. Utilisez-vous actuellement un logiciel de caisse?">
                    <RadioGroup name="q4" onValueChange={(value) => handleValueChange("q4", value)} value={formState.q4 || ''}>
                        <RadioOption id="q4a" value="Oui" label="Oui" subInputName="q4_software" onSubInputChange={handleInputChange} subInputValue={formState.q4_software} disabled={formState.q4 !== 'Oui'} />
                        <RadioOption id="q4b" value="Non" label="Non" subInputName="q4_method" onSubInputChange={handleInputChange} subInputValue={formState.q4_method} disabled={formState.q4 !== 'Non'} />
                    </RadioGroup>
                </QuestionItem>
                <QuestionItem question="5. Utilisez-vous actuellement un logiciel de facturation ?">
                  <RadioGroup name="q5" onValueChange={(value) => handleValueChange("q5", value)} value={formState.q5 || ''}>
                    <RadioOption id="q5a" value="Oui" label="Oui" subInputName="q5_software" onSubInputChange={handleInputChange} subInputValue={formState.q5_software} disabled={formState.q5 !== 'Oui'} />
                    <RadioOption id="q5b" value="Non" label="Non" subInputName="q5_method" onSubInputChange={handleInputChange} subInputValue={formState.q5_method} disabled={formState.q5 !== 'Non'} />
                  </RadioGroup>
                </QuestionItem>
                <QuestionItem question="6. Utilisez-vous un logiciel de gestion commerciale ou un ERP ?">
                  <RadioGroup name="q6" onValueChange={(value) => handleValueChange("q6", value)} value={formState.q6 || ''}>
                    <RadioOption id="q6a" value="Oui" label="Oui" subInputName="q6_software" onSubInputChange={handleInputChange} subInputValue={formState.q6_software} disabled={formState.q6 !== 'Oui'} />
                    <RadioOption id="q6b" value="Non" label="Non" />
                  </RadioGroup>
                </QuestionItem>
                <QuestionItem question="7. Avez-vous un logiciel de gestion comptable ou de précomptabilité interne à l’entreprise ?">
                  <RadioGroup name="q7" onValueChange={(value) => handleValueChange("q7", value)} value={formState.q7 || ''}>
                    <RadioOption id="q7a" value="Oui" label="Oui" subInputName="q7_software" onSubInputChange={handleInputChange} subInputValue={formState.q7_software} disabled={formState.q7 !== 'Oui'} />
                    <RadioOption id="q7b" value="Non" label="Non" />
                  </RadioGroup>
                </QuestionItem>
                <QuestionItem question="8. Disposez-vous d’un logiciel de GED ou d’océrisation ?">
                  <RadioGroup name="q8" onValueChange={(value) => handleValueChange("q8", value)} value={formState.q8 || ''}>
                    <RadioOption id="q8a" value="Oui" label="Oui" subInputName="q8_software" onSubInputChange={handleInputChange} subInputValue={formState.q8_software} disabled={formState.q8 !== 'Oui'} />
                    <RadioOption id="q8b" value="Non" label="Non" />
                  </RadioGroup>
                </QuestionItem>
                <QuestionItem question="9. Vos documents (factures, bons de commande, relevés, etc.) sont aujourd’hui :">
                  <RadioGroup name="q9" onValueChange={(value) => handleValueChange("q9", value)} value={formState.q9 || ''}>
                    <RadioOption id="q9a" value="paper" label="Stockés sur support papier" />
                    <RadioOption id="q9b" value="digital" label="Stockés numériquement (serveur interne, cloud, etc.)" />
                    <RadioOption id="q9c" value="mixed" label="Mixtes (papier et numérique)" />
                  </RadioGroup>
                </QuestionItem>
                <QuestionItem question="10. Disposez-vous d’une personne dédiée à la gestion administrative ou comptable dans votre entreprise ?">
                  <RadioGroup name="q10" onValueChange={(value) => handleValueChange("q10", value)} value={formState.q10 || ''}>
                    <RadioOption id="q10a" value="Oui" label="Oui" subInputName="q10_function" onSubInputChange={handleInputChange} subInputValue={formState.q10_function} disabled={formState.q10 !== 'Oui'} />
                    <RadioOption id="q10b" value="Non" label="Non" />
                  </RadioGroup>
                </QuestionItem>
                <QuestionItem question="11. Comment se déroule aujourd’hui la transmission des pièces au cabinet comptable ?">
                   <RadioGroup name="q11" onValueChange={(value) => handleValueChange("q11", value)} value={formState.q11 || ''}>
                    <RadioOption id="q11a" value="papier" label="Papier" />
                    <RadioOption id="q11b" value="email" label="Par mail" />
                    <RadioOption id="q11c" value="platform" label="Par plateforme dédiée" />
                    <RadioOption id="q11d" value="mixed" label="Mixte" />
                  </RadioGroup>
                </QuestionItem>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg font-medium">IV – Actions déjà engagées</AccordionTrigger>
              <AccordionContent>
                <QuestionItem question="12. Avez-vous déjà entrepris des démarches pour anticiper la réforme de la facturation électronique ?">
                  <RadioGroup name="q12" onValueChange={(value) => handleValueChange("q12", value)} value={formState.q12 || ''}>
                    <RadioOption id="q12a" value="Oui" label="Oui" subInputName="q12_actions" onSubInputChange={handleInputChange} subInputValue={formState.q12_actions} disabled={formState.q12 !== 'Oui'} />
                    <RadioOption id="q12b" value="Non" label="Non" />
                  </RadioGroup>
                </QuestionItem>
                <QuestionItem question="13. Avez-vous déjà un projet ou une réflexion en cours concernant un changement ou une évolution de vos outils administratifs ?">
                  <RadioGroup name="q13" onValueChange={(value) => handleValueChange("q13", value)} value={formState.q13 || ''}>
                    <RadioOption id="q13a" value="Oui" label="Oui" subInputName="q13_project" onSubInputChange={handleInputChange} subInputValue={formState.q13_project} disabled={formState.q13 !== 'Oui'} />
                    <RadioOption id="q13b" value="Non" label="Non" />
                  </RadioGroup>
                </QuestionItem>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Fermer</Button>
          <Button onClick={handleSave}>Sauvegarder les réponses</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
