"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { User, Lock, AlertCircle, Shield, Mail, Camera } from "lucide-react";
import { TwoFactorSetup } from './two-factor-setup';
import { isDemoUser, getDemoMessage } from '@/lib/demo-config';
import { useTranslation } from '@/i18n/translations';

// Sanitize user input for display
const sanitizeUserInput = (input: string | null | undefined): string => {
  return input?.replace(/[<>]/g, '') || '';
};

// Validate avatar URL
const isValidAvatarUrl = (url: string | null | undefined): boolean => {
  if (!url) return false;
  try {
    if (url.includes('googleusercontent.com')) {
      return true;
    }
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export function ProfileContent() {
  const { data: session } = useSession();
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    image: session?.user?.image || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isGoogleUser = session?.user?.email?.includes('@gmail.com') || 
                      session?.user?.email?.includes('@google.com');
  
  const isDemoUserAccount = isDemoUser(session?.user?.email);

  const safeUserName = sanitizeUserInput(session?.user?.name);
  const safeUserEmail = sanitizeUserInput(session?.user?.email);
  const safeUserImage = session?.user?.image && isValidAvatarUrl(session.user.image) 
    ? session.user.image 
    : null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemoUserAccount) return; // Prevent editing for demo users
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemoUserAccount) return; // Prevent editing for demo users
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isDemoUserAccount) {
      setError(t('profile.profileImageEditingDisabled'));
      return;
    }
    
    if (isGoogleUser) {
      setError(t('profile.profileImageManagedByGoogle'));
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError(t('profile.imageSizeTooLarge'));
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t('profile.fileMustBeImage'));
      return;
    }

    try {
      // Create FormData and append the file
      const formData = new FormData();
      formData.append('file', file);

      // Upload to Supabase
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const data = await uploadResponse.json();
        throw new Error(data.error || t('profile.failedToUploadImage'));
      }

      const { url } = await uploadResponse.json();
      
      // Update form data with the new image URL
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.failedToUploadImage'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoUserAccount) {
      setError(t('profile.profileEditingDisabled'));
      return;
    }
    
    setError("");
    setSuccess("");

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: isGoogleUser ? undefined : formData.email,
          image: isGoogleUser ? undefined : formData.image,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('profile.failedToUpdateProfile'));
      }

      const data = await response.json();
      setSuccess(data.message || t('profile.profileUpdated'));
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.failedToUpdateProfile'));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoUserAccount) {
      setError(t('profile.passwordChangesDisabled'));
      return;
    }
    
    setError("");
    setSuccess("");

    if (isGoogleUser) {
      setError(t('profile.passwordManagedByGoogle'));
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(t('profile.passwordsDoNotMatch'));
      return;
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('profile.failedToUpdatePassword'));
      }

      setSuccess(t('profile.passwordUpdated'));
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('profile.failedToUpdatePassword'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Demo User Warning */}
      {isDemoUserAccount && (
        <div className="bg-amber-50/60 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-md rounded-2xl p-4 relative overflow-hidden group">
          {/* Animated gradient background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 pointer-events-none opacity-100"
            style={{ animation: 'pulse 8s ease-in-out infinite' }}
          />
          <div className="flex items-start gap-3 relative z-10">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                {t('common.demoAccount')}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                {getDemoMessage('profileEditDisabled')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden group">
        {/* Animated gradient background for glassy effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none opacity-100 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-opacity"
          style={{ animation: 'pulse 8s ease-in-out infinite' }}
        />
        
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 relative z-10">
          {/* Avatar Section */}
          <div className="relative">
            <div className="relative">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 border-4 border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm shadow-lg">
                {safeUserImage ? (
                  <AvatarImage 
                    src={safeUserImage} 
                    alt={safeUserName || 'User'}
                    referrerPolicy="no-referrer"
                  />
                ) : null}
                <AvatarFallback className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {safeUserName ? safeUserName[0].toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              {isEditing && !isGoogleUser && !isDemoUserAccount && (
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20 shadow-lg"
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Camera className="h-4 w-4" />
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </Button>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
              {safeUserName || t('common.unknownUser')}
            </h1>
            <div className="flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm md:text-base">{safeUserEmail || t('common.noEmail')}</span>
              </div>
              {isGoogleUser && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-sm">{t('common.googleAccount')}</span>
                </div>
              )}
              {isDemoUserAccount && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                  <span className="text-sm">{t('common.demoAccount')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information - Takes 2 columns on large screens */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information Card */}
          <Card className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md relative overflow-hidden group">
            {/* Animated gradient background for glassy effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 transition-opacity pointer-events-none group-hover:from-blue-500/20 group-hover:to-purple-500/20"
              style={{ animation: 'pulse 8s ease-in-out infinite' }}
            />
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg shadow-lg">
                  <User className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">{t('profile.profileInformation')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('profile.fullName')}
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing || isDemoUserAccount}
                      placeholder={t('profile.enterFullName')}
                      className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-400/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('profile.emailAddress')}
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing || isGoogleUser || isDemoUserAccount}
                      placeholder={t('profile.enterEmail')}
                      className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-400/30"
                    />
                    {isGoogleUser && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        {t('profile.emailManagedByGoogle')}
                      </p>
                    )}
                    {isDemoUserAccount && (
                      <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                        {t('profile.emailEditingDisabled')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Error and Success Messages */}
                {error && (
                  <div className="p-3 bg-red-50/60 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 backdrop-blur-md rounded-xl">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-green-50/60 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 backdrop-blur-md rounded-xl">
                    <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  {isEditing ? (
                    <>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        className="flex-1 sm:flex-none bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
                      >
                        {t('common.cancel')}
                      </Button>
                      <Button 
                        type="submit" 
                        className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white"
                      >
                        {t('profile.saveChanges')}
                      </Button>
                    </>
                  ) : (
                    <Button 
                      type="button" 
                      onClick={() => setIsEditing(true)}
                      disabled={isDemoUserAccount}
                      className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white disabled:opacity-50"
                    >
                      {isDemoUserAccount ? t('common.editDisabled') : t('profile.editProfile')}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
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
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">{t('profile.twoFactorAuth')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {isDemoUserAccount ? (
                <div className="space-y-3">
                  <div className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    {t('profile.twoFactorDisabled')}
                  </div>
                  <div className="p-3 bg-amber-50/60 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-md rounded-xl">
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {t('profile.twoFactorDisabledMessage')}
                    </p>
                  </div>
                </div>
              ) : (
                <TwoFactorSetup />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Password Settings - Takes 1 column on large screens */}
        <div className="space-y-6">
          <Card className="bg-white/60 dark:bg-slate-800/60 border border-blue-200/50 dark:border-blue-800/50 backdrop-blur-md relative overflow-hidden group">
            {/* Animated gradient background for glassy effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 transition-opacity pointer-events-none group-hover:from-orange-500/20 group-hover:to-red-500/20"
              style={{ animation: 'pulse 8s ease-in-out infinite' }}
            />
            <CardHeader className="pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-lg">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">{t('profile.passwordSettings')}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              {isGoogleUser ? (
                <div className="space-y-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {t('profile.passwordManagedByGoogle')}
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground hover:bg-blue-100/30 dark:hover:bg-blue-900/20"
                    onClick={() => window.open('https://myaccount.google.com/security', '_blank')}
                  >
                    {t('profile.goToGoogleAccount')}
                  </Button>
                </div>
              ) : isDemoUserAccount ? (
                <div className="space-y-3">
                  <div className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    {t('profile.passwordChangesDisabled')}
                  </div>
                  <div className="p-3 bg-amber-50/60 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/50 backdrop-blur-md rounded-xl">
                    <p className="text-xs text-amber-700 dark:text-amber-300">
                      {t('profile.passwordDisabledMessage')}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('profile.currentPassword')}
                    </label>
                    <Input
                      name="currentPassword"
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder={t('profile.enterCurrentPassword')}
                      className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-400/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('profile.newPassword')}
                    </label>
                    <Input
                      name="newPassword"
                      type="password"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder={t('profile.enterNewPassword')}
                      className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-400/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      {t('profile.confirmNewPassword')}
                    </label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder={t('profile.confirmNewPassword')}
                      className="bg-white/20 dark:bg-slate-200/10 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-md text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-blue-400/30"
                    />
                  </div>
                  
                  {/* Error and Success Messages */}
                  {error && (
                    <div className="p-3 bg-red-50/60 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 backdrop-blur-md rounded-xl">
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  )}
                  {success && (
                    <div className="p-3 bg-green-50/60 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 backdrop-blur-md rounded-xl">
                      <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
                    </div>
                  )}
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white"
                  >
                    {t('profile.updatePassword')}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 