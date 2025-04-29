import { DashboardShell } from "@/components/layout/dashboard-shell";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function Home() {
   return (
      <DashboardShell>
         <DashboardContent />
      </DashboardShell>
   );
}
