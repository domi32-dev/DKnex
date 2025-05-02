import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

export async function cleanupDatabase() {
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(data: {
  email: string;
  password: string;
  name: string;
  verified?: boolean;
}) {
  const hashedPassword = await hash(data.password, 12);
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      emailVerified: data.verified ? new Date() : null,
    },
  });
}

export const testUser = {
  email: 'test@example.com',
  password: 'Test123!@#',
  name: 'Test User',
};

export function generateRandomEmail() {
  return `test-${Math.random().toString(36).substring(7)}@example.com`;
} 