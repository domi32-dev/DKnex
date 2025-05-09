import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../[...nextauth]/route';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate a new secret
    const secret = speakeasy.generateSecret({
      length: 20,
      name: `Do-Ki:${session.user.email}`,
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    // Store the secret temporarily (we'll save it permanently after verification)
    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        twoFactorSecret: secret.base32,
      } as any,
    });

    return NextResponse.json({
      success: true,
      secret: secret.base32,
      qrCode,
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    );
  }
} 