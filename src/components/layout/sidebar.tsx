"use client";

import {
   Home,
   BarChart2,
   Settings,
   ChevronLeft,
   ChevronRight,
   Map,
   Menu,
   Calendar,
   X as XIcon,
   FormInput,
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
      { label: t('navigation.routeForms'), icon: <Map />, href: '/route-forms' },
      { label: t('navigation.submissions'), icon: <Calendar />, href: '/submissions' },
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

         {/* Mobile: overlay to close sidebar, covers only area outside sidebar */}
         {isMobile && isMobileOpen && (
            <div
               className="fixed inset-0 left-64 bg-black/20 z-50 backdrop-blur-sm transition-opacity"
               onClick={() => setIsMobileOpen(false)}
            />
         )}

         {/* Sidebar panel */}
         <aside
            className={cn(
               "fixed left-0 top-0 h-screen border-r border-blue-400/10 bg-white/70 dark:bg-[#23263a]/80 backdrop-blur-xl shadow-2xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.65)] transition-all duration-300",
               effectiveCollapsed ? "w-20" : "w-80",
               isMobile
                  ? isMobileOpen
                     ? "block z-60 w-64" // Show as drawer on mobile, above overlay
                     : "hidden"
                  : "z-40"
            )}
         >
            {/* Header section with logo and collapse toggle */}
            <div className={cn(
               "relative border-b border-blue-400/10 px-4 flex items-center transition-all duration-200",
               "h-16",
               effectiveCollapsed ? "justify-between" : "justify-between"
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
                     "text-xl font-bold bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent transition-all duration-200",
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
                     className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-colors"
                     onClick={() => setIsMobileOpen(false)}
                     aria-label="Close sidebar"
                  >
                     <XIcon className="h-5 w-5 text-blue-900 dark:text-white" />
                  </button>
               )}
            </div>

            {/* Nav items */}
            <nav className="space-y-2 p-4">
               {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                     <Link
                        href={item.href}
                        key={item.label}
                        className={cn(
                           "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                           "hover:bg-blue-100/50 dark:hover:bg-blue-900/30",
                           "active:scale-[0.98]",
                           isActive ? "bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-blue-900 dark:text-white" : "text-blue-900/70 dark:text-white/70",
                           effectiveCollapsed ? "justify-center" : "gap-3"
                        )}
                     >
                        <span className={cn(
                           "h-5 w-5 shrink-0 transition-colors",
                           isActive ? "text-blue-900 dark:text-white" : "text-blue-900/70 dark:text-white/70"
                        )}>
                           {item.icon}
                        </span>
                        {!effectiveCollapsed && (
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

            {/* Settings section at bottom */}
            <div className="absolute bottom-0 w-full p-4 border-t border-blue-400/10">
               <Link
                  href="/settings"
                  className={cn(
                     "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                     "hover:bg-blue-100/50 dark:hover:bg-blue-900/30",
                     "active:scale-[0.98]",
                     pathname === '/settings' ? "bg-gradient-to-r from-blue-500/10 to-violet-500/10 text-blue-900 dark:text-white" : "text-blue-900/70 dark:text-white/70",
                     effectiveCollapsed ? "justify-center" : "gap-3"
                  )}
               >
                  <Settings className={cn(
                     "h-5 w-5 shrink-0 transition-colors",
                     pathname === '/settings' ? "text-blue-900 dark:text-white" : "text-blue-900/70 dark:text-white/70"
                  )} />
                  {!effectiveCollapsed && (
                     <span className={cn(
                        "truncate transition-opacity duration-200",
                        pathname === '/settings' ? "font-semibold" : "font-medium"
                     )}>
                        {t('navigation.settings')}
                     </span>
                  )}
               </Link>
            </div>
         </aside>
      </>
   );
};
