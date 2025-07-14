"use client";

import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Copy, Eye, EyeOff, Info, X } from 'lucide-react';
import { isDemoMode, getDemoCredentials, getDemoMessage } from '@/lib/demo-config';

export function DemoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isDemoMode() || dismissed) return null;

  const demoUsers = getDemoCredentials();
  const loginPrompt = getDemoMessage('loginPrompt');
  const demoWarning = getDemoMessage('demoWarning');

  const copyCredentials = (email: string, password: string) => {
    navigator.clipboard.writeText(`${email} / ${password}`);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 flex-shrink-0" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="font-medium">🚀 Portfolio Demo</span>
              <span className="text-sm opacity-90">{loginPrompt}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Demo credentials */}
            <div className="hidden sm:flex items-center gap-2">
              {demoUsers.slice(0, 1).map((user) => (
                <div key={user.email} className="flex items-center gap-2 bg-white/10 rounded px-3 py-1">
                  <span className="text-sm font-mono">
                    {user.email} / {showPassword ? user.password : '••••••••'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-white hover:bg-white/20"
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
              className="h-8 w-8 p-0 text-white hover:bg-white/20"
              onClick={() => setDismissed(true)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile credentials */}
        <div className="sm:hidden mt-2">
          <Alert className="bg-white/10 border-white/20 text-white">
            <AlertDescription className="text-sm">
              <div className="flex items-center justify-between">
                <span className="font-mono">{demoUsers[0].email} / {showPassword ? demoUsers[0].password : '••••••••'}</span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-white"
                    onClick={() => copyCredentials(demoUsers[0].email, demoUsers[0].password)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}

export function DemoWarning() {
  if (!isDemoMode()) return null;

  return (
    <Alert className="mb-4 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800 dark:text-amber-200">
        {getDemoMessage('demoWarning')}
      </AlertDescription>
    </Alert>
  );
} 