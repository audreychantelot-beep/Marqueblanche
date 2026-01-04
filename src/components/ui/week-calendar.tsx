'use client';

import React from 'react';
import { format, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface WeekCalendarProps {
  currentDate: Date;
}

export function WeekCalendar({ currentDate }: WeekCalendarProps) {
  const days = Array.from({ length: 5 }).map((_, i) =>
    addDays(currentDate, i)
  );
  
  const today = new Date();

  return (
    <div className="w-full h-full flex flex-col">
      <Table className="h-full">
        <TableHeader>
          <TableRow>
            {days.map((day) => (
              <TableHead key={day.toString()} className={cn("text-center", isSameDay(day, today) ? "text-primary" : "")}>
                 <span className="text-sm font-medium">
                  {format(day, 'eee', { locale: fr }).toUpperCase()}
                </span>
                <span className="text-2xl font-bold ml-2">
                  {format(day, 'd')}
                </span>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="h-full">
            {days.map((day) => (
              <TableCell key={day.toString()} className="h-full align-top">
                {/* Event items for {format(day, 'eee')} can be mapped here */}
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
