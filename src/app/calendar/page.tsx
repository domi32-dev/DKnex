import { MonthCalendar } from "@/components/calendar/month-calendar";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function Home() {
   return (
      <DashboardShell>
         <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
            <MonthCalendar />
         </div>
      </DashboardShell>
   );
}
