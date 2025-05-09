"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { User, Lock, Image as ImageIcon } from "lucide-react";
import { TwoFactorSetup } from './two-factor-setup';

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
  const { data: session, update } = useSession();
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

  const safeUserName = sanitizeUserInput(session?.user?.name);
  const safeUserEmail = sanitizeUserInput(session?.user?.email);
  const safeUserImage = session?.user?.image && isValidAvatarUrl(session.user.image) 
    ? session.user.image 
    : null;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isGoogleUser) {
      setError("Profile image is managed by Google");
      return;
    }

    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setError("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("File must be an image");
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
        throw new Error(data.error || 'Failed to upload image');
      }

      const { url } = await uploadResponse.json();
      
      // Update form data with the new image URL
      setFormData(prev => ({ ...prev, image: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        throw new Error(data.error || 'Failed to update profile');
      }

      const data = await response.json();
      setSuccess(data.message || "Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (isGoogleUser) {
      setError("Password cannot be changed for Google accounts");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
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
        throw new Error(data.error || 'Failed to update password');
      }

      setSuccess("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-10">
      {/* Profile Header */}
      <div className="relative w-full h-56 rounded-3xl overflow-hidden flex items-end bg-gradient-to-br from-blue-900/80 via-indigo-900/70 to-violet-900/80 shadow-2xl border border-blue-400/20 backdrop-blur-xl">
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="w-full h-full bg-gradient-to-br from-blue-400/20 via-violet-400/10 to-transparent blur-2xl" />
        </div>
        <div className="relative z-10 flex items-end gap-6 px-10 pb-8">
          <Avatar className="h-24 w-24 border-4 border-white/30 shadow-2xl bg-white/10 backdrop-blur-xl ring-2 ring-blue-400/30 hover:scale-105 transition-transform duration-200">
            {safeUserImage ? (
              <AvatarImage 
                src={safeUserImage} 
                alt={safeUserName || 'User'}
                referrerPolicy="no-referrer"
              />
            ) : null}
            <AvatarFallback className="text-3xl font-bold text-blue-900/80 dark:text-white/80 bg-white/30 dark:bg-blue-900/30">{safeUserName ? safeUserName[0].toUpperCase() : 'U'}</AvatarFallback>
          </Avatar>
          <div className="pb-2">
            <div className="text-3xl font-extrabold text-white drop-shadow-lg tracking-tight">{safeUserName || 'Unknown User'}</div>
            <div className="text-base text-blue-100/90 drop-shadow font-light">{safeUserEmail || 'No Email'}</div>
            {isGoogleUser && (
              <div className="text-xs text-blue-200/80 mt-1 font-medium">Google Account</div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <Card className="rounded-3xl border-0 bg-white/70 dark:bg-[#23263a]/80 backdrop-blur-xl border border-blue-400/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.65)] hover:shadow-2xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <User className="text-blue-500 w-6 h-6" />
            <CardTitle className="text-xl font-bold text-blue-900 dark:text-white">Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="bg-white/80 dark:bg-[#23263a]/80 border border-blue-200/30 dark:border-blue-900/30"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing || isGoogleUser}
                  className="bg-white/80 dark:bg-[#23263a]/80 border border-blue-200/30 dark:border-blue-900/30"
                />
                {isGoogleUser && (
                  <p className="text-xs text-blue-400 mt-1">Email is managed by Google</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Profile Image</label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14 border-2 border-blue-400/30 bg-white/30 dark:bg-blue-900/30">
                    {formData.image ? (
                      <AvatarImage 
                        src={formData.image} 
                        alt={formData.name || 'User'}
                        referrerPolicy="no-referrer"
                      />
                    ) : null}
                    <AvatarFallback className="text-xl font-bold text-blue-900/80 dark:text-white/80">{formData.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  {isEditing && !isGoogleUser && (
                    <Button
                      type="button"
                      variant="outline"
                      className="relative border-blue-400/30"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Change Image
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </Button>
                  )}
                  {isGoogleUser && (
                    <p className="text-xs text-blue-400">Profile image is managed by Google</p>
                  )}
                </div>
              </div>
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
              {success && <p className="text-green-500 text-sm font-medium">{success}</p>}
              <div className="flex justify-end gap-2">
                {isEditing ? (
                  <>
                    <Button type="button" variant="outline" className="border-blue-400/30" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200">Save Changes</Button>
                  </>
                ) : (
                  <Button type="button" className="bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200" onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <Card className="rounded-3xl border-0 bg-white/70 dark:bg-[#23263a]/80 backdrop-blur-xl border border-blue-400/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.65)] hover:shadow-2xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Lock className="text-blue-500 w-6 h-6" />
            <CardTitle className="text-xl font-bold text-blue-900 dark:text-white">Password Settings</CardTitle>
          </CardHeader>
          <CardContent>
            {isGoogleUser ? (
              <div className="text-sm text-blue-400 font-medium">
                Password settings are managed by Google. To change your password, please visit your Google Account settings.
              </div>
            ) : (
              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Current Password</label>
                  <Input
                    name="currentPassword"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="bg-white/80 dark:bg-[#23263a]/80 border border-blue-200/30 dark:border-blue-900/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">New Password</label>
                  <Input
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="bg-white/80 dark:bg-[#23263a]/80 border border-blue-200/30 dark:border-blue-900/30"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Confirm New Password</label>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="bg-white/80 dark:bg-[#23263a]/80 border border-blue-200/30 dark:border-blue-900/30"
                  />
                </div>
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                {success && <p className="text-green-500 text-sm font-medium">{success}</p>}
                <div className="flex justify-end">
                  <Button type="submit" className="bg-gradient-to-r from-blue-500 to-violet-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200">Update Password</Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Two-Factor Authentication section */}
      <div className="mt-8">
        <Card className="rounded-3xl border-0 bg-white/70 dark:bg-[#23263a]/80 backdrop-blur-xl border border-blue-400/10 shadow-xl dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.65)] hover:shadow-2xl transition-all duration-200">
          <CardHeader className="flex flex-row items-center gap-3 pb-2">
            <Lock className="text-blue-500 w-6 h-6" />
            <CardTitle className="text-xl font-bold text-blue-900 dark:text-white">Two-Factor Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <TwoFactorSetup />
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 