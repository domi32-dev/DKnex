"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { CalendarEvent } from "@/types/calendar-events";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { MonthView } from "@/components/calendar/month-view";
import { TodayView } from "@/components/calendar/today-view";
import { WeekView } from "@/components/calendar/week-view";
import { Calendar, ChevronLeft, ChevronRight, DiamondPlus } from "lucide-react";
import { useTranslation } from "@/i18n/translations";
import React from "react";
import { LampContainer } from "@/components/ui/lamp";

const VIEWS = [
  { key: "today", labelKey: "calendar.today" },
  { key: "7days", labelKey: "calendar.7days" },
  { key: "month", labelKey: "calendar.month" },
];

export function ModernCalendar() {
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [events] = useState<CalendarEvent[]>([
    { id: "1", title: "Tech Conf", date: "2025-04-15", time: "10:30", color: "bg-blue-500" },
    { id: "2", title: "Art Exhibition", date: "2025-04-21", time: "12:00", color: "bg-purple-500" },
    { id: "3", title: "Charity Gala", date: "2025-04-18", color: "bg-red-400" },
    { id: "4", title: "Book Launch", date: "2025-04-27", time: "14:00", color: "bg-pink-400" },
  ]);
  const { t } = useTranslation();

  // Navigation logic for left/right arrows
  function handlePrev() {
    if (view === "today") setCurrentDate(currentDate.subtract(1, "day"));
    else if (view === "7days") setCurrentDate(currentDate.subtract(1, "week"));
    else if (view === "month") setCurrentDate(currentDate.subtract(1, "month"));
  }
  function handleNext() {
    if (view === "today") setCurrentDate(currentDate.add(1, "day"));
    else if (view === "7days") setCurrentDate(currentDate.add(1, "week"));
    else if (view === "month") setCurrentDate(currentDate.add(1, "month"));
  }

  // Helper for current period display
  let periodLabel = "";
  if (view === "month") {
    periodLabel = currentDate.format("MMMM YYYY");
  } else if (view === "7days") {
    const weekStart = currentDate.startOf("week");
    const weekEnd = currentDate.endOf("week");
    periodLabel = `${weekStart.format("MMM D")} – ${weekEnd.format("MMM D, YYYY")}`;
  } else if (view === "today") {
    periodLabel = currentDate.format("dddd, MMM D, YYYY");
  }

  return (
    <Card className="rounded-3xl border-0 bg-white/80 dark:bg-[#23263a]/90 backdrop-blur-xl shadow-md dark:shadow-md hover:shadow-lg transition-all duration-200 p-0 text-foreground w-full mx-auto overflow-hidden relative">
      {/* Lamp effect header */}
      <LampContainer>
        <CardHeader className="pt-6 pb-4 px-6 flex flex-col items-center bg-transparent">
          <span className="rounded-full bg-blue-100/60 dark:bg-blue-900/40 p-2 shadow mb-2">
            <Calendar className="w-7 h-7 text-blue-700 dark:text-blue-200" />
          </span>
          <CardTitle className="text-2xl font-bold text-blue-900 dark:text-white text-center">{t("calendar.title" as any)}</CardTitle> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
          <div className="text-sm font-medium text-muted-foreground mt-0.5 mb-2 text-center whitespace-nowrap max-w-[320px] overflow-hidden text-ellipsis">{t("calendar.subtitle" as any)}</div> {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
          <div className="flex flex-row items-center justify-center gap-4 w-full mb-2">
            <Button size="icon" variant="ghost" onClick={handlePrev} className="rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="text-lg font-semibold text-blue-900 dark:text-white min-w-[180px] text-center">{periodLabel}</div>
            <Button size="icon" variant="ghost" onClick={handleNext} className="rounded-full">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <div className="w-full flex justify-start pl-6 mt-2 w-auto">
          <Tabs value={view} onValueChange={setView} className="w-auto">
            <TabsList className="bg-blue-100/60 dark:bg-blue-900/40 rounded-xl p-1">
              {VIEWS.map(v => (
                <TabsTrigger key={v.key} value={v.key} className="data-[state=active]:bg-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-lg px-4 py-1 transition-all">
                  {t(v.labelKey as any)} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </LampContainer>
      <CardContent className="p-6 max-h-[705px] min-h-[705px] overflow-y-auto">
        <Tabs value={view} onValueChange={setView}>
          <TabsContent value="today">
            <TodayView currentDate={currentDate} events={events} />
          </TabsContent>
          <TabsContent value="7days">
            <WeekView currentDate={currentDate} events={events} />
          </TabsContent>
          <TabsContent value="month">
            <MonthView currentDate={currentDate} events={events} />
          </TabsContent>
        </Tabs>
        {/* Vibrant Floating Add Event Button */}
        <Button className="fixed md:absolute bottom-8 right-8 bg-gradient-to-br from-blue-500 via-violet-500 to-fuchsia-500 text-white font-semibold shadow-2xl hover:brightness-110 transition-all rounded-full px-7 py-4 text-lg z-30 cursor-pointer" style={{boxShadow: '0 8px 32px 0 rgba(80,80,255,0.18)'}}>
          <DiamondPlus className="w-5 h-5 mr-2" />
          {t("calendar.newEvent" as any)} {/* eslint-disable-line @typescript-eslint/no-explicit-any */}
        </Button>
      </CardContent>
    </Card>
  );
} 