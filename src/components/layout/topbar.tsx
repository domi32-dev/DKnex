'use client';

import { useState } from 'react';
import { DarkToggler } from '@/components/ui/dark-toggler';
import { UserMenu } from '@/components/ui/user-menu';
import { Search } from '@/components/ui/search';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Notifications } from '@/components/ui/notifications';
import { useTranslation } from '@/i18n/translations';

// Mock notifications - replace with real data in production
const mockNotifications = [
  {
    id: '1',
    title: 'New Project Added',
    description: 'A new project "Project X" has been added to your workspace.',
    time: '5m ago',
    read: false,
  },
  {
    id: '2',
    title: 'Meeting Reminder',
    description: 'Team meeting starts in 30 minutes.',
    time: '30m ago',
    read: true,
  },
];

export const Topbar = () => {
  const { language, setLanguage, t } = useTranslation();
  const [notifications, setNotifications] = useState(mockNotifications);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as 'en' | 'de');
  };

  const handleNotificationClick = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b bg-background">
      <div className="h-full w-full px-4 grid grid-cols-3">
        {/* Left section - empty */}
        <div />
        
        {/* Center section - search */}
        <div className="flex items-center justify-center">
          <Search placeholder={t('common.search')} />
        </div>
        
        {/* Right section - controls */}
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className="hover:bg-secondary/5 rounded-md transition-colors">
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
            </div>
            <div className="p-2 hover:bg-secondary/5 rounded-md transition-colors">
              <Notifications
                notifications={notifications}
                onNotificationClick={handleNotificationClick}
              />
            </div>
            <div className="p-2 hover:bg-secondary/5 rounded-md transition-colors">
              <DarkToggler />
            </div>
            <div className="hover:bg-secondary/5 rounded-md transition-colors">
              <UserMenu />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};