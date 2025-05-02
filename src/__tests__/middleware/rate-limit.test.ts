import { describe, expect, it, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { rateLimitMiddleware } from '@/middleware/rate-limit';

describe('Rate Limiting Middleware', () => {
  const mockRequest = (path: string, ip: string = '127.0.0.1') => {
    return new NextRequest(new URL(`http://localhost${path}`), {
      headers: {
        'x-forwarded-for': ip,
      },
    });
  };

  beforeEach(() => {
    // Reset rate limit store before each test
    // @ts-ignore - accessing private store for testing
    global._rateLimitStore = {};
  });

  it('should allow requests under the rate limit', async () => {
    const request = mockRequest('/api/auth/signin');
    
    // Make multiple requests under the limit
    for (let i = 0; i < 5; i++) {
      const response = await rateLimitMiddleware(request);
      expect(response.status).toBe(200);
    }
  });

  it('should block requests over the rate limit', async () => {
    const request = mockRequest('/api/auth/signin');
    
    // Make requests up to the limit
    for (let i = 0; i < 5; i++) {
      await rateLimitMiddleware(request);
    }

    // This request should be blocked
    const response = await rateLimitMiddleware(request);
    expect(response.status).toBe(429);
  });

  it('should track rate limits separately for different IPs', async () => {
    const request1 = mockRequest('/api/auth/signin', '1.1.1.1');
    const request2 = mockRequest('/api/auth/signin', '2.2.2.2');

    // Make requests up to the limit for first IP
    for (let i = 0; i < 5; i++) {
      const response = await rateLimitMiddleware(request1);
      expect(response.status).toBe(200);
    }

    // First IP should be blocked
    const blockedResponse = await rateLimitMiddleware(request1);
    expect(blockedResponse.status).toBe(429);

    // Second IP should still be allowed
    const allowedResponse = await rateLimitMiddleware(request2);
    expect(allowedResponse.status).toBe(200);
  });

  it('should track rate limits separately for different routes', async () => {
    const request1 = mockRequest('/api/auth/signin');
    const request2 = mockRequest('/api/auth/register');

    // Make requests up to the limit for first route
    for (let i = 0; i < 5; i++) {
      const response = await rateLimitMiddleware(request1);
      expect(response.status).toBe(200);
    }

    // First route should be blocked
    const blockedResponse = await rateLimitMiddleware(request1);
    expect(blockedResponse.status).toBe(429);

    // Second route should still be allowed
    const allowedResponse = await rateLimitMiddleware(request2);
    expect(allowedResponse.status).toBe(200);
  });

  it('should not apply rate limiting to non-auth routes', async () => {
    const request = mockRequest('/api/some-other-route');
    
    // Make many requests to non-auth route
    for (let i = 0; i < 10; i++) {
      const response = await rateLimitMiddleware(request);
      expect(response.status).toBe(200);
    }
  });
}); 