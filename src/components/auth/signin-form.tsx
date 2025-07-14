'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { isDemoMode, getDemoCredentials, isFeatureDisabled, getDemoMessage } from '@/lib/demo-config';
import { DemoBanner } from '@/components/demo-banner';
import Image from 'next/image';

const inputClasses = "w-full px-4 py-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:border-transparent transition-all duration-200 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden";
const labelClasses = "block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300";

interface ValidationErrors {
  [key: string]: string[];
}

const SignInForm = () => {
  const demoUser = isDemoMode() ? getDemoCredentials()[0] : null;
  const [email, setEmail] = useState(demoUser?.email || '');
  const [password, setPassword] = useState(demoUser?.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTwoFactorDialog, setShowTwoFactorDialog] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);
    setSuccess(null);
    setLoading(true);

    try {
      console.log('Attempting sign in...');
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        code: twoFactorCode,
      });

      console.log('Sign in response:', res);

      if (res?.error === '2FA_REQUIRED') {
        console.log('2FA required');
        setShowTwoFactorDialog(true);
        setLoading(false);
      } else if (res?.error === 'INVALID_2FA_CODE') {
        console.log('Invalid 2FA code');
        setErrors({ twoFactor: ['Invalid verification code. Please try again.'] });
        setLoading(false);
      } else if (res?.error) {
        console.log('Sign in error:', res.error);
        setErrors({ general: [res.error] });
        setLoading(false);
      } else if (res?.ok) {
        console.log('Sign in successful');
        setSuccess('Sign in successful! Redirecting...');
        setShowTwoFactorDialog(false);
        router.push('/');
      } else {
        console.log('Unexpected response:', res);
        setErrors({ general: ['An unexpected error occurred. Please try again.'] });
        setLoading(false);
      }
    } catch (_error) {
      console.error('Sign in error:', _error);
      setErrors({ general: ['An unexpected error occurred. Please try again.'] });
      setLoading(false);
    }
  };

  const handleTwoFactorSubmit = async () => {
    if (!twoFactorCode) {
      setErrors({ twoFactor: ['Please enter the verification code'] });
      return;
    }

    setLoading(true);
    setErrors(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
        code: twoFactorCode,
      });

      if (res?.error === 'INVALID_2FA_CODE') {
        setErrors({ twoFactor: ['Invalid verification code. Please try again.'] });
      } else if (res?.ok) {
        setSuccess('Sign in successful! Redirecting...');
        setShowTwoFactorDialog(false);
        router.push('/');
      } else {
        setErrors({ twoFactor: ['An unexpected error occurred. Please try again.'] });
      }
    } catch (_error) {
      setErrors({ twoFactor: ['An unexpected error occurred. Please try again.'] });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isFeatureDisabled('googleAuth')) {
      setErrors({ general: [getDemoMessage('featureDisabled')] });
      return;
    }
    
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error('Google sign in error:', error);
      setErrors({ general: ['Failed to sign in with Google. Please try again.'] });
      setLoading(false);
    }
  };

  return (
    <>
      <DemoBanner />
      <div className="min-h-[100vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center mb-8 relative">
              <Link
                href="/"
                className="inline-flex items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors cursor-pointer z-10"
                role="button"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
              <h1 className="text-2xl font-bold absolute w-full text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
                Sign In
              </h1>
            </div>

            {/* Demo mode credentials display */}
            {isDemoMode() && (
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  💡 Demo Credentials
                </h3>
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded">
                    {demoUser?.email}
                  </p>
                  <p className="font-mono bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded mt-1">
                    {demoUser?.password}
                  </p>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                {success}
              </div>
            )}

            {errors?.general && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
                {errors.general.map((error, i) => (
                  <div key={i}>{error}</div>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className={labelClasses}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className={inputClasses}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className={labelClasses}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={inputClasses}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-medium py-3 rounded-lg transition-all duration-200" 
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
              <span className="px-3 text-sm text-gray-500 dark:text-gray-400">or</span>
              <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            </div>

            {/* Google OAuth Button */}
            <Button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || isFeatureDisabled('googleAuth')}
              className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border transition-all duration-200 ${
                isFeatureDisabled('googleAuth')
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className={isFeatureDisabled('googleAuth') ? 'opacity-50' : ''}
              />
              <span className="font-medium">
                {isFeatureDisabled('googleAuth') ? 'Google Sign In (Demo Disabled)' : 'Continue with Google'}
              </span>
            </Button>

            {/* Register Link */}
            <div className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              {isFeatureDisabled('registration') ? (
                <span className="text-gray-400 dark:text-gray-500 cursor-not-allowed">
                  Register here (Demo Disabled)
                </span>
              ) : (
                <Link 
                  href="/auth/register" 
                  className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                >
                  Register here
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showTwoFactorDialog} onOpenChange={setShowTwoFactorDialog}>
        <DialogContent className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200 dark:border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
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
              {errors?.twoFactor && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.twoFactor.map((error, i) => (
                    <div key={i}>{error}</div>
                  ))}
                </div>
              )}
            </div>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white font-medium py-3 rounded-lg transition-all duration-200"
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
};

export default SignInForm;
