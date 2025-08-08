import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store for rate limiting (fallback)
const store: RateLimitStore = {};

// Optional Upstash Redis client for distributed rate limiting (Edge-compatible)
// Use when UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are provided; otherwise fall back to in-memory
let redis: Redis | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
  } catch {
    redis = null;
  }
}

// Export for testing
export const _store = store;

// Rate limit configuration
const RATE_LIMIT_MAX = 5; // Maximum attempts
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute window

export async function rateLimit(identifier: string): Promise<boolean> {
  const now = Date.now();
  // Redis path
  if (redis) {
    const key = `rl:${identifier}`;
    const count = await (redis as Redis).incr(key);
    if (count === 1) {
      // Set expiry in seconds
      await (redis as Redis).expire(key, Math.ceil(RATE_LIMIT_WINDOW / 1000));
    }
    return count > RATE_LIMIT_MAX;
  }

  // In-memory path
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

  if (await rateLimit(identifier)) {
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