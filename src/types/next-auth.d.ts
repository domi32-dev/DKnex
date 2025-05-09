import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      twoFactorEnabled?: boolean;
    } & DefaultSession['user']
  }

  interface User {
    twoFactorEnabled?: boolean;
    twoFactorSecret?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    twoFactorEnabled?: boolean;
  }
} 