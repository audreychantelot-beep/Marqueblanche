'use client';

import { AppLayout } from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/firebase";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Hand, ChevronLeft, ChevronRight } from "lucide-react";
import { WeekCalendar } from "@/components/ui/week-calendar";
import React, { useState } from "react";
import { getWeek, addWeeks, subWeeks, format } from "date-fns";
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";

function DashboardContent() {
  const { user } = useUser();
  const dashboardImage = PlaceHolderImages.find(p => p.id === 'dashboard-hero');
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekNumber = getWeek(currentDate, { weekStartsOn: 1 });

  const goToPreviousWeek = () => {
    setCurrentDate(prev => subWeeks(prev, 1));
  };

  const goToNextWeek = () => {
    setCurrentDate(prev => addWeeks(prev, 1));
  };

  return (
    <main className="flex flex-col flex-1 p-4 md:px-6 max-w-full mx-auto w-full">
      <div className="flex-1 flex gap-6">
        <div className="w-1/2 flex flex-col gap-6">
          <div className="h-1/2">
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
          <div className="h-1/2">
            <Card className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Échéances à venir</CardTitle>
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Button variant="ghost" size="icon" onClick={goToPreviousWeek} className="h-6 w-6">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span>{format(currentDate, 'MMMM yyyy', { locale: fr })}</span>
                    <Button variant="ghost" size="icon" onClick={goToNextWeek} className="h-6 w-6">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-6">
                <WeekCalendar 
                  currentDate={currentDate}
                />
              </CardContent>
            </Card>
          </div>
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
