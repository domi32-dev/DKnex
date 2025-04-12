'use client';

import { Home, BarChart2, Users, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'Dashboard', icon: <Home />, href: '/' },
  { label: 'Analytics', icon: <BarChart2 />, href: '/analytics' },
  { label: 'Users', icon: <Users />, href: '/users' },
  { label: 'Settings', icon: <Settings />, href: '/settings' },
];

export const Sidebar = ({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}) => {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-300',
        collapsed ? 'w-16' : 'w-80'
      )}
    >
      <div className="flex items-center justify-between px-4 h-16 border-b">
        <span className={`text-lg font-bold ${collapsed && 'hidden'}`}>DoKi</span>
        <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Link
            href={item.href}
            key={item.label}
            className={cn(
              'flex items-center px-3 py-2 text-sm font-medium rounded-md transition hover:bg-muted',
              collapsed ? 'justify-center' : 'gap-3'
            )}
          >
            <span className="h-5 w-5 shrink-0 text-muted-foreground">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
};