'use client';

import { useState, useEffect } from 'react';
import { DarkToggler } from '@/components/ui/dark-toggler';
import { UserMenu } from '@/components/ui/user-menu';
import { Search } from '@/components/ui/search';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Notifications } from '@/components/ui/notifications';
import { useTranslation } from '@/i18n/translations';
import type { Notification } from '@/components/ui/notifications';

export const Topbar = () => {
  const { language, setLanguage, t } = useTranslation();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang as 'en' | 'de');
  };

  useEffect(() => {
    async function fetchNotifications() {
      try {
        // Add pagination parameters
        const res = await fetch('/api/notifications?page=1&limit=20');
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    }
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (id: string) => {
    try {
      // Update UI state optimistically
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
      
      // Make API call to update in database
      const response = await fetch(`/api/notifications/${id}/read`, { 
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to mark notification as read:', errorData);
        // Revert UI state on error
        setNotifications(notifications);
      }
    } catch (error) {
      console.error('Error handling notification click:', error);
      // Revert UI state on error
      setNotifications(notifications);
    }
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