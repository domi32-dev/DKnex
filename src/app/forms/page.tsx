import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { FormsContent } from "@/components/forms/forms-content";

export async function generateMetadata() {
  return {
    title: "My Forms | FormFlow",
  };
}

export default function FormsPage() {
  return (
    <DashboardShell>
      <AuroraBackground className="fixed inset-0 w-full h-full z-0">{null}</AuroraBackground>
      <div className="relative z-10">
        {/* Match ModernDashboard container style */}
        <div className="min-h-screen p-6 space-y-8 max-w-full">
          <FormsContent />
        </div>
      </div>
    </DashboardShell>
  );
} 