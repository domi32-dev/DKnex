import { Hero } from "@/components/dashboard/hero";
import { KPI } from "@/components/dashboard/kpi";
import { FeaturedApp } from "@/components/dashboard/featured-app";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import MapClientWrapper from "@/components/map/map-client-wrapper";

export default function Home() {
   return (
      <DashboardShell>
         <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
            <MapClientWrapper />
         </div>
      </DashboardShell>
   );
}

export async function generateMetadata() {
  return {
    title: "Map",
  };
}
