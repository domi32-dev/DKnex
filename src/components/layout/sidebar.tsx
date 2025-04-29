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
   Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
   { label: "Dashboard", icon: <Home />, href: "/" },
   { label: "Analytics", icon: <BarChart2 />, href: "/analytics" },
   { label: "Map", icon: <Map />, href: "/map" },
   { label: "Calendar", icon: <Calendar />, href: "/calendar" },
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
   const pathname = usePathname();

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
               "fixed left-0 top-0 z-40 h-screen border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300",
               collapsed ? "w-16" : "w-80",
               isMobile ? "hidden md:block" : ""
            )}
         >
            {/* Header section with logo and collapse toggle */}
            <div className="flex items-center justify-between px-4 h-16 border-b">
               <span className={cn(
                  "text-lg font-bold text-primary transition-opacity duration-200",
                  collapsed ? "opacity-0" : "opacity-100"
               )}>
                  DoKi
               </span>

               <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCollapsed(!collapsed)}
                  className="hover:bg-muted/50"
               >
                  {collapsed ? <ChevronRight /> : <ChevronLeft />}
               </Button>
            </div>

            {/* Nav items */}
            <nav className="flex flex-col gap-1 p-4">
               {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                     <Link
                        href={item.href}
                        key={item.label}
                        className={cn(
                           "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                           "hover:bg-muted/50 hover:text-primary",
                           "active:scale-[0.98]",
                           isActive && "bg-primary/10 text-primary",
                           collapsed ? "justify-center" : "gap-3"
                        )}
                     >
                        <span className={cn(
                           "h-5 w-5 shrink-0",
                           isActive ? "text-primary" : "text-muted-foreground"
                        )}>
                           {item.icon}
                        </span>
                        {!collapsed && (
                           <span className="truncate">{item.label}</span>
                        )}
                     </Link>
                  );
               })}
            </nav>
         </aside>
      </>
   );
};
