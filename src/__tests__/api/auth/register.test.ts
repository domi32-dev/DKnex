import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/register/route';
import { cleanupDatabase, testUser, generateRandomEmail } from '../../utils/test-utils';

describe('Registration API', () => {
  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  async function makeRegisterRequest(data: Record<string, unknown>) {
    const req = new NextRequest('http://localhost/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return POST(req);
  }

  it('should return validation errors for invalid input', async () => {
    const response = await makeRegisterRequest({
      email: 'invalid-email',
      password: 'short',
      name: '123Invalid',
    });

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data.error).toBe('Validation failed');
    expect(data.validationErrors).toEqual(expect.objectContaining({
      email: expect.arrayContaining(['Invalid email address']),
      password: expect.arrayContaining([expect.stringContaining('Password must')]),
      name: expect.arrayContaining([expect.stringContaining('can only contain letters and spaces')]),
    }));
  });

  it('should return specific error for existing email', async () => {
    // First create a user
    await makeRegisterRequest(testUser);

    // Try to register with the same email
    const response = await makeRegisterRequest({
      ...testUser,
      password: 'DifferentPass123!@#',
    });

    const data = await response.json();
    expect(response.status).toBe(409);
    expect(data.error).toBe('Account already exists');
    expect(data.field).toBe('email');
    expect(data.message).toContain('already exists');
  });

  it('should return success message for valid registration', async () => {
    const response = await makeRegisterRequest({
      email: generateRandomEmail(),
      password: 'ValidPass123!@#',
      name: 'Test User',
    });

    const data = await response.json();
    expect(response.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.message).toContain('successful');
    expect(data.user).toEqual(expect.objectContaining({
      email: expect.any(String),
      name: 'Test User',
    }));
  });
}); 