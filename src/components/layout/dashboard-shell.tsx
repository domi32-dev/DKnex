"use client";

import { ReactNode, useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { useSession, signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import AuthLayout from "@/components/layout/auth-layout";

export const DashboardShell = ({ children }: { children: ReactNode }) => {
   const [collapsed, setCollapsed] = useState(false);
   const [isMobile, setIsMobile] = useState(false);
   const [isMobileOpen, setIsMobileOpen] = useState(false);

   const { data: session, status } = useSession();

   // On mount: determine if viewport is mobile-sized
   useEffect(() => {
      const handleResize = () => {
         setIsMobile(window.innerWidth < 768);
      };

      handleResize(); // Run initially
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
   }, []);

   // Show loading spinner while auth session is being resolved
   if (status === "loading") {
      return (
         <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2">Loading session…</span>
         </div>
      );
   }

   // If no session, prompt user to sign in (email or Google)
   if (!session) {
      return (
         <AuthLayout>
            <div className="flex flex-col items-center justify-center gap-4 text-center">
               <h1 className="text-2xl font-bold">Welcome to DoKi@Software</h1>
               <p className="text-muted-foreground">
                  Please sign in to continue.
               </p>

               <div className="flex gap-4 mt-2">
                  {/* Email sign-in */}
                  <Link href="/auth/signin">
                     <Button
                        className="w-40 h-10 flex items-center justify-center cursor-pointer"
                        aria-label="Sign in with Email"
                        title="Sign in using your email address"
                     >
                        Sign in with Email
                     </Button>
                  </Link>

                  {/* Google sign-in */}
                  <Button
                     variant="outline"
                     className="p-2 w-10 h-10 rounded-md flex items-center justify-center cursor-pointer"
                     onClick={() => signIn("google")}
                     aria-label="Sign in with Google"
                     title="Sign in using your Google account"
                  >
                     <Image
                        src="/google.svg"
                        alt="Google logo"
                        width={20}
                        height={20}
                        className="dark:invert-0"
                     />
                  </Button>
               </div>
            </div>
         </AuthLayout>
      );
   }

   return (
      <div className="min-h-screen bg-background text-foreground">
         {/* Sidebar: visible on desktop, toggled on mobile */}
         <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            isMobile={isMobile}
            setIsMobileOpen={setIsMobileOpen}
         />

         {/* Overlay (mobile only): closes sidebar when clicked */}
         {isMobile && isMobileOpen && (
            <div
               className="fixed inset-0 bg-black/50 z-30"
               onClick={() => setIsMobileOpen(false)}
            />
         )}

         {/* Main content wrapper */}
         <div
            className={`
          flex flex-col min-h-screen transition-all duration-300
          ${isMobile ? "ml-0" : collapsed ? "ml-16" : "ml-64"}
        `}
         >
            <Topbar />
            <main className="flex-1 w-full max-w-[1800px] mx-auto px-6 py-4">
               {/* Main content rendered here */}
               {children}
            </main>
         </div>
      </div>
   );
};
