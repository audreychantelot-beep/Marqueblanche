'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";
import { Hand } from "lucide-react";

function DashboardContent() {
  const { user } = useUser();

  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="font-headline text-2xl font-semibold md:text-3xl">Dashboard</h1>
          <p className="text-muted-foreground">Voici un aperçu de votre activité.</p>
        </div>
        <Card className="max-w-sm ml-auto">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bonjour, {user?.displayName?.split(' ')[0] || 'Utilisateur'} !
            </CardTitle>
            <Hand className="h-5 w-5 text-amber-500" />
          </CardHeader>
        </Card>
      </div>
      <div className="grid gap-6">
        {/* Le contenu principal du tableau de bord peut être ajouté ici */}
      </div>
    </main>
  );
}


export default function DashboardPage() {
  return (
    <AppLayout>
      <DashboardContent />
    </AppLayout>
  );
}
