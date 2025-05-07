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
import dayjs from 'dayjs';

export interface Notification {
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
      <DropdownMenuTrigger className="flex items-center justify-center cursor-pointer hover:bg-secondary/5 rounded-md transition-colors focus:outline-none focus:ring-0">
        <div className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[11px] font-medium text-primary-foreground">
              {unreadCount}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 rounded-xl shadow-lg bg-background border border-secondary">
        <DropdownMenuLabel className="font-normal px-4 pt-4 pb-2">
          <div className="flex flex-col space-y-1">
            <p className="text-base font-semibold leading-none">{t('notifications.title')}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {unreadCount > 0 ? getUnreadText() : t('notifications.noNotifications')}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">
            {t('notifications.noNotifications')}
          </div>
        ) : (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              onClick={() => onNotificationClick(notification.id)}
              className={`flex flex-col items-start gap-1 p-4 cursor-pointer rounded-lg transition-colors hover:bg-primary/10 focus:bg-primary/10 active:bg-primary/20 ${!notification.read ? 'bg-primary/5' : ''}`}
            >
              <div className="flex w-full justify-between gap-2">
                <span className={`font-medium ${notification.read ? 'text-muted-foreground' : 'text-primary'}`}>
                  {notification.title}
                </span>
                <span className="text-xs text-muted-foreground shrink-0">
                  {dayjs(notification.time).format('DD.MM.YYYY, HH:mm')}
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