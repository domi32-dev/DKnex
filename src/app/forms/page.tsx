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
        <div className="w-full max-w-[1800px] mx-auto px-6 py-4 min-h-screen space-y-6">
          <FormsContent />
        </div>
      </div>
    </DashboardShell>
  );
} 