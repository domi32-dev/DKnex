import { ModernCalendar } from "@/components/calendar/modern-calendar";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
   return (
      <DashboardShell>
         <AuroraBackground className="fixed inset-0 w-full h-full z-0">{null}</AuroraBackground>
         <div className="relative z-10">
            <div className="w-full max-w-[1800px] mx-auto px-6 py-4 min-h-screen space-y-6">
               <ModernCalendar />
            </div>
         </div>
      </DashboardShell>
   );
}

export async function generateMetadata() {
  return {
    title: "Calendar",
  };
}
