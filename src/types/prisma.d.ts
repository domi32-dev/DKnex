import { User } from '@prisma/client';

declare global {
  namespace PrismaJson {
    interface User {
      twoFactorEnabled: boolean;
      twoFactorSecret: string | null;
    }
  }
} 