# 🎯 Demo Mode Implementation Guide

## Quick Implementation Steps

### 1. Add Demo Environment Variable
In your Vercel deployment, add:
```env
DEMO_MODE=true
```

### 2. Update Layout to Include Demo Banner
In `src/app/layout.tsx`:
```tsx
import { DemoBanner } from '@/components/demo-banner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <DemoBanner />
        <div className="pt-[80px] sm:pt-[60px]"> {/* Add padding for banner */}
          {children}
        </div>
      </body>
    </html>
  );
}
```

### 3. Modify Signin Form
In `src/components/auth/signin-form.tsx`, add demo mode checks:

```tsx
import { isFeatureDisabled, getDemoCredentials } from '@/lib/demo-config';

const SignInForm = () => {
  // Pre-fill demo credentials in demo mode
  const demoUser = isDemoMode() ? getDemoCredentials()[0] : null;
  const [email, setEmail] = useState(demoUser?.email || '');
  const [password, setPassword] = useState(demoUser?.password || '');

  return (
    <form onSubmit={handleSubmit}>
      {/* Hide Google OAuth in demo mode */}
      {!isFeatureDisabled('googleAuth') && (
        <Button onClick={() => signIn('google')}>
          Continue with Google
        </Button>
      )}
      
      {/* Rest of form... */}
    </form>
  );
};
```

### 4. Disable Registration
In `src/components/auth/register-form.tsx`:

```tsx
import { isFeatureDisabled, getDemoMessage } from '@/lib/demo-config';

const RegisterForm = () => {
  if (isFeatureDisabled('registration')) {
    return (
      <div className="text-center p-6">
        <h2>Registration Disabled</h2>
        <p>{getDemoMessage('loginPrompt')}</p>
        <Button onClick={() => router.push('/auth/signin')}>
          Go to Sign In
        </Button>
      </div>
    );
  }

  // Normal registration form...
};
```

### 5. Update Seed File
In `prisma/seed.ts`, add demo users:

```tsx
import bcrypt from 'bcryptjs';
import { getDemoCredentials } from '../src/lib/demo-config';

async function main() {
  const demoUsers = getDemoCredentials();
  
  for (const demoUser of demoUsers) {
    const hashedPassword = await bcrypt.hash(demoUser.password, 12);
    
    await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {},
      create: {
        email: demoUser.email,
        name: demoUser.name,
        password: hashedPassword,
        emailVerified: new Date(),
        twoFactorEnabled: false, // Disable 2FA for demo
      },
    });
  }
  
  // Add demo forms and data...
}
```

## Alternative: Simple Environment Check

If you want something even simpler, just add this to your components:

```tsx
// In any component
const isDemoDeployment = process.env.NODE_ENV === 'production' && 
                         window.location.hostname.includes('vercel.app');

if (isDemoDeployment) {
  // Show demo-specific UI
  // Disable certain features
  // Pre-fill demo credentials
}
```

## Benefits of This Approach

✅ **Single Codebase** - No need to maintain two versions  
✅ **Easy Toggle** - Just flip environment variable  
✅ **Professional** - Looks intentional, not broken  
✅ **Secure** - Prevents unwanted signups  
✅ **User-Friendly** - Clear demo credentials  

## What Visitors Will See

1. **Banner at top** with demo credentials clearly visible
2. **No registration option** - only demo login
3. **No Google OAuth** - simpler demo flow
4. **Pre-filled login** form for instant access
5. **Warning notices** that data may reset

## Quick Deploy Checklist

- [ ] Add `DEMO_MODE=true` to Vercel env vars
- [ ] Deploy with demo banner
- [ ] Test demo login works
- [ ] Verify registration is disabled
- [ ] Check all major features work
- [ ] Update README demo link

This gives you a professional portfolio demo without maintaining separate codebases! 🚀 