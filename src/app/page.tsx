import { DashboardShell } from "@/components/layout/dashboard-shell";
import { FormBuilderLanding } from "@/components/form-builder/form-builder-landing";
import { AuroraBackground } from "@/components/ui/aurora-background";

export default function Home() {
   return (
      <>
         <DashboardShell>
            <AuroraBackground className="fixed inset-0 w-full h-full z-0">{null}</AuroraBackground>
            <div className="relative z-10">
               <FormBuilderLanding />
            </div>
         </DashboardShell>
      </>
   );
}

export async function generateMetadata() {
  return {
    title: "Dashboard | DkNex",
  };
}
