"use client";

import { useState, useEffect } from "react";
import { DarkToggler } from "@/components/ui/dark-toggler";
import { UserMenu } from "@/components/ui/user-menu";
import { Search } from "@/components/ui/search";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Notifications } from "@/components/ui/notifications";
import { useTranslation } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Notification } from "@/components/ui/notifications";

export const Topbar = ({ showBackButton = false }: { showBackButton?: boolean }) => {
   const { language, setLanguage, t } = useTranslation();
   const [notifications, setNotifications] = useState<Notification[]>([]);

   const handleLanguageChange = (lang: string) => {
      setLanguage(lang as "en" | "de");
   };

   useEffect(() => {
      async function fetchNotifications() {
         try {
            // Add pagination parameters
            const res = await fetch("/api/notifications?page=1&limit=20");
            if (res.ok) {
               const data = await res.json();
               setNotifications(data);
            } else {
               console.error("Failed to fetch notifications");
            }
         } catch (error) {
            console.error("Error fetching notifications:", error);
         }
      }
      fetchNotifications();
   }, []);

   const handleNotificationClick = async (id: string) => {
      try {
         // Update UI state optimistically
         setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
         );

         // Make API call to update in database
         const response = await fetch(`/api/notifications/${id}/read`, {
            method: "PATCH",
            headers: {
               "Content-Type": "application/json",
            },
         });

         if (!response.ok) {
            const errorData = await response.json();
            console.error("Failed to mark notification as read:", errorData);
            // Revert UI state on error
            setNotifications(notifications);
         }
      } catch (error) {
         console.error("Error handling notification click:", error);
         // Revert UI state on error
         setNotifications(notifications);
      }
   };

   return (
      <header className="relative sticky top-0 z-30 h-16 border-b/10 bg-white/30 dark:bg-[#23263a]/30 backdrop-blur-xl overflow-hidden">
         {/* Back button (left side) */}
         {showBackButton && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20">
               <Link href="/forms">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                     <ArrowLeft className="w-4 h-4" />
                     Back to Forms
                  </Button>
               </Link>
            </div>
         )}

         {/* Centered search bar (desktop only) */}
         <div className="hidden md:flex absolute left-0 right-0 top-1/2 -translate-y-1/2 justify-center pointer-events-none min-w-0 z-10">
            <div className="pointer-events-auto w-full max-w-xs md:max-w-sm lg:max-w-md mx-auto">
               <Search placeholder={t("common.search")} />
            </div>
         </div>
         {/* Right controls always at screen edge (desktop) */}
         <div className="hidden md:flex absolute right-0 top-0 h-full items-center gap-2 px-4 z-20">
            <div className="hover:bg-secondary/5 rounded-md transition-colors">
               <LanguageSelector
                  currentLanguage={language}
                  onLanguageChange={handleLanguageChange}
                  onlyFlag={window.innerWidth < 1280}
                  className="bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent [&_[data-slot=select-trigger]]:bg-transparent [&_[data-slot=select-trigger]]:border-none [&_[data-slot=select-trigger]]:shadow-none [&_[data-slot=select-trigger]]:hover:bg-transparent [&_[data-slot=select-trigger]]:focus:bg-transparent [&_svg.size-4]:text-blue-900 dark:[&_svg.size-4]:text-white"
               />
            </div>
            <div className="p-2 hover:bg-secondary/5 rounded-md transition-colors">
               <Notifications
                  notifications={notifications}
                  onNotificationClick={handleNotificationClick}
               />
            </div>
            <div className="p-2 hover:bg-secondary/5 rounded-md transition-colors">
               <DarkToggler />
            </div>
            <div className="hover:bg-secondary/5 rounded-md transition-colors">
               <UserMenu />
            </div>
         </div>
         {/* Mobile: essential controls only - prioritize user menu */}
         <div className="flex items-center gap-1 md:hidden justify-between px-4 h-full pl-16 overflow-hidden">
            {/* Left side: empty space for hamburger button */}
            <div className="flex-1 min-w-0" />
            
            {/* Right side: controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
               <span className="p-1">
                  <LanguageSelector
                     currentLanguage={language}
                     onLanguageChange={handleLanguageChange}
                     onlyFlag
                     className="bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent [&_[data-slot=select-trigger]]:bg-transparent [&_[data-slot=select-trigger]]:border-none [&_[data-slot=select-trigger]]:shadow-none [&_[data-slot=select-trigger]]:hover:bg-transparent [&_[data-slot=select-trigger]]:focus:bg-transparent [&_svg.size-4]:text-blue-900 dark:[&_svg.size-4]:text-white"
                  />
               </span>
               <span className="p-1">
                  <Notifications
                     notifications={notifications}
                     onNotificationClick={handleNotificationClick}
                  />
               </span>
               <span className="p-1">
                  <DarkToggler />
               </span>
               <span className="p-1 flex-shrink-0">
                  <UserMenu />
               </span>
            </div>
         </div>
      </header>
   );
};
