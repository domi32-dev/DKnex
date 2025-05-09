import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
   return (
      <DashboardShell>
         <AuroraBackground className="fixed inset-0 w-full h-full z-0">{null}</AuroraBackground>
         <div className="relative z-10">
            <DashboardContent />
         </div>
      </DashboardShell>
   );
}
