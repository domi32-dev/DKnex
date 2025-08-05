"use client";

import { useState, useEffect } from "react";
import { DarkToggler } from "@/components/ui/dark-toggler";
import { UserMenu } from "@/components/ui/user-menu";
import { CommandPalette } from "@/components/ui/command-palette";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Notifications } from "@/components/ui/notifications";
import { useTranslation } from "@/i18n/translations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Command } from "lucide-react";
import Link from "next/link";
import type { Notification } from "@/components/ui/notifications";

export const Topbar = ({ showBackButton = false }: { showBackButton?: boolean }) => {
   const { language, setLanguage } = useTranslation();
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

   const handleLanguageChange = (lang: string) => {
      setLanguage(lang as "en" | "de");
   };

   // Setup keyboard shortcuts for command palette
   useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         // Use Alt+K instead of Ctrl+K to avoid browser conflicts
         if (e.altKey && e.key === 'k') {
            e.preventDefault();
            setCommandPaletteOpen(true);
         }
         // Escape to close
         if (e.key === 'Escape' && commandPaletteOpen) {
            setCommandPaletteOpen(false);
         }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
   }, [commandPaletteOpen]);

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

   const handleNotificationClick = async (notificationId: string) => {
      try {
         const res = await fetch(`/api/notifications/${notificationId}/read`, {
            method: "PATCH",
         });

         if (res.ok) {
            setNotifications((prev) =>
               prev.map((notification) =>
                  notification.id === notificationId
                     ? { ...notification, read: true, readAt: new Date().toISOString() }
                     : notification
               )
            );
         }
      } catch (error) {
         console.error("Error marking notification as read:", error);
      }
   };

   return (
      <>
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

            {/* Centered command palette trigger (desktop only) */}
            <div className="hidden md:flex absolute left-0 right-0 top-1/2 -translate-y-1/2 justify-center pointer-events-none min-w-0 z-10">
               <div className="pointer-events-auto">
                  <Button
                     variant="outline"
                     onClick={() => setCommandPaletteOpen(true)}
                     className="flex items-center gap-3 bg-white/50 dark:bg-slate-800/50 border border-slate-250/60 dark:border-slate-700/50 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all min-w-[300px] justify-start px-4"
                  >
                     <Search className="w-4 h-4 text-muted-foreground" />
                     <span className="text-muted-foreground flex-1 text-left">
                        Schnelle Befehle...
                     </span>
                     <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs bg-blue-100/50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                           <Command className="w-3 h-3 mr-1" />
                           Alt+K
                        </Badge>
                     </div>
                  </Button>
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
               {/* Left side: command palette trigger */}
               <div className="flex-1 min-w-0">
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={() => setCommandPaletteOpen(true)}
                     className="flex items-center gap-2"
                  >
                     <Search className="w-4 h-4" />
                     <span className="text-sm">Befehle</span>
                  </Button>
               </div>
               
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

         {/* Command Palette Component */}
         <CommandPalette 
            isOpen={commandPaletteOpen} 
            onClose={() => setCommandPaletteOpen(false)} 
         />
      </>
   );
};
