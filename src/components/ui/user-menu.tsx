'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Projector, Settings } from "lucide-react";
import Link from "next/link";
import Drawer from '@/components/ui/drawer';

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
      <Drawer open={drawerOpen} onClose={toggleDrawer} childrenFooter={<Button onClick={() => signOut()} variant="link" className="w-full text-left text-red-600 cursor-pointer">Logout</Button>}>
        {/* Drawer Body Content */}
        <div className="flex flex-col items-center p-0 w-72 bg-white dark:bg-gray-800 text-black dark:text-white">
          {/* User Info */}
          <div className="flex flex-col items-center mb-6">
            {/* Increased size of the profile image */}
            <Avatar className="mb-4 w-18 h-18">
              {safeUserImage ? (
                <AvatarImage 
                  src={safeUserImage} 
                  alt={safeUserName || "User"}
                  className="rounded-full w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : null}
              <AvatarFallback>{safeUserName ? safeUserName[0].toUpperCase() : "U"}</AvatarFallback>
            </Avatar>
            <span className="flex items-center px-3 py-2 text-xl font-medium rounded-md transition hover:bg-muted">{safeUserName || "Unknown User"}</span>
            <span className="text-sm text-muted-foreground">{safeUserEmail || "No Email"}</span>
          </div>

          {/* Links with icons */}
          <div className="w-full">
            <Link href="/profile">
              <Button variant="link" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition hover:bg-muted cursor-pointer">
                <User className="h-8 w-8" />
                Profile
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="link" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition hover:bg-muted cursor-pointer">
                <Projector className="h-8 w-8" />
                Projects
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="link" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition hover:bg-muted cursor-pointer">
                <Settings className="h-8 w-8" />
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  );
}
