'use client';

import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/i18n/translations';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
  onNotificationClick: (id: string) => void;
}

export function Notifications({ notifications, onNotificationClick }: NotificationsProps) {
  const { t } = useTranslation();
  const unreadCount = notifications.filter(n => !n.read).length;

  const getUnreadText = () => {
    const key = unreadCount === 1 ? 'notifications.unread' : 'notifications.unread_plural';
    return t(key).replace('{count}', unreadCount.toString());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center cursor-pointer hover:bg-secondary/5 rounded-md transition-colors">
        <div className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{t('notifications.title')}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {unreadCount > 0 ? getUnreadText() : t('notifications.noNotifications')}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {t('notifications.noNotifications')}
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => onNotificationClick(notification.id)}
              className={`flex flex-col items-start gap-1 p-4 cursor-pointer rounded-md transition-colors hover:bg-secondary/5 focus:bg-secondary/5 active:bg-secondary/5 dark:hover:bg-secondary/100 dark:focus:bg-secondary/20 dark:active:bg-secondary/20 ${!notification.read ? 'bg-secondary/10' : ''}`}
            >
              <div className="flex w-full justify-between gap-2">
                <span className={`font-medium ${notification.read ? 'text-muted-foreground' : ''}`}>
                  {notification.title}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {notification.time}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {notification.description}
              </span>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 