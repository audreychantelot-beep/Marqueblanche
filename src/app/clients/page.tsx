'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload, Info, User, Briefcase, Activity, Wrench } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AppLayout } from "@/components/AppLayout";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const clients = [
  {
    identifiantInterne: "C001",
    siren: "123456789",
    raisonSociale: "Johnson & Co",
    formeJuridique: "SARL",
    contactPrincipal: {
      nom: "Johnson",
      prenom: "Liam",
      email: "liam@example.com",
    },
    avatar: "https://picsum.photos/seed/1/40/40",
    missionsActuelles: {
      collaborateurReferent: "Alice Martin",
      expertComptableResponsable: "Bob Durand",
      typeMission: "Tenue",
    },
    activites: {
      codeAPE: "6201Z",
      secteurActivites: "Conseil en systèmes et logiciels informatiques",
      regimeTVA: "Débit",
      regimeFiscal: "IS régime réel normal",
      typologieClientele: "B to B",
    },
    obligationsLegales: {},
    outils: "QuickBooks",
    status: "Active",
  },
  {
    identifiantInterne: "C002",
    siren: "987654321",
    raisonSociale: "Smith Enterprises",
    formeJuridique: "SAS",
    contactPrincipal: {
      nom: "Smith",
      prenom: "Olivia",
      email: "olivia@example.com",
    },
    avatar: "https://picsum.photos/seed/2/40/40",
    missionsActuelles: {
      collaborateurReferent: "Charles Dupont",
      expertComptableResponsable: "David Petit",
      typeMission: "Révision",
    },
    activites: {
      codeAPE: "7022Z",
      secteurActivites: "Conseil pour les affaires et autres conseils de gestion",
      regimeTVA: "Encaissement",
      regimeFiscal: "IS régime simplifié",
      typologieClientele: "B to C",
    },
    obligationsLegales: {},
    outils: "Xero",
    status: "Active",
  },
  {
    identifiantInterne: "C003",
    siren: "112233445",
    raisonSociale: "Williams Solutions",
    formeJuridique: "EURL",
    contactPrincipal: {
      nom: "Williams",
      prenom: "Noah",
      email: "noah@example.com",
    },
    avatar: "https://picsum.photos/seed/3/40/40",
    missionsActuelles: {
      collaborateurReferent: "Alice Martin",
      expertComptableResponsable: "Bob Durand",
      typeMission: "Autres",
    },
    activites: {
      codeAPE: "4791A",
      secteurActivites: "Vente à distance sur catalogue général",
      regimeTVA: "Non concerné",
      regimeFiscal: "Micro BIC",
      typologieClientele: "Mixtes",
    },
    obligationsLegales: {},
    outils: "Sage",
    status: "Inactive",
  },
];

type Client = typeof clients[0];

function ClientEditDialog({ client, isOpen, onOpenChange, onSave }: { client: Client | null, isOpen: boolean, onOpenChange: (isOpen: boolean) => void, onSave: (updatedClient: Client) => void }) {
  const [editedClient, setEditedClient] = useState<Client | null>(client);

  React.useEffect(() => {
    setEditedClient(client);
  }, [client]);

  if (!editedClient) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    setEditedClient(prev => {
      if (!prev) return null;
      const newClient = { ...prev };
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full w-full h-full max-h-full sm:max-w-[95vw] sm:max-h-[95vh] rounded-3xl flex flex-col">
        <DialogHeader>
          <DialogTitle>Modifier le client : {client?.raisonSociale}</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modifiez les informations du client ci-dessous.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* General Info */}
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
          
          {/* Contact Principal */}
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

          {/* Missions Actuelles */}
          <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase className="w-5 h-5 text-muted-foreground" />Missions Actuelles</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="space-y-2">
                <Label htmlFor="missionsActuelles.collaborateurReferent" className="text-muted-foreground">Collaborateur référent</Label>
                <Input id="missionsActuelles.collaborateurReferent" name="missionsActuelles.collaborateurReferent" value={editedClient.missionsActuelles.collaborateurReferent} onChange={handleChange} className={inputStyle} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="missionsActuelles.expertComptableResponsable" className="text-muted-foreground">Expert-comptable responsable</Label>
                <Input id="missionsActuelles.expertComptableResponsable" name="missionsActuelles.expertComptableResponsable" value={editedClient.missionsActuelles.expertComptableResponsable} onChange={handleChange} className={inputStyle} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="missionsActuelles.typeMission" className="text-muted-foreground">Type de mission</Label>
                <Input id="missionsActuelles.typeMission" name="missionsActuelles.typeMission" value={editedClient.missionsActuelles.typeMission} onChange={handleChange} className={inputStyle} />
              </div>
            </CardContent>
          </Card>

          {/* Activités */}
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

          {/* Outils & Obligations */}
          <Card className="rounded-3xl">
            <CardHeader><CardTitle className="flex items-center gap-2"><Wrench className="w-5 h-5 text-muted-foreground" />Outils & Obligations</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
               <div className="space-y-2">
                <Label htmlFor="outils" className="text-muted-foreground">Outils</Label>
                <Input id="outils" name="outils" value={editedClient.outils} onChange={handleChange} className={inputStyle} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="obligationsLegales" className="text-muted-foreground">Obligations légales</Label>
                <Input id="obligationsLegales" name="obligationsLegales" value={"À définir"} onChange={handleChange} className={inputStyle} />
              </div>
            </CardContent>
          </Card>
        </div>
        <DialogFooter className="p-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave}>Sauvegarder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function ClientsContent() {
  const [clientList, setClientList] = useState(clients);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsDialogOpen(true);
  };
  
  const handleSaveClient = (updatedClient: Client) => {
    setClientList(prevList => 
      prevList.map(c => c.identifiantInterne === updatedClient.identifiantInterne ? updatedClient : c)
    );
  };


  return (
    <main className="flex flex-col p-4 md:p-6 lg:p-8 max-w-full mx-auto w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-semibold md:text-3xl">Clients</h1>
          <p className="text-muted-foreground">Gérez vos clients et visualisez leurs informations.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Importer des clients
          </Button>
          <Button className="rounded-3xl">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un client
          </Button>
        </div>
      </div>
      <Card className="flex-1 flex flex-col rounded-3xl">
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
          <CardDescription>
            Une liste de tous les clients de votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                  <TableHead className="whitespace-nowrap">Identifiant interne</TableHead>
                  <TableHead className="whitespace-nowrap">SIREN</TableHead>
                  <TableHead className="whitespace-nowrap">Raison sociale</TableHead>
                  <TableHead className="whitespace-nowrap">Forme juridique</TableHead>
                  <TableHead className="whitespace-nowrap">Contact principal</TableHead>
                  <TableHead className="whitespace-nowrap">Collaborateur référent</TableHead>
                  <TableHead className="whitespace-nowrap">Expert-comptable responsable</TableHead>
                  <TableHead className="whitespace-nowrap">Type de mission</TableHead>
                  <TableHead className="whitespace-nowrap">Code APE</TableHead>
                  <TableHead className="whitespace-nowrap">Secteur d’activités</TableHead>
                  <TableHead className="whitespace-nowrap">Régime de TVA</TableHead>
                  <TableHead className="whitespace-nowrap">Régime fiscal</TableHead>
                  <TableHead className="whitespace-nowrap">Typologie de clientèle</TableHead>
                  <TableHead className="whitespace-nowrap">Outils</TableHead>
                  <TableHead className="whitespace-nowrap">Obligations légales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientList.map((client) => (
                  <TableRow key={client.identifiantInterne} onClick={() => handleEditClick(client)} className="cursor-pointer">
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleEditClick(client)}>Modifier</DropdownMenuItem>
                          <DropdownMenuItem>Supprimer</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    <TableCell className="font-medium whitespace-nowrap">{client.identifiantInterne}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.siren}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.raisonSociale}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.formeJuridique}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={client.avatar} alt="Avatar" />
                          <AvatarFallback>{client.contactPrincipal.prenom.charAt(0)}{client.contactPrincipal.nom.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div>{client.contactPrincipal.prenom} {client.contactPrincipal.nom}</div>
                          <div className="text-muted-foreground text-xs">{client.contactPrincipal.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{client.missionsActuelles.collaborateurReferent}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.missionsActuelles.expertComptableResponsable}</TableCell>
                    <TableCell className="whitespace-nowrap">
                       <Badge variant={client.missionsActuelles.typeMission === 'Tenue' ? 'default' : client.missionsActuelles.typeMission === 'Révision' ? 'secondary' : 'outline'}>
                        {client.missionsActuelles.typeMission}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">{client.activites.codeAPE}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.activites.secteurActivites}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.activites.regimeTVA}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.activites.regimeFiscal}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.activites.typologieClientele}</TableCell>
                    <TableCell className="whitespace-nowrap">{client.outils}</TableCell>
                    <TableCell className="whitespace-nowrap">À définir</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <ClientEditDialog 
        client={selectedClient} 
        isOpen={isDialogOpen} 
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveClient}
      />
    </main>
  );
}

export default function ClientsPage() {
  return (
    <AppLayout>
      <ClientsContent />
    </AppLayout>
  );
}
