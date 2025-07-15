'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import {
  BarChart2,
  Calendar,
  Home,
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
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });

  // Calculate dropdown position
  React.useEffect(() => {
    if (isOpen && searchRef.current) {
      const rect = searchRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.left,
        width: rect.width
      });
    }
  }, [isOpen]);

  // Handle clicks outside of search component
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isClickInsideSearch = searchRef.current && searchRef.current.contains(target);
      const isClickInsideDropdown = dropdownRef.current && dropdownRef.current.contains(target);
      
      if (!isClickInsideSearch && !isClickInsideDropdown) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle window resize and scroll
  React.useEffect(() => {
    const handleResize = () => {
      if (isOpen && searchRef.current) {
        const rect = searchRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          left: rect.left,
          width: rect.width
        });
      }
    };

    if (isOpen) {
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [isOpen]);

  const allPages = [
    {
      label: t('navigation.home'),
      icon: <Home className="h-4 w-4" />,
      href: '/',
      description: 'FormFlow homepage and overview',
    },
    {
      label: t('navigation.forms'),
      icon: <FormInput className="h-4 w-4" />,
      href: '/forms',
      description: 'Create and manage your forms',
    },
    {
      label: t('navigation.templates'),
      icon: <BarChart2 className="h-4 w-4" />,
      href: '/templates',
      description: 'Browse pre-built form templates',
    },
    {
      label: t('navigation.submissions'),
      icon: <Calendar className="h-4 w-4" />,
      href: '/submissions',
      description: 'View form submissions and responses',
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

  const dropdown = isOpen && (
    <div 
      ref={dropdownRef}
      className="fixed rounded-lg border bg-popover shadow-lg z-50 max-h-96 overflow-y-auto"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: Math.max(dropdownPosition.width, 300)
      }}
    >
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
  );

  return (
    <>
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
      </div>
      
      {/* Render dropdown using portal to avoid affecting parent height */}
      {typeof window !== 'undefined' && dropdown && createPortal(dropdown, document.body)}
    </>
  );
} 