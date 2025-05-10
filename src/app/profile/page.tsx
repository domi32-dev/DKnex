import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProfileContent } from "@/components/profile/profile-content";
import { AuroraBackground } from "@/components/ui/aurora-background";

export async function generateMetadata() {
  return {
    title: "Profile",
  };
}

export default function ProfilePage() {
   return (
      <DashboardShell>
         <AuroraBackground className="fixed inset-0 w-full h-full z-0">{/* Aurora is now truly full screen */}<></></AuroraBackground>
         <div className="relative z-10 flex items-center justify-center min-h-screen">
            <div className="w-full max-w-5xl px-6 py-12">
               <ProfileContent />
            </div>
         </div>
      </DashboardShell>
   );
}
