import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting
const store: RateLimitStore = {};

// Rate limit configuration
const RATE_LIMIT_MAX = 5; // Maximum attempts
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window

export function rateLimit(identifier: string): boolean {
  const now = Date.now();
  const userLimit = store[identifier];

  if (!userLimit || userLimit.resetTime < now) {
    store[identifier] = {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    };
    return false;
  }

  if (userLimit.count >= RATE_LIMIT_MAX) {
    return true;
  }

  userLimit.count += 1;
  return false;
}

export async function rateLimitMiddleware(
  request: NextRequest,
  authRoutes: string[] = ['/api/auth/signin', '/api/auth/register']
) {
  const path = request.nextUrl.pathname;
  
  if (!authRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Get IP from headers since request.ip is not available
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'anonymous';
  const identifier = `${ip}-${path}`;

  if (rateLimit(identifier)) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too many requests. Please try again later.',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return NextResponse.next();
}