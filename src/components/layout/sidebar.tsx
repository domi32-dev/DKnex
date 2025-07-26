"use client";

import {
   Home,
   BarChart2,
   ChevronLeft,
   ChevronRight,
   Menu,
   Calendar,
   X as XIcon,
   FormInput,
   User,
   Settings,
   BarChart3,
   CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/i18n/translations";

export const Sidebar = ({
   collapsed,
   setCollapsed,
   isMobile,
   isMobileOpen,
   setIsMobileOpen,
}: {
   collapsed: boolean;
   setCollapsed: (val: boolean) => void;
   isMobile: boolean;
   isMobileOpen: boolean;
   setIsMobileOpen: (val: boolean) => void;
}) => {
   const pathname = usePathname();
   const { t } = useTranslation();

   const navItems = [
      { label: t('navigation.home'), icon: <Home />, href: '/' },
      { label: t('navigation.forms'), icon: <FormInput />, href: '/forms' },
      { label: t('navigation.templates'), icon: <BarChart2 />, href: '/templates' },
      { label: t('navigation.submissions'), icon: <Calendar />, href: '/submissions' },
   ];

   // Additional navigation sections
   const accountItems = [
      { label: t('common.profile'), icon: <User />, href: '/profile' },
      { label: t('navigation.settings'), icon: <Settings />, href: '/settings' },
   ];

   const toolsItems = [
      { label: 'Analytics', icon: <BarChart3 />, href: '/analytics' },
      { label: 'Calendar', icon: <CalendarDays />, href: '/calendar' },
   ];

   // On mobile, always show expanded sidebar
   const effectiveCollapsed = isMobile ? false : collapsed;

   return (
      <>
         {/* Mobile: trigger button to open sidebar */}
         {isMobile && (
            <Button
               className="fixed top-4 left-4 z-50 md:hidden bg-white/80 dark:bg-[#23263a]/80 backdrop-blur-xl shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.65)] hover:shadow-2xl transition-all duration-200"
               variant="ghost"
               size="icon"
               onClick={() => setIsMobileOpen(true)}
            >
               <Menu className="h-5 w-5 text-blue-900 dark:text-white" />
            </Button>
         )}

         {/* Mobile: overlay to close sidebar - full screen */}
         {isMobile && isMobileOpen && (
            <div
               className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm transition-opacity"
               onClick={() => setIsMobileOpen(false)}
            />
         )}

         {/* Sidebar panel */}
         <aside
            className={cn(
               "fixed left-0 top-0 h-screen border-r border-blue-400/10 bg-white/70 dark:bg-[#23263a]/80 backdrop-blur-xl shadow-2xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.65)] transition-all duration-300",
               effectiveCollapsed ? "w-20" : "w-64",
               isMobile
                  ? isMobileOpen
                     ? "block z-60 w-full bg-white/95 dark:bg-[#23263a]/95" // Better mobile background
                     : "hidden"
                  : "z-40"
            )}
         >
            {/* Header section with logo and collapse toggle */}
            <div className={cn(
               "relative border-b border-blue-400/10 px-4 flex items-center transition-all duration-200",
               "h-16",
               effectiveCollapsed ? "justify-between" : "justify-between",
               // Mobile specific styling
               isMobile && "px-6 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20"
            )}>
               <Link href="/" className={cn(
                  "flex items-center transition-all duration-200",
                  effectiveCollapsed ? "justify-center w-auto" : "gap-2"
               )}>
                  <span className={cn(
                     "relative flex items-center justify-center transition-all duration-200",
                     effectiveCollapsed ? "w-10 h-10" : "w-9 h-9"
                  )}>
                    <span className={cn(
                      "absolute inset-0 rounded-full border-2 border-blue-400 dark:border-violet-400 z-0 transition-all duration-200",
                      effectiveCollapsed ? "w-10 h-10" : "w-9 h-9"
                    )}></span>
                    <span className={cn(
                      "absolute inset-0 rounded-full bg-white/80 dark:bg-[#23263a]/80 z-10 transition-all duration-200",
                      effectiveCollapsed ? "w-10 h-10" : "w-9 h-9"
                    )}></span>
                    <Image 
                      src="/icon.png" 
                      alt="DkNex Logo" 
                      width={effectiveCollapsed ? 24 : 28}
                      height={effectiveCollapsed ? 24 : 28}
                      className={cn(
                        "rounded-full shadow relative z-20 transition-all duration-200",
                        effectiveCollapsed ? "w-6 h-6" : "w-7 h-7"
                      )} 
                    />
                  </span>
                  <span className={cn(
                     "text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent transition-all duration-200",
                     effectiveCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"
                  )}>
                     DkNex
                  </span>
               </Link>

               {/* Collapse button only on desktop */}
               {!isMobile && (
                  effectiveCollapsed ? (
                    <div className="z-10 transition-all duration-200 flex items-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="transition-colors min-w-[40px] bg-white/80 dark:bg-[#23263a]/80 border border-blue-400/20 shadow hover:bg-blue-100/70 dark:hover:bg-blue-900/40 absolute z-50 right-[-60px] top-1/2 -translate-y-1/2"
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                      >
                        <ChevronRight className="h-5 w-5 text-blue-900 dark:text-white" />
                      </Button>
                    </div>
                  ) : (
                    <div className="z-10 transition-all duration-200 flex items-center relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setCollapsed(!collapsed)}
                        className="hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors min-w-[40px]"
                      >
                        <ChevronLeft className="h-5 w-5 text-blue-900 dark:text-white" />
                      </Button>
                    </div>
                  )
               )}

               {/* Mobile close (X) button */}
               {isMobile && (
                  <button
                     className="p-2 rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors"
                     onClick={() => setIsMobileOpen(false)}
                     aria-label="Close sidebar"
                  >
                     <XIcon className="h-5 w-5 text-blue-900 dark:text-white" />
                  </button>
               )}
            </div>

            {/* Nav items */}
            <nav className={cn(
               "space-y-2 p-4",
               // Mobile specific styling
               isMobile && "p-6 space-y-3 flex-1 overflow-y-auto"
            )}>
               {/* Main Navigation */}
               {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                     <Link
                        href={item.href}
                        key={item.label}
                        className={cn(
                           "flex items-center text-sm font-medium rounded-xl transition-all duration-200",
                           "hover:bg-blue-100/50 dark:hover:bg-blue-900/30",
                           "active:scale-[0.98]",
                           // Fixed active state styling for both modes
                           isActive ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50" : "text-blue-900/70 dark:text-white/70",
                           // Better spacing for different modes
                           effectiveCollapsed && !isMobile ? "justify-center p-3" : "gap-3 px-4 py-3",
                           // Mobile specific styling
                           isMobile && "px-4 py-4 shadow-sm hover:shadow-md"
                        )}
                        onClick={() => isMobile && setIsMobileOpen(false)}
                     >
                        <span className={cn(
                           "h-5 w-5 shrink-0 transition-colors",
                           isActive ? "text-blue-900 dark:text-white" : "text-blue-900/70 dark:text-white/70"
                        )}>
                           {item.icon}
                        </span>
                        {(!effectiveCollapsed || isMobile) && (
                           <span className={cn(
                              "truncate transition-opacity duration-200",
                              isActive ? "font-semibold" : "font-medium"
                           )}>
                              {item.label}
                           </span>
                        )}
                     </Link>
                  );
               })}

               {/* Section Divider */}
               {(!effectiveCollapsed || isMobile) && (
                  <div className="border-t border-blue-400/10 my-4" />
               )}

               {/* Account Section */}
               {(!effectiveCollapsed || isMobile) && (
                  <div className="px-2">
                     <h4 className="text-xs font-semibold text-blue-900/50 dark:text-white/50 mb-2 uppercase tracking-wide">
                        Account
                     </h4>
                  </div>
               )}
               
               {accountItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                     <Link
                        href={item.href}
                        key={item.label}
                        className={cn(
                           "flex items-center text-sm font-medium rounded-xl transition-all duration-200",
                           "hover:bg-blue-100/50 dark:hover:bg-blue-900/30",
                           "active:scale-[0.98]",
                           isActive ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50" : "text-blue-900/70 dark:text-white/70",
                           effectiveCollapsed && !isMobile ? "justify-center p-3" : "gap-3 px-4 py-3",
                           isMobile && "px-4 py-4 shadow-sm hover:shadow-md"
                        )}
                        onClick={() => isMobile && setIsMobileOpen(false)}
                     >
                        <span className={cn(
                           "h-5 w-5 shrink-0 transition-colors",
                           isActive ? "text-blue-900 dark:text-white" : "text-blue-900/70 dark:text-white/70"
                        )}>
                           {item.icon}
                        </span>
                        {(!effectiveCollapsed || isMobile) && (
                           <span className={cn(
                              "truncate transition-opacity duration-200",
                              isActive ? "font-semibold" : "font-medium"
                           )}>
                              {item.label}
                           </span>
                        )}
                     </Link>
                  );
               })}

               {/* Section Divider */}
               {(!effectiveCollapsed || isMobile) && (
                  <div className="border-t border-blue-400/10 my-4" />
               )}

               {/* Tools Section */}
               {(!effectiveCollapsed || isMobile) && (
                  <div className="px-2">
                     <h4 className="text-xs font-semibold text-blue-900/50 dark:text-white/50 mb-2 uppercase tracking-wide">
                        Tools
                     </h4>
                  </div>
               )}
               
               {toolsItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                     <Link
                        href={item.href}
                        key={item.label}
                        className={cn(
                           "flex items-center text-sm font-medium rounded-xl transition-all duration-200",
                           "hover:bg-blue-100/50 dark:hover:bg-blue-900/30",
                           "active:scale-[0.98]",
                           isActive ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-900 dark:text-white border border-blue-200/50 dark:border-blue-700/50" : "text-blue-900/70 dark:text-white/70",
                           effectiveCollapsed && !isMobile ? "justify-center p-3" : "gap-3 px-4 py-3",
                           isMobile && "px-4 py-4 shadow-sm hover:shadow-md"
                        )}
                        onClick={() => isMobile && setIsMobileOpen(false)}
                     >
                        <span className={cn(
                           "h-5 w-5 shrink-0 transition-colors",
                           isActive ? "text-blue-900 dark:text-white" : "text-blue-900/70 dark:text-white/70"
                        )}>
                           {item.icon}
                        </span>
                        {(!effectiveCollapsed || isMobile) && (
                           <span className={cn(
                              "truncate transition-opacity duration-200",
                              isActive ? "font-semibold" : "font-medium"
                           )}>
                              {item.label}
                           </span>
                        )}
                     </Link>
                  );
               })}

            </nav>
         </aside>
      </>
   );
};
