import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiErrorResponse {
  error: string;
  details?: unknown;
}

export function handleApiError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    const response: ApiErrorResponse = {
      error: error.message,
    };
    
    if (error.details) {
      response.details = error.details;
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  // Handle Prisma errors
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  ) {
    // Handle unique constraint violations
    if (error.code === 'P2002') {
      return NextResponse.json(
        {
          error: 'A record with this value already exists.',
        },
        { status: 409 }
      );
    }

    // Handle record not found
    if (error.code === 'P2025') {
      return NextResponse.json(
        {
          error: 'Record not found.',
        },
        { status: 404 }
      );
    }
  }

  // Default error response
  return NextResponse.json(
    {
      error: 'An unexpected error occurred. Please try again later.',
    },
    { status: 500 }
  );
}

export function createApiError(
  statusCode: number,
  message: string,
  details?: unknown
) {
  return new ApiError(statusCode, message, details);
} 
