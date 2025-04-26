"use client";

import {
   Home,
   BarChart2,
   Users,
   Settings,
   ChevronLeft,
   ChevronRight,
   Map,
   Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navItems = [
   { label: "Dashboard", icon: <Home />, href: "/" },
   { label: "Analytics", icon: <BarChart2 />, href: "/analytics" },
   { label: "Map", icon: <Map />, href: "/map" },
   { label: "Kalendar", icon: <Map />, href: "/calendar" },
   { label: "Users", icon: <Users />, href: "/users" },
   { label: "Settings", icon: <Settings />, href: "/settings" },
];

export const Sidebar = ({
   collapsed,
   setCollapsed,
   isMobile,
   setIsMobileOpen,
}: {
   collapsed: boolean;
   setCollapsed: (val: boolean) => void;
   isMobile: boolean;
   setIsMobileOpen: (val: boolean) => void;
}) => {
   return (
      <>
         {/* Mobile: trigger button to open sidebar */}
         {isMobile && (
            <Button
               className="fixed top-4 left-4 z-50 md:hidden"
               variant="ghost"
               size="icon"
               onClick={() => setIsMobileOpen(true)}
            >
               <Menu />
            </Button>
         )}

         {/* Sidebar panel */}
         <aside
            className={cn(
               "fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300",
               collapsed ? "w-16" : "w-80",
               isMobile ? "hidden md:block" : ""
            )}
         >
            {/* Header section with logo and collapse toggle */}
            <div className="flex items-center justify-between px-4 h-16 border-b">
               <span className={`text-lg font-bold ${collapsed && "hidden"}`}>
                  DoKi
               </span>

               <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCollapsed(!collapsed)}
               >
                  {collapsed ? <ChevronRight /> : <ChevronLeft />}
               </Button>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-2 p-4">
               {navItems.map((item) => (
                  <Link
                     href={item.href}
                     key={item.label}
                     className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition hover:bg-muted",
                        collapsed ? "justify-center" : "gap-3"
                     )}
                  >
                     <span className="h-5 w-5 shrink-0 text-muted-foreground">
                        {item.icon}
                     </span>
                     {!collapsed && (
                        <span className="truncate">{item.label}</span>
                     )}
                  </Link>
               ))}
            </nav>
         </aside>
      </>
   );
};
