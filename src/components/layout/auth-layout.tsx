"use client";

import { ReactNode } from "react";
import { DarkToggler } from "@/components/ui/dark-toggler";
import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: { children: ReactNode }) => {
   return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] bg-background text-foreground relative">
         {/* Left Side - Better contrast in light mode */}
         <div className="hidden lg:flex flex-col justify-center items-center px-10 py-12 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-muted/30 dark:to-muted text-left text-foreground relative">
            {/* DkNex brand */}
            <div className="absolute top-6 left-6 text-2xl font-bold text-primary">
               <Link href="/" passHref>
                  DkNex
               </Link>
            </div>

            {/* Welcome content centered */}
            <div className="space-y-6 max-w-sm text-center">
               <h1 className="text-3xl font-bold">Hi, Welcome back</h1>
               <p className="text-muted-foreground">
                  to DkNex, your effective AI power Tool.
               </p>
               <Image
                  src="/loginscreen.png"
                  alt="Welcome"
                  width={480}
                  height={360}
                  className="mx-auto mt-6 drop-shadow-xl dark:brightness-95"
                  priority
               />
            </div>
         </div>

         {/* Right Side - Cleaner background */}
         <div className="flex flex-col justify-center px-6 sm:px-12 relative bg-white dark:bg-background">
            <div className="absolute top-6 right-6">
               <DarkToggler />
            </div>
            <div className="w-full max-w-md mx-auto space-y-6">{children}</div>
         </div>
      </div>
   );
};

export default AuthLayout;
