import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const notificationId = params.id;

    try {
      // Check if notification exists first
      const notification = await prisma.$queryRaw`
        SELECT COUNT(*) FROM "Notification" WHERE id = ${notificationId}
      `;
      
      if (!notification || !Array.isArray(notification) || !notification[0] || notification[0].count === '0') {
        return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }
      
      // Check if user notification exists
      const userNotification = await prisma.$queryRaw`
        SELECT id FROM "UserNotification" 
        WHERE "userId" = ${userId} AND "notificationId" = ${notificationId}
      `;
      
      if (userNotification && Array.isArray(userNotification) && userNotification.length > 0) {
        // Update existing record
        await prisma.$executeRaw`
          UPDATE "UserNotification" 
          SET read = true, "readAt" = ${new Date()} 
          WHERE "userId" = ${userId} AND "notificationId" = ${notificationId}
        `;
      } else {
        // Insert new record
        await prisma.$executeRaw`
          INSERT INTO "UserNotification" (id, "userId", "notificationId", read, "readAt")
          VALUES (${randomUUID()}, ${userId}, ${notificationId}, true, ${new Date()})
        `;
      }

      return NextResponse.json({ success: true });
    } catch (prismaError) {
      console.error('Prisma error:', prismaError);
      return NextResponse.json(
        { error: 'Database error', details: (prismaError as Error).message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return NextResponse.json({ error: 'Failed to update notification status' }, { status: 500 });
  }
} 