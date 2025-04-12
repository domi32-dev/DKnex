'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';  // Assuming this is your default avatar component
import { Button } from '@/components/ui/button';  // Assuming your button component is imported here
import { User, Projector, Settings } from "lucide-react";  // Example icons from Lucide
import Link from "next/link";

import Drawer from '@/components/ui/drawer';

export function UserMenu() {
  const { data: session } = useSession();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const user = {
    name: session?.user?.name || "Unknown User",
    email: session?.user?.email || "No Email",
    avatar: session?.user?.image || "/avatar.png",
  };

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  if (!session?.user) return null;

  return (
    <>
      {/* Avatar to trigger the drawer */}
      <Avatar className="cursor-pointer" onClick={toggleDrawer}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>

      {/* Drawer Component */}
      <Drawer open={drawerOpen} onClose={toggleDrawer} childrenFooter={<Button onClick={() => signOut()} variant="link" className="w-full text-left text-red-600 cursor-pointer">Logout</Button>}>
        {/* Drawer Body Content */}
        <div className="flex flex-col items-center p-0 w-72 bg-white dark:bg-gray-800 text-black dark:text-white">
          {/* User Info */}
          <div className="flex flex-col items-center mb-6">
            {/* Increased size of the profile image */}
            <Avatar className="mb-4 w-18 h-18">
              <AvatarImage src={user.avatar} alt={user.name} className="rounded-full w-full h-full object-cover" />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <span className="flex items-center px-3 py-2 text-xl font-medium rounded-md transition hover:bg-muted">{user.name}</span> {/* Smaller text */}
            <span className="text-sm text-muted-foreground">{user.email}</span> {/* Smaller text */}
          </div>

          {/* Links with icons */}
          <div className="space-y-6 w-full text-left">
            <Link href="/profile">
              <Button variant="link" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition hover:bg-muted cursor-pointer">
                <User className="h-8 w-8" /> {/* Larger icon */}
                Profile
              </Button>
            </Link>
            <Link href="/projects">
              <Button variant="link" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition hover:bg-muted cursor-pointer">
                <Projector className="h-8 w-8" /> {/* Larger icon */}
                Projects
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="link" className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition hover:bg-muted cursor-pointer">
                <Settings className="h-8 w-8" /> {/* Larger icon */}
                Settings
              </Button>
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  );
}
