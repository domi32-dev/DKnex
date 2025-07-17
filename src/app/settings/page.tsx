import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SettingsContent } from "@/components/settings/settings-content";
import { AuroraBackground } from "@/components/ui/aurora-background";

export async function generateMetadata() {
  return {
    title: "Settings",
  };
}

export default function SettingsPage() {
   return (
      <DashboardShell>
            <AuroraBackground className="fixed inset-0 w-full h-full z-0">{null}</AuroraBackground>
            <div className="relative z-10">
               <div className="w-full max-w-[1200px] mx-auto px-6 py-4 min-h-screen space-y-6">
                  <SettingsContent />
               </div>
            </div>
      </DashboardShell>
   );
} 