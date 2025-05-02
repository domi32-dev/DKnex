import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { Prisma, PrismaClient } from '.prisma/client';
import { authOptions } from "../auth/[...nextauth]/route";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

function isValidBase64Image(base64String: string) {
  // Check if it's a valid base64 data URL
  if (!base64String.startsWith('data:image/')) {
    return false;
  }

  // Extract the base64 data
  const base64Data = base64String.split(',')[1];
  if (!base64Data) {
    return false;
  }

  // Check size
  const sizeInBytes = (base64Data.length * 3) / 4;
  return sizeInBytes <= MAX_IMAGE_SIZE;
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, image, currentPassword, newPassword } = await request.json();
    const isGoogleUser = session.user.email.includes('@gmail.com') || 
                        session.user.email.includes('@google.com');

    // Handle password update if provided
    if (currentPassword && newPassword) {
      if (isGoogleUser) {
        return NextResponse.json({ 
          error: 'Password cannot be changed for Google accounts' 
        }, { status: 400 });
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user?.password) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { email: session.user.email },
        data: { password: hashedPassword },
      });
    }

    // Handle profile update
    const updateData: Record<string, any> = {
      updatedAt: new Date(),
    };

    // Only update name if provided
    if (name) {
      updateData.name = name;
    }

    // Only update email if provided and not a Google user
    if (email && !isGoogleUser) {
      updateData.email = email;
    }

    // Only update image if provided and not a Google user
    if (image && !isGoogleUser) {
      // Validate image data
      if (!isValidBase64Image(image)) {
        return NextResponse.json({ 
          error: 'Invalid image format or size. Image must be less than 5MB.' 
        }, { status: 400 });
      }
      updateData.image = image;
    }

    // Only perform profile update if there's data to update
    if (Object.keys(updateData).length > 1) {
      try {
        await prisma.user.update({
          where: { email: session.user.email },
          data: updateData,
        });
      } catch (dbError) {
        console.error('Database update error:', dbError);
        return NextResponse.json({ 
          error: 'Failed to update profile. The image might be too large for the database.' 
        }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      success: true,
      message: isGoogleUser 
        ? 'Profile updated (some fields are managed by Google)' 
        : 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update profile. Please try again with a smaller image or contact support.' 
    }, { status: 500 });
  }
} 