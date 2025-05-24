'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  BarChart2,
  Calendar,
  Home,
  Map,
  Search as SearchIcon,
  User,
  X,
  FormInput,
} from 'lucide-react';
import { useTranslation } from '@/i18n/translations';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchProps {
  placeholder?: string;
  iconOnly?: boolean;
  iconClassName?: string;
}

export function Search({ placeholder, iconOnly, iconClassName }: SearchProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const searchRef = React.useRef<HTMLDivElement>(null);

  // Handle clicks outside of search component
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allPages = [
    {
      label: t('navigation.dashboard'),
      icon: <Home className="h-4 w-4" />,
      href: '/',
      description: 'Overview of your workspace',
    },
    {
      label: t('navigation.analytics'),
      icon: <BarChart2 className="h-4 w-4" />,
      href: '/analytics',
      description: 'View analytics and statistics',
    },
    {
      label: t('navigation.map'),
      icon: <Map className="h-4 w-4" />,
      href: '/map',
      description: 'Interactive map view',
    },
    {
      label: t('navigation.calendar'),
      icon: <Calendar className="h-4 w-4" />,
      href: '/calendar',
      description: 'Manage your schedule',
    },
    {
      label: t('navigation.maskBuilder'),
      icon: <FormInput className="h-4 w-4" />,
      href: '/mask-builder',
      description: 'Create and manage custom forms',
    },
    {
      label: t('common.profile'),
      icon: <User className="h-4 w-4" />,
      href: '/profile',
      description: 'Manage your profile settings',
    },
  ];

  const filteredPages = allPages.filter((page) =>
    page.label.toLowerCase().includes(query.toLowerCase()) ||
    page.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div ref={searchRef} className={cn("relative", iconOnly ? "w-auto" : "w-full max-w-xl")}>
      {iconOnly ? (
        <button
          className="p-2 rounded-full hover:bg-secondary/10 transition-colors"
          onClick={() => setIsOpen(true)}
          aria-label={placeholder || t('common.search')}
        >
          <SearchIcon className={cn("h-5 w-5", iconClassName || "text-muted-foreground")} />
        </button>
      ) : (
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            className="w-full pl-9 pr-9"
            placeholder={placeholder || t('common.search')}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>
      )}
      {isOpen && (
        <div className="absolute inset-x-0 top-full mt-2 rounded-lg border bg-popover shadow-lg">
          <div className="divide-y">
            {filteredPages.length > 0 ? (
              filteredPages.map((page) => (
                <button
                  key={page.href}
                  onClick={() => {
                    router.push(page.href);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2 text-sm text-popover-foreground hover:bg-secondary/5 focus:bg-secondary/5 active:bg-secondary/5 dark:hover:bg-secondary/100 dark:focus:bg-secondary/20 dark:active:bg-secondary/20 rounded-md transition-colors cursor-pointer"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border bg-background text-muted-foreground">
                    {page.icon}
                  </span>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{page.label}</span>
                    <span className="text-xs text-muted-foreground">{page.description}</span>
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                {t('common.no_results')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 