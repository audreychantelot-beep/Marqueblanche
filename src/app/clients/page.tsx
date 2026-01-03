'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Upload } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
    status: "Inactive",
  },
];


function ClientsContent() {
  return (
    <main className="flex flex-col p-4 md:p-6 lg:p-8 max-w-full mx-auto w-full h-[calc(100vh-4rem)]">
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
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 flex flex-col p-0">
          <Tabs defaultValue="general" className="flex-1 flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Liste des clients</CardTitle>
                  <CardDescription>
                    Une liste de tous les clients de votre compte.
                  </CardDescription>
                </div>
                <TabsList>
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="missions">Missions</TabsTrigger>
                  <TabsTrigger value="activites">Activités</TabsTrigger>
                  <TabsTrigger value="obligations">Obligations</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <div className="flex-1 overflow-y-auto">
              <ScrollArea className="h-full">
                  <TabsContent value="general" className="m-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Identifiant interne</TableHead>
                          <TableHead>SIREN</TableHead>
                          <TableHead>Raison sociale</TableHead>
                          <TableHead>Forme juridique</TableHead>
                          <TableHead>Contact principal</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.map((client) => (
                          <TableRow key={client.identifiantInterne}>
                            <TableCell className="font-medium">{client.identifiantInterne}</TableCell>
                            <TableCell>{client.siren}</TableCell>
                            <TableCell>{client.raisonSociale}</TableCell>
                            <TableCell>{client.formeJuridique}</TableCell>
                            <TableCell>
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
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                                  <DropdownMenuItem>Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="missions" className="m-0">
                    <Table>
                       <TableHeader>
                        <TableRow>
                          <TableHead>Raison sociale</TableHead>
                          <TableHead>Collaborateur référent</TableHead>
                          <TableHead>Expert-comptable responsable</TableHead>
                          <TableHead>Type de mission</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.map((client) => (
                          <TableRow key={client.identifiantInterne}>
                            <TableCell className="font-medium">{client.raisonSociale}</TableCell>
                            <TableCell>{client.missionsActuelles.collaborateurReferent}</TableCell>
                            <TableCell>{client.missionsActuelles.expertComptableResponsable}</TableCell>
                            <TableCell>
                               <Badge variant={client.missionsActuelles.typeMission === 'Tenue' ? 'default' : client.missionsActuelles.typeMission === 'Révision' ? 'secondary' : 'outline'}>
                                {client.missionsActuelles.typeMission}
                              </Badge>
                            </TableCell>
                             <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                                  <DropdownMenuItem>Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="activites" className="m-0">
                     <Table>
                       <TableHeader>
                        <TableRow>
                          <TableHead>Raison sociale</TableHead>
                          <TableHead>Code APE</TableHead>
                          <TableHead>Secteur d’activités</TableHead>
                          <TableHead>Régime de TVA</TableHead>
                          <TableHead>Régime fiscal</TableHead>
                          <TableHead>Typologie de clientèle</TableHead>
                           <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                         {clients.map((client) => (
                          <TableRow key={client.identifiantInterne}>
                            <TableCell className="font-medium">{client.raisonSociale}</TableCell>
                            <TableCell>{client.activites.codeAPE}</TableCell>
                            <TableCell>{client.activites.secteurActivites}</TableCell>
                            <TableCell>{client.activites.regimeTVA}</TableCell>
                            <TableCell>{client.activites.regimeFiscal}</TableCell>
                            <TableCell>{client.activites.typologieClientele}</TableCell>
                             <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                                  <DropdownMenuItem>Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="obligations" className="m-0">
                    <Table>
                       <TableHeader>
                        <TableRow>
                           <TableHead>Raison sociale</TableHead>
                           <TableHead>Obligations légales</TableHead>
                           <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.map((client) => (
                          <TableRow key={client.identifiantInterne}>
                             <TableCell className="font-medium">{client.raisonSociale}</TableCell>
                             <TableCell>À définir</TableCell>
                             <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                  <DropdownMenuItem>Modifier</DropdownMenuItem>
                                  <DropdownMenuItem>Supprimer</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
              </ScrollArea>
            </div>
          </Tabs>
        </CardContent>
      </Card>
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
