'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Hand } from "lucide-react";

function DashboardContent() {
  const { user } = useUser();
  const dashboardImage = PlaceHolderImages.find(p => p.id === 'dashboard-hero');

  return (
    <main className="flex flex-col flex-1 p-4 md:p-6 max-w-full mx-auto w-full">
      <div className="mb-6">
        <h1 className="font-headline text-2xl font-semibold md:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">Voici un aperçu de votre activité.</p>
      </div>
      <div className="flex-1 flex gap-6">
        <div className="w-1/4 h-full">
            {dashboardImage && (
                <Card className="h-full w-full overflow-hidden">
                    <CardContent className="p-0 h-full">
                    <div className="relative h-full w-full">
                        <Image
                        src={dashboardImage.imageUrl}
                        alt={dashboardImage.description}
                        fill
                        className="object-cover"
                        data-ai-hint={dashboardImage.imageHint}
                        />
                    </div>
                    </CardContent>
                </Card>
            )}
        </div>
        <div className="w-1/3">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                Bonjour, {user?.displayName?.split(' ')[0] || 'Utilisateur'} !
                </CardTitle>
                <Hand className="h-5 w-5 text-amber-500" />
            </CardHeader>
            </Card>
        </div>
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
