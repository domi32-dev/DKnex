// app/api/auth/verify/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  }

  const existingToken = await prisma.verificationToken.findUnique({ where: { token } });

  if (!existingToken || existingToken.expires < new Date()) {
    return NextResponse.json({ error: 'Token expired or invalid' }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: existingToken.identifier },
    data: { emailVerified: new Date() },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/signin?verified=true`);
}
