import dayjs from "dayjs";
import "dayjs/locale/de";
import { useEffect, useRef } from "react";
import { CalendarEvent } from "@/types/calendar-events";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/translations";

export function TodayView({ currentDate, events }: {
  currentDate: dayjs.Dayjs,
  events: CalendarEvent[],
}) {
  const { t, language } = useTranslation();
  dayjs.locale(language);
  const weekdays = [
    t('calendar.sun' as const),
    t('calendar.mon' as const),
    t('calendar.tue' as const),
    t('calendar.wed' as const),
    t('calendar.thu' as const),
    t('calendar.fri' as const),
    t('calendar.sat' as const),
  ];
  const todayStr = currentDate.format("YYYY-MM-DD");
  const todaysEvents = events.filter(e => e.date === todayStr);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const weekday = weekdays[currentDate.day()];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to current time - 2 hours (or top if before 2am)
    const now = dayjs();
    const hour = Math.max(0, now.hour() - 2);
    if (scrollRef.current) {
      scrollRef.current.scrollTop = hour * 48; // 48px per hour row
    }
  }, []);

  return (
    <div
      ref={scrollRef}
      className="rounded-3xl bg-white/70 dark:bg-[#23263a]/70 shadow-lg backdrop-blur-xl border-0"
    >
      <div className="sticky top-0 z-10 h-14 flex flex-col items-center justify-center bg-white/80 dark:bg-[#23263a]/80 backdrop-blur-xl border-b border-muted/20">
        <div className="font-semibold text-blue-900 dark:text-white text-base">{weekday}</div>
        <div className="text-xs text-muted-foreground">{currentDate.format(t('calendar.dateFormatDay' as const))}</div>
      </div>
      <div className="divide-y divide-muted-foreground/10">
        {hours.map(hour => {
          const hourStr = String(hour).padStart(2, "0") + ":00";
          const hourEvents = todaysEvents.filter(e => e.time && e.time.startsWith(hourStr.slice(0, 2)));
          const isWorkHour = hour >= 8 && hour < 18;
          return (
            <div
              key={hour}
              className={cn(
                "h-12 px-2 py-1 flex flex-col gap-1 relative group transition-all",
                isWorkHour ? "bg-blue-50/60 dark:bg-blue-900/30" : "bg-transparent",
                "hover:bg-blue-100/40 dark:hover:bg-blue-900/20"
              )}
            >
              <div className="absolute left-0 top-0 w-12 text-xs text-muted-foreground text-right pt-1 select-none">{hourStr}</div>
              <div className="ml-14 flex-1 flex flex-col gap-1">
                {hourEvents.length === 0 ? null : hourEvents.map(event => (
                  <div key={event.id} className={cn(
                    "rounded-xl px-2 py-1 bg-gradient-to-br from-blue-400/80 via-indigo-400/70 to-purple-400/70 dark:from-[#23263a]/90 dark:to-blue-900/70 shadow text-white font-medium text-xs",
                    event.color || "bg-blue-500"
                  )}>
                    <span>{event.title}</span>
                    {event.time && <span className="ml-2 text-xs text-white/80">{event.time}</span>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 