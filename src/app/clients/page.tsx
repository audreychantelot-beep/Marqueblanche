'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

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
];

export default function ClientsPage() {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
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
      <Card>
        <CardHeader>
          <CardTitle>Liste des clients</CardTitle>
          <CardDescription>
            Une liste de tous les clients de votre compte.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </main>
  );
}
