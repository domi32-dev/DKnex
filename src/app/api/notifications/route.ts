// If you see 'Property "notification" does not exist on type PrismaClient',
// run `npx prisma generate` in your project root to update the Prisma client.
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id: string })?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get pagination parameters
  const url = new URL(req.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  try {
    // Using a raw query instead of model access
    const query = `
      SELECT 
        n.id, 
        n.title, 
        n.description, 
        n."createdAt" as time,
        COALESCE(un.read, false) as read,
        un."readAt"
      FROM 
        "Notification" n
      LEFT JOIN 
        "UserNotification" un 
        ON n.id = un."notificationId" AND un."userId" = $1
      ORDER BY 
        n."createdAt" DESC
      LIMIT $2 OFFSET $3
    `;

    const notifications = await prisma.$queryRawUnsafe(
      query,
      userId,
      limit,
      skip
    );

    // Convert dates to proper format
    const result = Array.isArray(notifications) 
      ? notifications.map((n: { id: string; title: string; description: string; time: string; type: string; read: boolean; readAt: string | null }) => ({
          id: n.id,
          title: n.title,
          description: n.description,
          time: n.time,
          read: n.read || false,
          readAt: n.readAt || null,
        }))
      : [];

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
} 