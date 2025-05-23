"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { CalendarEvent } from "@/types/calendar-events";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthCalendar() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", time: "", color: "bg-blue-500" });
  const [events, setEvents] = useState<CalendarEvent[]>([
    { id: "1", title: "Tech Conf", date: "2025-04-15", time: "10:30", color: "bg-blue-500" },
    { id: "2", title: "Art Exhibition", date: "2025-04-21", time: "12:00", color: "bg-purple-500" },
    { id: "3", title: "Charity Gala", date: "2025-04-18", color: "bg-red-400" },
    { id: "4", title: "Book Launch", date: "2025-04-27", time: "14:00", color: "bg-pink-400" },
  ]);

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

  function openDayDialog(date: string) {
    setSelectedDay(date);
    setSelectedEvent(null);
    setShowDialog(true);
    setNewEvent({ title: "", time: "", color: "bg-blue-500" });
  }

  function openEventDialog(event: CalendarEvent) {
    setSelectedEvent(event);
    setSelectedDay(null);
    setShowDialog(true);
  }

  function closeDialog() {
    setShowDialog(false);
    setSelectedDay(null);
    setSelectedEvent(null);
  }

  function handleAddEvent() {
    if (!selectedDay || !newEvent.title) return;
    setEvents([
      ...events,
      {
        id: Math.random().toString(36).slice(2),
        title: newEvent.title,
        date: selectedDay,
        time: newEvent.time,
        color: newEvent.color,
      },
    ]);
    closeDialog();
  }

  function handleDeleteEvent(id: string) {
    setEvents(events.filter((e) => e.id !== id));
    closeDialog();
  }

  return (
    <div className="rounded-3xl border-0 bg-white/80 dark:bg-[#23263a]/90 backdrop-blur-xl shadow-md dark:shadow-md hover:shadow-lg transition-all duration-200 p-6 text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setCurrentDate(dayjs())}
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(currentDate.subtract(1, "month"))}
          >
            ←
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentDate(currentDate.add(1, "month"))}
          >
            →
          </Button>
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
          const isSelected = selectedDay === dateStr;
          const dayEvents = events.filter((e) => e.date === dateStr);

          return (
            <button
              key={dateStr}
              onClick={() => openDayDialog(dateStr)}
              className={cn(
                "rounded-md p-2 h-24 text-xs relative transition-all w-full outline-none focus-visible:ring-2 focus-visible:ring-primary/70",
                d.month() !== currentDate.month() ? "text-gray-500 bg-zinc-800" : "text-white bg-zinc-900 hover:bg-zinc-800",
                isToday && "border-2 border-red-400",
                isSelected && "ring-2 ring-primary/80 z-10"
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
                      "truncate rounded px-1 py-0.5 text-[10px] text-white cursor-pointer hover:brightness-110 hover:scale-[1.03] transition-all",
                      event.color || "bg-blue-600"
                    )}
                    onClick={e => {
                      e.stopPropagation();
                      openEventDialog(event);
                    }}
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

      <Dialog open={showDialog} onOpenChange={open => { if (!open) closeDialog(); }}>
        <DialogContent>
          {selectedEvent ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedEvent.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col gap-2 mt-2">
                    <span>Date: {selectedEvent.date}</span>
                    {selectedEvent.time && <span>Time: {selectedEvent.time}</span>}
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="destructive" onClick={() => handleDeleteEvent(selectedEvent.id)}>
                  Delete
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : selectedDay ? (
            <>
              <DialogHeader>
                <DialogTitle>Add Event</DialogTitle>
                <DialogDescription>
                  <span>Date: {selectedDay}</span>
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-2 mt-2">
                <Input
                  placeholder="Event title"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                />
                <Input
                  placeholder="Time (optional)"
                  value={newEvent.time}
                  onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                />
                <select
                  className="rounded-md border px-2 py-1 bg-background text-foreground"
                  value={newEvent.color}
                  onChange={e => setNewEvent({ ...newEvent, color: e.target.value })}
                >
                  <option value="bg-blue-500">Blue</option>
                  <option value="bg-purple-500">Purple</option>
                  <option value="bg-red-400">Red</option>
                  <option value="bg-pink-400">Pink</option>
                  <option value="bg-green-500">Green</option>
                  <option value="bg-yellow-400">Yellow</option>
                </select>
              </div>
              <DialogFooter>
                <Button onClick={handleAddEvent} disabled={!newEvent.title}>
                  Add Event
                </Button>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
