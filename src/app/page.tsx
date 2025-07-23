import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ModernDashboard } from "@/components/form-builder/modern-dashboard";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
   return (
         <DashboardShell>
            <AuroraBackground className="fixed inset-0 w-full h-full z-0">{null}</AuroraBackground>
            <div className="relative z-10">
               <ModernDashboard />
            </div>
         </DashboardShell>
   );
}

export async function generateMetadata() {
  return {
    title: "Dashboard | DkNex - Modern AI-Powered Form Builder",
    description: "Experience the future of form building with AI insights, smart recommendations, and intuitive design.",
  };
}
