import { DashboardShell } from "@/components/layout/dashboard-shell";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { SubmissionsContent } from "@/components/submissions/submissions-content";

export async function generateMetadata() {
  return {
    title: "Form Submissions | DkNex",
    description: "View and manage all form submissions",
  };
}

export default function SubmissionsPage() {
  return (
    <DashboardShell>
      <AuroraBackground className="fixed inset-0 w-full h-full z-0">{null}</AuroraBackground>
      <div className="relative z-10">
        <SubmissionsContent />
      </div>
    </DashboardShell>
  );
} 