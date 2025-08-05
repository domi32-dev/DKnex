"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Bell, 
  Eye, 
  Globe, 
  Palette, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Info
} from "lucide-react";
import { useTranslation } from "@/i18n/translations";
import { isDemoUser } from '@/lib/demo-config';

export function SettingsContent() {
  const { data: session } = useSession();
  const { language, setLanguage, t } = useTranslation();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      forms: true,
      analytics: false,
    },
    privacy: {
      profileVisibility: 'public',
      dataSharing: false,
      analytics: true,
    },
    appearance: {
      theme: 'system',
      compactMode: false,
      animations: true,
    },
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      fontSize: 'medium',
    },
  });

  const isDemoUserAccount = isDemoUser(session?.user?.email);

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as "en" | "de");
  };

  const handleThemeChange = (theme: string) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        theme: theme
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center md:text-left">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
          {t('settings.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Demo User Warning */}
      {isDemoUserAccount && (
        <div className="bg-amber-50/60 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-md rounded-2xl p-4 relative overflow-hidden group">
          {/* Animated gradient background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 pointer-events-none opacity-100"
            style={{ animation: 'pulse 8s ease-in-out infinite' }}
          />
          <div className="flex items-start gap-3 relative z-10">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {t('settings.demoAccountLimited')}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                {t('settings.someSettingsLimited')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notifications Settings */}
        <Card className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md relative overflow-hidden group">
          {/* Animated gradient background for glassy effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 transition-opacity pointer-events-none group-hover:from-blue-500/20 group-hover:to-cyan-500/20"
            style={{ animation: 'pulse 8s ease-in-out infinite' }}
          />
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg">
                <Bell className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">{t('settings.notifications')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t('settings.emailNotifications')}</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.receiveEmailNotifications')}
                </p>
              </div>
              <Switch
                checked={settings.notifications.email}
                onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                disabled={isDemoUserAccount}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t('settings.pushNotifications')}</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.receivePushNotifications')}
                </p>
              </div>
              <Switch
                checked={settings.notifications.push}
                onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
                disabled={isDemoUserAccount}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t('settings.formSubmissions')}</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.notifyWhenFormsSubmitted')}
                </p>
              </div>
              <Switch
                checked={settings.notifications.forms}
                onCheckedChange={(checked) => handleSettingChange('notifications', 'forms', checked)}
                disabled={isDemoUserAccount}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t('settings.analyticsReports')}</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.weeklyAnalyticsSummaries')}
                </p>
              </div>
              <Switch
                checked={settings.notifications.analytics}
                onCheckedChange={(checked) => handleSettingChange('notifications', 'analytics', checked)}
                disabled={isDemoUserAccount}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md relative overflow-hidden group">
          {/* Animated gradient background for glassy effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 transition-opacity pointer-events-none group-hover:from-green-500/20 group-hover:to-emerald-500/20"
            style={{ animation: 'pulse 8s ease-in-out infinite' }}
          />
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">{t('settings.privacySecurity')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('settings.profileVisibility')}</Label>
              <Select
                value={settings.privacy.profileVisibility}
                onValueChange={(value) => handleSettingChange('privacy', 'profileVisibility', value)}
                disabled={isDemoUserAccount}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">{t('settings.public')}</SelectItem>
                  <SelectItem value="private">{t('settings.private')}</SelectItem>
                  <SelectItem value="friends">{t('settings.friendsOnly')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t('settings.dataSharing')}</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.allowDataForImprovements')}
                </p>
              </div>
              <Switch
                checked={settings.privacy.dataSharing}
                onCheckedChange={(checked) => handleSettingChange('privacy', 'dataSharing', checked)}
                disabled={isDemoUserAccount}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t('settings.analytics')}</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.helpImproveApp')}
                </p>
              </div>
              <Switch
                checked={settings.privacy.analytics}
                onCheckedChange={(checked) => handleSettingChange('privacy', 'analytics', checked)}
                disabled={isDemoUserAccount}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md relative overflow-hidden group">
          {/* Animated gradient background for glassy effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 transition-opacity pointer-events-none group-hover:from-purple-500/20 group-hover:to-pink-500/20"
            style={{ animation: 'pulse 8s ease-in-out infinite' }}
          />
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg">
                <Palette className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">{t('settings.appearance')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('settings.theme')}</Label>
              <Select
                value={settings.appearance.theme}
                onValueChange={handleThemeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">{t('settings.light')}</SelectItem>
                  <SelectItem value="dark">{t('settings.dark')}</SelectItem>
                  <SelectItem value="system">{t('settings.system')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t('settings.compactMode')}</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.reduceSpacingForMoreContent')}
                </p>
              </div>
              <Switch
                checked={settings.appearance.compactMode}
                onCheckedChange={(checked) => handleSettingChange('appearance', 'compactMode', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t('settings.animations')}</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.enableSmoothTransitions')}
                </p>
              </div>
              <Switch
                checked={settings.appearance.animations}
                onCheckedChange={(checked) => handleSettingChange('appearance', 'animations', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Accessibility Settings */}
        <Card className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md relative overflow-hidden group">
          {/* Animated gradient background for glassy effect */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-amber-500/10 transition-opacity pointer-events-none group-hover:from-orange-500/20 group-hover:to-amber-500/20"
            style={{ animation: 'pulse 8s ease-in-out infinite' }}
          />
          <CardHeader className="pb-4 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg shadow-lg">
                <Eye className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent">{t('settings.accessibility')}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('settings.fontSize')}</Label>
              <Select
                value={settings.accessibility.fontSize}
                onValueChange={(value) => handleSettingChange('accessibility', 'fontSize', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">{t('settings.small')}</SelectItem>
                  <SelectItem value="medium">{t('settings.medium')}</SelectItem>
                  <SelectItem value="large">{t('settings.large')}</SelectItem>
                  <SelectItem value="xlarge">{t('settings.extraLarge')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t('settings.highContrast')}</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.increaseColorContrast')}
                </p>
              </div>
              <Switch
                checked={settings.accessibility.highContrast}
                onCheckedChange={(checked) => handleSettingChange('accessibility', 'highContrast', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-sm font-medium">{t('settings.reducedMotion')}</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('settings.minimizeAnimations')}
                </p>
              </div>
              <Switch
                checked={settings.accessibility.reducedMotion}
                onCheckedChange={(checked) => handleSettingChange('accessibility', 'reducedMotion', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Settings */}
      <Card className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md relative overflow-hidden group">
        {/* Animated gradient background for glassy effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 transition-opacity pointer-events-none group-hover:from-indigo-500/20 group-hover:to-violet-500/20"
          style={{ animation: 'pulse 8s ease-in-out infinite' }}
        />
        <CardHeader className="pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-lg shadow-lg">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-xl font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">{t('settings.languageRegion')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">{t('settings.language')}</Label>
              <Select
                value={language}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-full md:w-64">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t('settings.english')}</SelectItem>
                  <SelectItem value="de">{t('settings.deutsch')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button 
          className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white"
          onClick={() => {
            // Save settings logic here
            console.log('Settings saved:', settings);
          }}
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          {t('settings.saveSettings')}
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1 sm:flex-none bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
          onClick={() => {
            // Reset to defaults logic here
            console.log('Settings reset');
          }}
        >
          {t('settings.resetToDefaults')}
        </Button>
      </div>

      {/* Info Section */}
      <Card className="bg-blue-50/60 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md relative overflow-hidden group">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 pointer-events-none opacity-100"
          style={{ animation: 'pulse 8s ease-in-out infinite' }}
        />
        <CardContent className="pt-6 relative z-10">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {t('settings.aboutSettings')}
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {t('settings.aboutSettingsMessage')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 