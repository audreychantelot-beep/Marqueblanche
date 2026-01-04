'use client';

import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WeekCalendarProps {
  currentDate: Date;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
}

export function WeekCalendar({ currentDate, onPreviousWeek, onNextWeek }: WeekCalendarProps) {
  const startOfCurrentWeek = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday

  const days = Array.from({ length: 5 }).map((_, i) =>
    addDays(startOfCurrentWeek, i)
  );
  
  const today = new Date();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={onPreviousWeek}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h3 className="text-lg font-semibold">
          {format(startOfCurrentWeek, 'MMMM yyyy', { locale: fr })}
        </h3>
        <Button variant="ghost" size="icon" onClick={onNextWeek}>
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {days.map((day) => (
          <div key={day.toString()} className="flex flex-col items-center p-2 rounded-lg border">
            <div className={cn("flex items-baseline gap-2 text-lg", isSameDay(day, today) ? "font-bold text-primary" : "text-muted-foreground")}>
              <span className="text-sm">
                {format(day, 'eee', { locale: fr }).toUpperCase()}
              </span>
              <span className="text-2xl">
                {format(day, 'd')}
              </span>
            </div>
            <div className="mt-2 h-24 w-full overflow-y-auto">
              {/* Event items can be mapped here */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
