'use client';

import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Settings, 
  LogOut, 
  Shield,
  HelpCircle,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from '@/i18n/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { t } = useTranslation();

  if (!session?.user) return null;

  // Get safe user data
  const safeUserName = sanitizeUserInput(session?.user?.name);
  const safeUserEmail = sanitizeUserInput(session?.user?.email);
  const safeUserImage = session?.user?.image && isValidAvatarUrl(session.user.image) 
    ? session.user.image 
    : null;

  const isGoogleUser = safeUserEmail?.includes('@gmail.com') || 
                      safeUserEmail?.includes('@google.com');

  const isDemoUserAccount = safeUserEmail === 'demo@dknex.com';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-8 w-8 rounded-full p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Avatar className="h-8 w-8">
            {safeUserImage ? (
              <AvatarImage 
                src={safeUserImage} 
                alt={safeUserName || "User"}
                referrerPolicy="no-referrer"
              />
            ) : null}
            <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              {safeUserName ? safeUserName[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 p-0 border-0 shadow-xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl" 
        align="end"
        sideOffset={8}
      >
        {/* User Info Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-blue-100 dark:border-blue-900">
              {safeUserImage ? (
                <AvatarImage 
                  src={safeUserImage} 
                  alt={safeUserName || "User"}
                  referrerPolicy="no-referrer"
                />
              ) : null}
              <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {safeUserName ? safeUserName[0].toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {safeUserName || t('common.unknownUser')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {safeUserEmail || t('common.noEmail')}
              </p>
              {isGoogleUser && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                    {t('common.googleAccount')}
                  </span>
                </div>
              )}
              {isDemoUserAccount && (
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                    {t('common.demoAccount')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <DropdownMenuLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
            {t('userMenu.account')}
          </DropdownMenuLabel>
          
          <Link href="/profile">
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('common.profile')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('userMenu.manageProfileAccount')}
                </p>
              </div>
            </DropdownMenuItem>
          </Link>

          <Link href="/settings">
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Settings className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('navigation.settings')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('userMenu.appPreferencesSettings')}
                </p>
              </div>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator className="my-2" />
          
          <DropdownMenuLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
            {t('userMenu.security')}
          </DropdownMenuLabel>

          <Link href="/profile">
            <DropdownMenuItem 
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors ${
                isDemoUserAccount 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              onClick={(e) => {
                if (isDemoUserAccount) {
                  e.preventDefault();
                }
              }}
            >
              <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('userMenu.twoFactorAuth')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isDemoUserAccount ? t('userMenu.disabledForDemoUsers') : t('userMenu.secureYourAccount')}
                </p>
              </div>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator className="my-2" />

          <DropdownMenuLabel className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1">
            {t('userMenu.support')}
          </DropdownMenuLabel>

          <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <HelpCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {t('common.help')} & {t('common.support')}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t('userMenu.getHelpContactSupport')}
              </p>
            </div>
            <ExternalLink className="h-3 w-3 text-gray-400" />
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2" />

          {/* Logout Button */}
          <DropdownMenuItem 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
            onClick={() => signOut()}
          >
            <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <LogOut className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {t('common.logout')}
              </p>
              <p className="text-xs text-red-500 dark:text-red-400">
                {t('userMenu.signOutAccount')}
              </p>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
