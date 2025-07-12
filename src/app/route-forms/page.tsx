import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { RouteFormsContent } from "@/components/route-forms/route-forms-content";

export async function generateMetadata() {
  return {
    title: "Route Generator | DkNex",
    description: "Generate custom routes for hiking, running, cycling and more",
  };
}

export default function RouteFormsPage() {
  return (
    <DashboardShell>
      <AuroraBackground className="fixed inset-0 w-full h-full z-0">{null}</AuroraBackground>
      <div className="relative z-10">
        <div className="w-full max-w-[1800px] mx-auto px-6 py-4 min-h-screen space-y-6">
          <RouteFormsContent />
        </div>
      </div>
    </DashboardShell>
  );
} 