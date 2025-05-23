import dayjs from "dayjs";
import { CalendarEvent } from "@/types/calendar-events";
import { cn } from "@/lib/utils";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthView({ currentDate, events, onDayClick }: {
  currentDate: dayjs.Dayjs,
  events: CalendarEvent[],
  onDayClick?: (date: string) => void
}) {
  const startOfMonth = currentDate.startOf("month");
  const endOfMonth = currentDate.endOf("month");
  const startDate = startOfMonth.startOf("week");
  const endDate = endOfMonth.endOf("week");

  const days: dayjs.Dayjs[] = [];
  let day = startDate;
  while (day.isBefore(endDate, "day")) {
    days.push(day);
    day = day.add(1, "day");
  }

  const today = dayjs().format("YYYY-MM-DD");

  return (
    <div className="rounded-3xl bg-white/70 dark:bg-[#23263a]/70 shadow-lg backdrop-blur-xl border-0 p-2">
      <div className="grid grid-cols-7 text-center text-xs text-muted-foreground mb-2">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const dateStr = d.format("YYYY-MM-DD");
          const isToday = dateStr === today;
          const dayEvents = events.filter((e) => e.date === dateStr);
          return (
            <button
              key={dateStr}
              onClick={() => onDayClick?.(dateStr)}
              className={cn(
                "rounded-2xl p-2 h-24 text-xs relative transition-all w-full outline-none focus-visible:ring-2 focus-visible:ring-primary/70 border-0 bg-white/60 dark:bg-[#23263a]/60 hover:bg-blue-100/40 dark:hover:bg-blue-900/30 text-blue-900 dark:text-white shadow-sm backdrop-blur-md",
                d.month() !== currentDate.month() ? "opacity-40" : "",
                isToday && "border-2 border-blue-400 dark:border-violet-400"
              )}
              tabIndex={0}
              type="button"
            >
              <div className="font-semibold text-sm mb-1">{d.date()}</div>
              <div className="absolute top-7 left-0 w-full space-y-1 px-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "truncate rounded px-1 py-0.5 text-[10px] text-white cursor-pointer hover:brightness-110 hover:scale-[1.03] transition-all backdrop-blur-md",
                      event.color || "bg-blue-600",
                      "bg-opacity-70 dark:bg-opacity-60"
                    )}
                  >
                    {event.time ? `${event.time} ` : ""}
                    {event.title}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
} 