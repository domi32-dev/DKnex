# Development Guide

## Getting Started

### Prerequisites

- **Node.js** 18+ (recommended: 20.x)
- **PostgreSQL** 14+ or **Supabase** account
- **Git** for version control
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense
  - Prisma

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/DKNex.git
   cd DKNex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your configuration:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/dknex"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   
   # Email (optional for development)
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@dknex.com"
   
   # OAuth (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # File Upload (optional)
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   SUPABASE_SERVICE_ROLE_KEY="your-supabase-key"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── forms/             # Form-related pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── form-builder/     # Form builder components
│   ├── layout/           # Layout components
│   └── auth/             # Authentication components
├── lib/                   # Utility libraries
├── types/                 # TypeScript type definitions
├── i18n/                  # Internationalization
├── validations/           # Zod validation schemas
├── middleware/            # Custom middleware
└── __tests__/            # Test files
```

## Development Workflow

### Code Style

We use **ESLint** and **Prettier** for code formatting. Configure your editor to format on save:

**VS Code Settings** (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### Git Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, documented code
   - Add tests for new features
   - Update documentation if needed

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push and create a PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Testing

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

We use **Vitest** and **React Testing Library**. Example test structure:

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const handleClick = vi.fn();
    render(<MyComponent onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
```

### Test Coverage

We aim for **80%+ test coverage**. Focus on:
- Component behavior and user interactions
- API endpoint functionality
- Utility functions
- Error handling

## Database Development

### Prisma Schema

The database schema is defined in `prisma/schema.prisma`. After making changes:

```bash
# Generate Prisma client
npx prisma generate

# Create a migration
npx prisma migrate dev --name description

# Reset database (development only)
npx prisma migrate reset
```

### Database Seeding

Seed data is in `prisma/seed.ts`. Run with:
```bash
npm run db:seed
```

## API Development

### Creating API Routes

API routes are in `src/app/api/`. Example structure:

```typescript
// src/app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleApiError } from '@/utils/api-error';

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Validate input with Zod
    // Your logic here
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Error Handling

Use the centralized error handler:

```typescript
import { handleApiError, createApiError } from '@/utils/api-error';

// In your API route
try {
  // Your logic
} catch (error) {
  return handleApiError(error);
}

// Or throw custom errors
throw createApiError(400, 'Invalid input');
```

## Component Development

### Component Structure

```typescript
// src/components/example/example-component.tsx
"use client";

import React from 'react';
import { cn } from '@/lib/utils';

interface ExampleComponentProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

export function ExampleComponent({
  children,
  className,
  variant = 'default',
}: ExampleComponentProps) {
  return (
    <div
      className={cn(
        'base-styles',
        variant === 'outline' && 'outline-styles',
        className
      )}
    >
      {children}
    </div>
  );
}
```

### Styling Guidelines

- Use **Tailwind CSS** for styling
- Follow the design system in `src/components/ui/`
- Use `cn()` utility for conditional classes
- Prefer semantic class names over arbitrary values

### State Management

- Use **React hooks** for local state
- Use **React Query** for server state
- Use **Zustand** for global state (if needed)
- Avoid prop drilling - use context when appropriate

## Internationalization

### Adding Translations

1. **Add keys to translation files**:
   ```json
   // src/i18n/translations/en.json
   {
     "common": {
       "save": "Save",
       "cancel": "Cancel"
     }
   }
   ```

2. **Use in components**:
   ```typescript
   import { useTranslation } from '@/i18n/translations';
   
   export function MyComponent() {
     const { t } = useTranslation();
     return <button>{t('common.save')}</button>;
   }
   ```

## Performance Optimization

### Code Splitting

Use dynamic imports for large components:

```typescript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // If component doesn't need SSR
});
```

### Image Optimization

Use Next.js Image component:

```typescript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={400}
  height={300}
  priority // For above-the-fold images
/>
```

### Bundle Analysis

Analyze bundle size:

```bash
npm run build
npx @next/bundle-analyzer
```

## Security Best Practices

### Input Validation

Always validate user input:

```typescript
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(50),
});

// In API route
const validatedData = userSchema.parse(body);
```

### Authentication

- Use NextAuth.js for authentication
- Implement proper session management
- Add rate limiting to sensitive endpoints
- Validate user permissions

### Data Sanitization

- Sanitize user inputs
- Use parameterized queries (Prisma handles this)
- Implement proper CORS policies
- Add security headers

## Deployment

### Environment Variables

Set up environment variables in your deployment platform:

```env
# Production
DATABASE_URL="postgresql://..."
   NEXTAUTH_URL="https://your-domain.com"
   NEXTAUTH_SECRET="your-production-secret"
```

### Build Process

```bash
# Build the application
npm run build

# Start production server
npm start
```

### Monitoring

- Set up error tracking (Sentry, LogRocket)
- Monitor performance (Vercel Analytics, Google Analytics)
- Set up uptime monitoring
- Configure logging

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Check `DATABASE_URL` in `.env.local`
   - Ensure PostgreSQL is running
   - Run `npx prisma migrate dev`

2. **Authentication issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check OAuth provider configuration
   - Clear browser cookies

3. **Build errors**
   - Check TypeScript errors: `npx tsc --noEmit`
   - Run linter: `npm run lint`
   - Clear Next.js cache: `rm -rf .next`

4. **Test failures**
   - Check test environment setup
   - Verify mock implementations
   - Run tests in isolation

### Getting Help

- Check existing issues on GitHub
- Review documentation
- Ask in Discord community
- Create a detailed issue with reproduction steps

## Contributing Guidelines

### Before Submitting

1. **Test your changes**
   - Run the full test suite
   - Test in different browsers
   - Check mobile responsiveness

2. **Update documentation**
   - Update README if needed
   - Add JSDoc comments
   - Update API documentation

3. **Check code quality**
   - Run linter: `npm run lint`
   - Check TypeScript: `npx tsc --noEmit`
   - Ensure good test coverage

### Pull Request Process

1. **Create a descriptive PR title**
2. **Add detailed description**
3. **Include screenshots for UI changes**
4. **Link related issues**
5. **Request reviews from maintainers**

### Code Review

- Be open to feedback
- Address review comments promptly
- Keep commits atomic and focused
- Maintain clean git history

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Vitest Documentation](https://vitest.dev) 