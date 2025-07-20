// app/api/auth/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';
import { registerSchema } from '@/validations/auth';
import { ZodError } from 'zod';

const prisma = new PrismaClient();

function formatZodError(error: ZodError) {
  return error.errors.reduce((acc, err) => {
    // Remove the redundant path prefix from the error
    const field = err.path[0] as string;
    const message = err.message;
    
    if (!acc[field]) {
      acc[field] = [];
    }
    acc[field].push(message);
    return acc;
  }, {} as Record<string, string[]>);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validate input
    const validationResult = registerSchema.safeParse(body);
    
    if (!validationResult.success) {
      const formattedErrors = formatZodError(validationResult.error);
      return NextResponse.json(
        { 
          error: 'Validation failed',
          validationErrors: formattedErrors,
          message: 'Please fix the following issues:',
        },
        { status: 400 }
      );
    }

    const { email, password, name } = validationResult.data;

    // Check if user exists (including OAuth accounts)
    const [existingUser, existingAccount] = await Promise.all([
      prisma.user.findUnique({ 
        where: { email },
        select: { id: true }
      }),
      prisma.account.findFirst({
        where: {
          provider: 'google',
          user: {
            email: email
          }
        },
        select: { id: true }
      })
    ]);
    
    if (existingUser || existingAccount) {
      return NextResponse.json(
        { 
          error: 'Account already exists',
          message: 'An account with this email address already exists. Please try signing in.',
          field: 'email'
        },
        { status: 409 }
      );
    }

    // Hash password with a cost factor of 12
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user in a transaction
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const user = await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });

      const token = randomUUID();
      
      await tx.verificationToken.create({
        data: {
          identifier: user.email,
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      return { user, token };
    });

    // Send verification email
    await sendVerificationEmail(result.user.email, result.token);

    return NextResponse.json(
      { 
        success: true,
        message: 'Registration successful! Please check your email to verify your account.',
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);

    // Handle unexpected errors
    return NextResponse.json(
      { 
        error: 'Registration failed',
        message: 'An unexpected error occurred during registration. Please try again later.',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
