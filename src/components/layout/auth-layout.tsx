"use client";

import { ReactNode } from "react";
import { DarkToggler } from "@/components/ui/dark-toggler";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useTranslation } from "@/i18n/translations";
import Image from "next/image";
import Link from "next/link";

const AuthLayout = ({ children }: { children: ReactNode }) => {
   const { language, setLanguage, t } = useTranslation();

   const handleLanguageChange = (lang: string) => {
      setLanguage(lang as "en" | "de");
   };

   return (
      <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] bg-background text-foreground relative">
         {/* Left Side - Welcome message with image */}
         <div className="hidden lg:flex flex-col justify-center items-center px-10 py-12 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-muted/30 dark:to-muted text-left text-foreground relative">
            {/* DkNex brand */}
            <div className="absolute top-6 left-6 text-2xl font-bold text-primary">
               <Link href="/" passHref>
                  DkNex
               </Link>
            </div>

            {/* Welcome content centered */}
            <div className="space-y-6 max-w-sm text-center">
               <h1 className="text-3xl font-bold">{t("auth.welcome.title")}</h1>
               <p className="text-muted-foreground">
                  {t("auth.welcome.subtitle")}
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

         {/* Right Side - Auth form */}
         <div className="flex flex-col justify-center px-6 sm:px-12 relative bg-white dark:bg-background">
            <div className="absolute top-6 right-6 flex items-center gap-2">
               <LanguageSelector
                  currentLanguage={language}
                  onLanguageChange={handleLanguageChange}
                  onlyFlag={true}
                  className="bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent [&_[data-slot=select-trigger]]:bg-transparent [&_[data-slot=select-trigger]]:border-none [&_[data-slot=select-trigger]]:shadow-none [&_[data-slot=select-trigger]]:hover:bg-transparent [&_[data-slot=select-trigger]]:focus:bg-transparent"
               />
               <DarkToggler />
            </div>
            <div className="w-full max-w-md mx-auto space-y-6">{children}</div>
         </div>
      </div>
   );
};

export default AuthLayout;
