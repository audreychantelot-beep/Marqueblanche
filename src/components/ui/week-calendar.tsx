'use client';

import React, { useState } from 'react';
import { format, startOfWeek, addDays, subDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function WeekCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday

  const days = Array.from({ length: 5 }).map((_, i) =>
    addDays(startOfCurrentWeek, i)
  );

  const goToPreviousWeek = () => {
    setCurrentDate(subDays(currentDate, 7));
  };

  const goToNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };
  
  const today = new Date();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousWeek}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-semibold">
          Semaine du {format(startOfCurrentWeek, 'd MMMM yyyy', { locale: fr })}
        </h3>
        <Button variant="ghost" size="icon" onClick={goToNextWeek}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {days.map((day) => (
          <div key={day.toString()} className="flex flex-col items-center p-2 rounded-lg border">
            <span
              className={cn("text-sm font-medium", 
                isSameDay(day, today) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {format(day, 'eee', { locale: fr }).toUpperCase()}
            </span>
            <span
              className={cn(
                "mt-1 text-2xl font-bold flex items-center justify-center h-10 w-10 rounded-full",
                isSameDay(day, today) ? "bg-primary text-primary-foreground" : ""
              )}
            >
              {format(day, 'd')}
            </span>
            <div className="mt-2 h-24 w-full overflow-y-auto">
              {/* Event items can be mapped here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}