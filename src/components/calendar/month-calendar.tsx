"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { CalendarEvent } from "@/types/calendar-events";
import { cn } from "@/lib/utils"; // optional if you're using shadcn/ui

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const events: CalendarEvent[] = [
    { id: "1", title: "Tech Conf", date: "2025-04-15", time: "10:30", color: "bg-blue-500" },
    { id: "2", title: "Art Exhibition", date: "2025-04-21", time: "12:00", color: "bg-purple-500" },
    { id: "3", title: "Charity Gala", date: "2025-04-18", color: "bg-red-400" },
    { id: "4", title: "Book Launch", date: "2025-04-27", time: "14:00", color: "bg-pink-400" },
  ];

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
    <div className="bg-zinc-900 text-white p-4 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{currentDate.format("D MMM YYYY")}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(dayjs())}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
            className="text-sm text-gray-300 hover:text-white"
          >
            ←
          </button>
          <button
            onClick={() => setCurrentDate(currentDate.add(1, "month"))}
            className="text-sm text-gray-300 hover:text-white"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-sm text-gray-400 mb-2">
        {weekdays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => {
          const dateStr = d.format("YYYY-MM-DD");
          const isToday = dateStr === today;
          const dayEvents = events.filter((e) => e.date === dateStr);

          return (
            <div
              key={dateStr}
              className={cn(
                "rounded-md p-2 h-24 text-xs relative transition-all",
                d.month() !== currentDate.month() ? "text-gray-500" : "text-white",
                isToday && "border border-red-400"
              )}
            >
              <div className="font-semibold text-sm">{d.date()}</div>
              <div className="absolute top-5 left-0 w-full space-y-1 px-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn("truncate rounded px-1 py-0.5 text-[10px] text-white", event.color || "bg-blue-600")}
                  >
                    {event.time ? `${event.time} ` : ""}
                    {event.title}
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
