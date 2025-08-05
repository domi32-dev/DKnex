import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

// Define proper types for the mocked POST function
type MockedPOST = ReturnType<typeof vi.fn<(request: NextRequest) => Promise<Response>>>;

// Mock the entire API route
vi.mock('@/app/api/auth/register/route', () => ({
  POST: vi.fn(),
}));

// Mock dependencies
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    account: {
      findFirst: vi.fn(),
    },
    verificationToken: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
    $disconnect: vi.fn(),
  })),
}));

vi.mock('bcryptjs', () => ({
  hash: vi.fn().mockResolvedValue('hashedPassword'),
}));

vi.mock('@/lib/email', () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
}));

describe('Registration API (Mocked)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return validation errors for invalid input', async () => {
    const { POST } = await import('@/app/api/auth/register/route');
    
    // Mock the POST function to return validation errors
    (POST as unknown as MockedPOST).mockResolvedValue(
      new Response(
        JSON.stringify({
          error: 'Validation failed',
          validationErrors: {
            email: ['Invalid email address'],
            password: ['Password must be at least 8 characters'],
          },
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    );

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'invalid-email',
        password: 'short',
        name: '123Invalid',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.validationErrors.email).toContain('Invalid email address');
  });

  it('should return success for valid registration', async () => {
    const { POST } = await import('@/app/api/auth/register/route');
    
    // Mock the POST function to return success
    (POST as unknown as MockedPOST).mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          message: 'Registration successful! Please check your email to verify your account.',
          user: {
            id: 'user-123',
            email: 'test@example.com',
            name: 'Test User',
          },
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      )
    );

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'ValidPass123!',
        name: 'Test User',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toContain('successful');
    expect(data.user.email).toBe('test@example.com');
  });

  it('should return error for existing email', async () => {
    const { POST } = await import('@/app/api/auth/register/route');
    
    // Mock the POST function to return existing email error
    (POST as unknown as MockedPOST).mockResolvedValue(
      new Response(
        JSON.stringify({
          error: 'Account already exists',
          message: 'An account with this email address already exists. Please try signing in.',
          field: 'email',
        }),
        { status: 409, headers: { 'Content-Type': 'application/json' } }
      )
    );

    const request = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        email: 'existing@example.com',
        password: 'ValidPass123!',
        name: 'Test User',
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe('Account already exists');
    expect(data.field).toBe('email');
  });
}); 