'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { isFeatureDisabled, getDemoMessage, isDemoMode, getDemoCredentials } from '@/lib/demo-config';
import { useTranslation } from '@/i18n/translations';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const inputClasses = "w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent transition-all duration-200 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden";
const labelClasses = "block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300";

export function SigninForm() {
   const { t } = useTranslation();
   const router = useRouter();
   const { data: session } = useSession();

   // Redirect if already authenticated
   useEffect(() => {
      if (session) {
         router.push('/');
      }
   }, [session, router]);

   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const [loading, setLoading] = useState(false);
   const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
   const [twoFactorCode, setTwoFactorCode] = useState('');

   // Auto-fill demo credentials when in demo mode
   useEffect(() => {
      if (isDemoMode()) {
         const demoCredentials = getDemoCredentials();
         if (demoCredentials[0]) {
            setEmail(demoCredentials[0].email);
            setPassword(demoCredentials[0].password);
         }
      }
   }, []);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
         const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
            code: twoFactorCode,
         });

         if (result?.error === '2FA_REQUIRED') {
            setShowTwoFactorDialog(true);
         } else if (result?.error === 'INVALID_2FA_CODE') {
            setError('Invalid verification code. Please try again.');
         } else if (result?.error) {
            setError('Invalid credentials');
         } else if (result?.ok) {
            // Redirect to dashboard on success
            router.push('/');
         } else {
            setError('An unexpected error occurred. Please try again.');
         }
      } catch {
         setError('An error occurred. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   const handleTwoFactorSubmit = async () => {
    if (!twoFactorCode) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        code: twoFactorCode,
      });

      if (res?.error === 'INVALID_2FA_CODE') {
        setError('Invalid verification code. Please try again.');
      } else if (res?.ok) {
        setError('Sign in successful! Redirecting...');
        setShowTwoFactorDialog(false);
        router.push('/');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isFeatureDisabled('googleAuth')) {
      setError(getDemoMessage('featureDisabled'));
      return;
    }
    
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google. Please try again.');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-md mx-auto">
         <div className="p-8 rounded-2xl shadow-xl bg-transparent backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/30">
            <div className="text-center mb-8">
               <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('auth.signin.title')}
               </h1>
               <p className="text-gray-600 dark:text-gray-300">
                  {t('auth.signin.subtitle')}
               </p>
            </div>

            {/* Demo Mode Notice */}
            {isDemoMode() && (
               <div className="mb-6 p-4 bg-blue-50/80 dark:bg-blue-900/40 border border-blue-200/50 dark:border-blue-800/50 rounded-lg backdrop-blur-sm">
                  <p className="text-sm text-blue-800 dark:text-blue-200 text-center">
                     <strong>{t('auth.demo.title')}</strong><br />
                     {t('auth.demo.loginPrompt')}
                  </p>
               </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     {t('auth.email')}
                  </label>
                  <input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="w-full px-4 py-3 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/10 dark:bg-gray-700/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                     placeholder={t('auth.emailPlaceholder')}
                     required
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                     {t('auth.password')}
                  </label>
                  <input
                     type="password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="w-full px-4 py-3 rounded-lg border border-gray-300/50 dark:border-gray-600/50 bg-white/10 dark:bg-gray-700/30 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                     placeholder={t('auth.passwordPlaceholder')}
                     required
                  />
               </div>

               {error && (
                  <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50/80 dark:bg-red-900/40 p-3 rounded-lg backdrop-blur-sm">
                     {error}
                  </div>
               )}

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
               >
                  {loading ? t('auth.signingIn') : t('auth.signin.button')}
               </button>
            </form>

            <div className="mt-8 text-center">
               <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-gray-300/50 dark:border-gray-600/50"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                     <span className="px-2 bg-transparent text-gray-500 dark:text-gray-400">
                        {t('auth.orContinueWith')}
                     </span>
                  </div>
               </div>

               <div className="mt-6">
                  <button
                     onClick={handleGoogleSignIn}
                     disabled={isFeatureDisabled('googleAuth')}
                     className={`w-full flex items-center justify-center px-4 py-3 border border-gray-300/50 dark:border-gray-600/50 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white/10 dark:bg-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-600/40 transition-colors duration-200 backdrop-blur-sm ${
                        isFeatureDisabled('googleAuth') ? 'opacity-50 cursor-not-allowed' : ''
                     }`}
                  >
                     <Image
                        src="/google.svg"
                        alt="Google"
                        width={20}
                        height={20}
                        className="mr-2"
                     />
                     {t('auth.signInWithGoogle')}
                     {isFeatureDisabled('googleAuth') && (
                        <span className="ml-2 text-xs text-gray-500">(Demo disabled)</span>
                     )}
                  </button>
               </div>
            </div>

            <div className="mt-6 text-center">
               <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('auth.noAccount')}{' '}
                  {isFeatureDisabled('registration') ? (
                     <span className="text-gray-500 dark:text-gray-400">
                        {t('auth.register.title')} <span className="text-xs">(Demo disabled)</span>
                     </span>
                  ) : (
                     <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                        {t('auth.register.title')}
                     </Link>
                  )}
               </p>
            </div>
         </div>
      </div>

      <Dialog open={showTwoFactorDialog} onOpenChange={setShowTwoFactorDialog}>
        <DialogContent className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
              Two-Factor Authentication
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="twoFactorCode" className={labelClasses}>
                Enter Verification Code
              </label>
              <input
                type="text"
                id="twoFactorCode"
                className={inputClasses}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                required
                placeholder="Enter 6-digit code"
                maxLength={6}
                pattern="[0-9]*"
                inputMode="numeric"
              />
              {error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 rounded-lg transition-all duration-200"
              onClick={handleTwoFactorSubmit}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Code'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
