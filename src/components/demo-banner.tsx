"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Copy, Eye, EyeOff, Info, X, Sparkles } from 'lucide-react';
import { isDemoMode, getDemoCredentials } from '@/lib/demo-config';
import { useTranslation } from '@/i18n/translations';

// Hook for localStorage with SSR safety
function useLocalStorage(key: string, initialValue: boolean) {
  const [storedValue, setStoredValue] = useState(initialValue);
  
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
  }, [key]);

  const setValue = (value: boolean) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

// Login page banner - full credentials display
export function DemoBanner() {
  const [dismissed, setDismissed] = useLocalStorage('demo-banner-dismissed', false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  if (!isDemoMode() || dismissed) return null;

  const demoUsers = getDemoCredentials();
  const loginPrompt = t('auth.demo.loginPrompt');

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`${email} / ${password}`);
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm border-b border-blue-500/20">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="w-4 h-4 flex-shrink-0" />
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">🚀 {t('auth.demo.title')}</span>
              <span className="text-xs opacity-90 hidden sm:inline">{loginPrompt}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Demo credentials - more compact */}
            <div className="hidden md:flex items-center gap-2">
              {demoUsers.slice(0, 1).map((user) => (
                <div key={user.email} className="flex items-center gap-1 bg-white/10 rounded px-2 py-1">
                  <span className="text-xs font-mono">
                    {user.email} / {showPassword ? user.password : '••••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-white hover:bg-white/20"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 text-white hover:bg-white/20"
                    onClick={() => copyCredentials(user.email, user.password)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-white hover:bg-white/20"
              onClick={() => setDismissed(true)}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Mobile credentials - simplified */}
        <div className="md:hidden mt-1">
          <div className="flex items-center justify-between bg-white/10 rounded px-2 py-1">
            <span className="text-xs font-mono">{demoUsers[0].email} / {showPassword ? demoUsers[0].password : '••••••••'}</span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 text-white"
                onClick={() => copyCredentials(demoUsers[0].email, demoUsers[0].password)}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Small floating demo indicator for main pages
export function DemoIndicator() {
  const { t } = useTranslation();
  
  if (!isDemoMode()) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-2 rounded-full shadow-lg border border-blue-500/20 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">{t('auth.demo.title')}</span>
      </div>
    </div>
  );
}

export function DemoWarning() {
  const { t } = useTranslation();
  
  if (!isDemoMode()) return null;

  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        {t('auth.demo.warning')}
      </AlertDescription>
    </Alert>
  );
} 