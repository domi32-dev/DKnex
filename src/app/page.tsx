import { Hero } from "@/components/dashboard/hero";
import { KPI } from "@/components/dashboard/kpi";
import { FeaturedApp } from "@/components/dashboard/featured-app";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const chartData = [
   { label: "Jan", value: 34 },
   { label: "Feb", value: 48 },
   { label: "Mar", value: 40 },
   { label: "Apr", value: 51 },
   { label: "May", value: 44 },
   { label: "Jun", value: 32 },
   { label: "Jul", value: 37 },
];

export default function Home() {
   return (
      <DashboardShell>
         <div className="min-h-screen bg-background text-foreground p-6 space-y-6">
            <Hero />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
               <KPI
                  title="Total active users"
                  value="18,765"
                  trend="+2.6%"
                  trendColor="text-green-500"
                  chartData={chartData}
               />
               <KPI
                  title="Total installed"
                  value="4,876"
                  trend="+0.2%"
                  trendColor="text-green-500"
               />
               <KPI
                  title="Total downloads"
                  value="678"
                  trend="-0.1%"
                  trendColor="text-red-500"
               />
            </div>

            <FeaturedApp />
         </div>
      </DashboardShell>
   );
}
