'use client';

import { ReactNode, useState } from "react";
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
   const { data: session, status } = useSession();

   if (status === "loading") {
      return (
         <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2">Loading session…</span>
         </div>
      );
   }

   if (!session) {
      return (
         <AuthLayout>
            <div className="flex flex-col items-center justify-center gap-4 text-center">
               <h1 className="text-2xl font-bold">Welcome to DoKi@Software</h1>
               <p className="text-muted-foreground">
                  Please sign in to continue.
               </p>

               <div className="flex gap-4 mt-2">
                  {/* Sign in with email */}
                  <Link href="/auth/signin">
                     <Button
                        className="w-40 h-10 flex items-center justify-center cursor-pointer"
                        aria-label="Sign in with Email"
                        title="Sign in using your email address"
                     >
                        Sign in with Email
                     </Button>
                  </Link>

                  {/* Sign in with Google (icon only) */}
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
         <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

         <div
            className={`flex flex-col min-h-screen transition-all duration-300 ${
               collapsed ? "ml-16" : "ml-64"
            }`}
         >
            <Topbar />
            <main className="flex-1 w-full max-w-[1800px] mx-auto px-6">
               {/* Added padding with px-6 and ensured full width w-full */}
               <div className="w-full">{children}</div>
            </main>
         </div>
      </div>
   );
};
