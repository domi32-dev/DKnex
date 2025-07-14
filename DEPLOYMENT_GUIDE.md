# 🚀 Vercel Deployment Guide

## Database Setup Options

### Option 1: Vercel Postgres (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Create Vercel Postgres database
vercel postgres create your-db-name

# This gives you a DATABASE_URL automatically
```

### Option 2: Supabase (Free Tier)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy the DATABASE_URL from Settings > Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`

### Option 3: Neon (Generous Free Tier)
1. Go to [neon.tech](https://neon.tech)
2. Create project
3. Copy connection string

### Option 4: Railway (Simple Setup)
1. Go to [railway.app](https://railway.app)
2. Create PostgreSQL database
3. Copy DATABASE_URL

## Environment Variables Setup

Create these environment variables in Vercel Dashboard:

```env
# Database
DATABASE_URL="postgresql://[your-db-connection-string]"

# NextAuth
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-super-secret-jwt-key-32-chars-min"

# Google OAuth (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email Service (Optional - for demo can skip)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@your-domain.com"

# Redis (Optional - can skip for demo)
REDIS_URL="redis://your-redis-url"
```

## Deployment Steps

### 1. Prepare Your Code
```bash
# Make sure your code is committed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### 2. Deploy to Vercel
```bash
# Option A: Vercel CLI
vercel --prod

# Option B: Connect GitHub repo in Vercel Dashboard
# Go to vercel.com > New Project > Import from GitHub
```

### 3. Run Database Migrations
```bash
# After first deployment, run migrations
vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed
```

### 4. Update OAuth Settings
If using Google OAuth:
- Go to Google Cloud Console
- Update authorized redirect URIs:
  - Add: `https://your-app.vercel.app/api/auth/callback/google`

## Demo Data Setup

Add demo users and forms for showcase:

```bash
# Run this after deployment
npx prisma db seed
```

## Build Configuration

Ensure your `package.json` has correct scripts:
```json
{
  "scripts": {
    "build": "next build",
    "postinstall": "prisma generate"
  }
}
```

## Vercel Configuration

Create `vercel.json` (optional):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

## Testing Deployment

1. ✅ Check database connection
2. ✅ Test user registration/login
3. ✅ Verify form builder works
4. ✅ Test 2FA setup
5. ✅ Check responsive design
6. ✅ Verify email notifications (if configured)

## Common Issues & Solutions

### Database Connection Errors
```bash
# Check DATABASE_URL format
echo $DATABASE_URL

# Test connection locally
npx prisma db pull
```

### Build Failures
```bash
# Common fixes
npm run build  # Test build locally first
npx prisma generate  # Ensure Prisma client is generated
```

### Environment Variables
- Double-check all required env vars are set in Vercel
- Use `vercel env pull` to test locally with production env

## Demo Account Setup

For recruiters/employers, create demo accounts:

```sql
-- Add to your seed file
INSERT INTO "User" (email, password, name, emailVerified) VALUES
('demo@dknex.com', '[bcrypt-hash]', 'Demo User', NOW()),
('employer@dknex.com', '[bcrypt-hash]', 'Employer Demo', NOW());
```

## Monitoring & Analytics

After deployment:
- Set up Vercel Analytics
- Configure error monitoring (optional: Sentry)
- Monitor database performance

## Domain Setup (Optional)

```bash
# Add custom domain
vercel domains add your-domain.com
```

---

🎉 **Your app should now be live at `https://your-app.vercel.app`** 