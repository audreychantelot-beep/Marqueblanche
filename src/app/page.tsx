'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";
import { Hand } from "lucide-react";

function DashboardContent() {
  const { user } = useUser();

  return (
    <main className="flex flex-col flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="font-headline text-2xl font-semibold md:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">Voici un aperçu de votre activité.</p>
      </div>
      <div className="flex-1">
        <Card className="w-1/3 h-1/3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Bonjour, {user?.displayName?.split(' ')[0] || 'Utilisateur'} !
            </CardTitle>
            <Hand className="h-5 w-5 text-amber-500" />
          </CardHeader>
        </Card>
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
