import { describe, expect, it } from 'vitest';
import { registerSchema, loginSchema } from '@/validations/auth';

describe('Auth Validation Schemas', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Test123!@#',
        name: 'John Doe',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'Test123!@#',
        name: 'John Doe',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });

    it('should reject weak passwords', () => {
      const testCases = [
        { password: 'short', description: 'too short' },
        { password: 'nouppercase123!', description: 'no uppercase' },
        { password: 'NOLOWERCASE123!', description: 'no lowercase' },
        { password: 'NoSpecialChar123', description: 'no special character' },
        { password: 'NoNumber!@#abc', description: 'no number' },
      ];

      testCases.forEach(({ password, description }) => {
        const data = {
          email: 'test@example.com',
          password,
          name: 'John Doe',
        };

        const result = registerSchema.safeParse(data);
        expect(result.success, `Password ${description} should be rejected`).toBe(false);
      });
    });

    it('should reject invalid names', () => {
      const testCases = [
        { name: 'a', description: 'too short' },
        { name: '123John', description: 'contains numbers' },
        { name: 'John@Doe', description: 'contains special characters' },
        { name: 'A'.repeat(51), description: 'too long' },
      ];

      testCases.forEach(({ name, description }) => {
        const data = {
          email: 'test@example.com',
          password: 'Test123!@#',
          name,
        };

        const result = registerSchema.safeParse(data);
        expect(result.success, `Name ${description} should be rejected`).toBe(false);
      });
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'anypassword',
      };

      const result = loginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'anypassword',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });

    it('should reject empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = loginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required');
      }
    });
  });
}); 