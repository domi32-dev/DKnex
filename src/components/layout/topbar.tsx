'use client';

import { DarkToggler } from '@/components/ui/dark-toggler';
import { UserMenu } from '@/components/ui/user-menu';

export const Topbar = () => {
  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background px-4 flex items-center justify-between">
      <div className="text-lg font-semibold"></div>
      <div className="flex items-center gap-2">
        <DarkToggler />
        <UserMenu />
      </div>
    </header>
  );
};