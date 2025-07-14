import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from '.prisma/client';
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { SessionStrategy } from "next-auth";
import speakeasy from 'speakeasy';

const prisma = new PrismaClient();

if (!process.env.NEXTAUTH_URL) {
   process.env.NEXTAUTH_URL = 'http://localhost:3000';
}

export const authOptions: NextAuthOptions = {
   adapter: PrismaAdapter(prisma),
   providers: [
      GoogleProvider({
         clientId: process.env.GOOGLE_CLIENT_ID ?? "",
         clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      }),
      CredentialsProvider({
         name: "Credentials",
         credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
            code: { label: "2FA Code", type: "text" },
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials.password) {
               console.log("Missing email or password");
               return null;
            }

            try {
               const user = await prisma.user.findUnique({
                  where: { email: credentials.email },
               });

               if (!user || !user.password) {
                  console.log("User not found or has no password");
                  return null;
               }

               const isValid = await bcrypt.compare(credentials.password, user.password);
               if (!isValid) {
                  console.log("Invalid password");
                  return null;
               }

               // Check if 2FA is enabled
               if (user.twoFactorEnabled) {
                  if (!credentials.code) {
                     console.log("2FA code required");
                     throw new Error('2FA_REQUIRED');
                  }

                  // Verify 2FA code
                  const verified = speakeasy.totp.verify({
                     secret: user.twoFactorSecret!,
                     encoding: 'base32',
                     token: credentials.code,
                     window: 1,
                  });

                  if (!verified) {
                     console.log("Invalid 2FA code");
                     throw new Error('INVALID_2FA_CODE');
                  }
               }

               // Return only safe fields
               return {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  twoFactorEnabled: user.twoFactorEnabled,
               };
            } catch (error) {
               console.error("Auth error:", error);
               throw error;
            }
         },
      }),
   ],
   pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
   },
   session: {
      strategy: "jwt" satisfies SessionStrategy,
   },
   callbacks: {
      async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
         if (user) {
            token.id = user.id;
            token.twoFactorEnabled = user.twoFactorEnabled;
         }
         return token;
      },
      async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
         if (token?.id) {
            (session.user as { id: string; twoFactorEnabled: boolean }).id = token.id;
            (session.user as { id: string; twoFactorEnabled: boolean }).twoFactorEnabled = token.twoFactorEnabled || false;
         }
         return session;
      },
   }, 
   secret: process.env.JWT_SECRET ?? "",
   // Optional: debug logging
   // debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
