'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const clients = [
  {
    name: "Liam Johnson",
    email: "liam@example.com",
    avatar: "https://picsum.photos/seed/1/40/40",
    company: "Johnson & Co",
    status: "Active",
  },
  {
    name: "Olivia Smith",
    email: "olivia@example.com",
    avatar: "https://picsum.photos/seed/2/40/40",
    company: "Smith Enterprises",
    status: "Active",
  },
  {
    name: "Noah Williams",
    email: "noah@example.com",
    avatar: "https://picsum.photos/seed/3/40/40",
    company: "Williams Solutions",
    status: "Inactive",
  },
  {
    name: "Emma Brown",
    email: "emma@example.com",
    avatar: "https://picsum.photos/seed/4/40/40",
    company: "Brown Logistics",
    status: "Active",
  },
  {
    name: "Oliver Jones",
    email: "oliver@example.com",
    avatar: "https://picsum.photos/seed/5/40/40",
    company: "Jones Group",
    status: "Archived",
  },
  {
    name: "Ava Garcia",
    email: "ava@example.com",
    avatar: "https://picsum.photos/seed/6/40/40",
    company: "Garcia Inc.",
    status: "Active",
  },
  {
    name: "William Martinez",
    email: "william@example.com",
    avatar: "https://picsum.photos/seed/7/40/40",
    company: "Martinez Corp",
    status: "Inactive",
  },
  {
    name: "Sophia Rodriguez",
    email: "sophia@example.com",
    avatar: "https://picsum.photos/seed/8/40/40",
    company: "Rodriguez LLC",
    status: "Active",
  },
  {
    name: "James Wilson",
    email: "james@example.com",
    avatar: "https://picsum.photos/seed/9/40/40",
    company: "Wilson & Sons",
    status: "Archived",
  },
  {
    name: "Isabella Anderson",
    email: "isabella@example.com",
    avatar: "https://picsum.photos/seed/10/40/40",
    company: "Anderson Ltd",
    status: "Active",
  },
  {
    name: "Benjamin Taylor",
    email: "benjamin@example.com",
    avatar: "https://picsum.photos/seed/11/40/40",
    company: "Taylor Industries",
    status: "Active",
  },
  {
    name: "Mia Thomas",
    email: "mia@example.com",
    avatar: "https://picsum.photos/seed/12/40/40",
    company: "Thomas Co",
    status: "Inactive",
  },
];

export default function ClientsPage() {
  return (
    <main className="flex flex-col p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full h-[calc(100vh-4rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-headline text-2xl font-semibold md:text-3xl">Clients</h1>
          <p className="text-muted-foreground">Gérez vos clients et visualisez leurs informations.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un client
        </Button>
      </div>
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
          <CardDescription>
            Une liste de tous les clients de votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Avatar</span>
                  </TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.email}>
                    <TableCell className="hidden sm:table-cell">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={client.avatar} alt="Avatar" />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.company}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {client.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.status === 'Active' ? 'default' : 'secondary'}>
                        {client.status}
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
          </ScrollArea>
        </CardContent>
      </Card>
    </main>
  );
}
