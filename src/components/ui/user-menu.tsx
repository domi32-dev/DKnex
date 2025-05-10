'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Projector, Settings } from "lucide-react";
import Link from "next/link";
import Drawer from '@/components/ui/drawer';
import { useTranslation } from '@/i18n/translations';

// Sanitize user input for display
const sanitizeUserInput = (input: string | null | undefined): string => {
  return input?.replace(/[<>]/g, '') || '';
};

// Validate avatar URL
const isValidAvatarUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    // Special handling for Google Photos URLs
    if (url.includes('googleusercontent.com')) {
      return true;
    }
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function UserMenu() {
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  if (!session?.user) return null;

  // Get safe user data
  const safeUserName = sanitizeUserInput(session?.user?.name);
  const safeUserEmail = sanitizeUserInput(session?.user?.email);
  const safeUserImage = session?.user?.image && isValidAvatarUrl(session.user.image) 
    ? session.user.image 
    : null;

  return (
    <>
      {/* Avatar to trigger the drawer */}
      <Avatar className="cursor-pointer" onClick={toggleDrawer}>
        {safeUserImage ? (
          <AvatarImage 
            src={safeUserImage} 
            alt={safeUserName || "User"}
            referrerPolicy="no-referrer"
          />
        ) : null}
        <AvatarFallback>{safeUserName ? safeUserName[0].toUpperCase() : "U"}</AvatarFallback>
      </Avatar>

      {/* Drawer Component */}
      <Drawer open={drawerOpen} onClose={toggleDrawer} childrenFooter={
        <div className="p-4">
          <Button 
            onClick={() => signOut()} 
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 bg-white dark:bg-gray-900 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors duration-200 shadow-sm"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            {t('common.logout')}
          </Button>
        </div>
      }>
        {/* Drawer Body Content */}
        <div className="flex flex-col h-full">
          {/* User Info */}
          <div className="flex flex-col items-center p-6 border-b border-gray-200 dark:border-gray-700">
            {/* Profile image with gradient ring and shadow */}
            <div className="relative mb-4">
              <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 via-violet-400 to-pink-400 p-1 shadow-lg" aria-hidden="true"></span>
              <Avatar className="w-20 h-20 border-4 border-white dark:border-gray-900 relative z-10 shadow-md">
                {safeUserImage ? (
                  <AvatarImage 
                    src={safeUserImage} 
                    alt={safeUserName || "User"}
                    className="rounded-full w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <AvatarFallback className="text-lg">{safeUserName ? safeUserName[0].toUpperCase() : "U"}</AvatarFallback>
              </Avatar>
            </div>
            <h3 className="text-xl font-semibold mb-1">{safeUserName || t('common.unknownUser')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{safeUserEmail || t('common.noEmail')}</p>
          </div>

          {/* Links with icons */}
          <div className="flex-1 p-4 space-y-1">
            <Link href="/profile" className="block">
              <Button variant="ghost" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>{t('common.profile')}</span>
              </Button>
            </Link>
            <Link href="/projects" className="block">
              <Button variant="ghost" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <Projector className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>{t('navigation.projects')}</span>
              </Button>
            </Link>
            <Link href="/settings" className="block">
              <Button variant="ghost" className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700/50">
                <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <span>{t('navigation.settings')}</span>
              </Button>
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  );
}
