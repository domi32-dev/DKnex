import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { CalendarEvent } from "@/types/calendar-events";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/i18n/translations";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekView({ currentDate, events }: {
  currentDate: dayjs.Dayjs,
  events: CalendarEvent[],
}) {
  const { t } = useTranslation();
  const start = currentDate.startOf("day");
  const days = Array.from({ length: 7 }, (_, i) => start.add(i, "day"));
  const todayStr = dayjs().format("YYYY-MM-DD");
  const hours = Array.from({ length: 24 }, (_, i) => i);
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
      className="rounded-3xl bg-white/70 dark:bg-[#23263a]/70 shadow-lg backdrop-blur-xl border-0 overflow-x-auto p-0 m-0"
    >
      <div className="grid grid-cols-7 gap-0 w-full">
        {/* 7 day columns */}
        {days.map((d) => {
          const dateStr = d.format("YYYY-MM-DD");
          const isToday = dateStr === todayStr;
          const dayEvents = events.filter(e => e.date === dateStr);
          const weekday = weekdays[d.day()];
          return (
            <div key={dateStr} className={cn(
              "flex flex-col border-r border-muted/20 min-w-[120px] bg-white/60 dark:bg-[#23263a]/60 backdrop-blur-xl relative",
              isToday && "ring-4 ring-blue-500 dark:ring-violet-500 bg-blue-100/80 dark:bg-blue-900/60 z-10 shadow-xl"
            )}>
              {/* Sticky header for each day */}
              <div className="sticky top-0 z-10 h-14 flex flex-col items-center justify-center bg-white/80 dark:bg-[#23263a]/80 backdrop-blur-xl border-b border-muted/20">
                <div className={cn("font-semibold text-blue-900 dark:text-white text-base", isToday ? "text-blue-700 dark:text-violet-300" : "")}>{t(`calendar.${weekday.toLowerCase()}` as any)}</div>
                <div className="text-xs text-muted-foreground">{d.format("dddd, MMM D")}</div>
              </div>
              <div className="divide-y divide-muted-foreground/10">
                {hours.map(hour => {
                  const hourStr = String(hour).padStart(2, "0") + ":00";
                  const hourEvents = dayEvents.filter(e => e.time && e.time.startsWith(hourStr.slice(0, 2)));
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
                      {/* Time label left-aligned, absolutely positioned */}
                      <div className="absolute left-0 top-0 w-12 text-xs text-muted-foreground text-right pt-1 select-none">{hourStr}</div>
                      <div className="ml-14 flex-1 flex flex-col gap-1">
                        {hourEvents.length === 0 ? null : hourEvents.map(event => (
                          <div key={event.id} className={cn(
                            "rounded-xl px-2 py-1 bg-gradient-to-br from-blue-400/80 via-violet-400/70 to-fuchsia-400/70 dark:from-[#23263a]/90 dark:to-blue-900/70 shadow text-white font-medium text-xs",
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
        })}
      </div>
    </div>
  );
} 