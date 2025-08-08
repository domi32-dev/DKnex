import { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { SessionStrategy } from "next-auth";
import speakeasy from 'speakeasy';

// Use shared Prisma client to avoid multiple instances in dev

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
            if (!credentials?.email || !credentials?.password) {
               return null;
            }

                         const user = await prisma.user.findUnique({
                where: { email: credentials.email },
             });

            if (!user || !user.password) {
               return null;
            }

            const isValidPassword = await bcrypt.compare(
               credentials.password,
               user.password
            );

            if (!isValidPassword) {
               return null;
            }

            // Handle 2FA if enabled
            if (user.twoFactorEnabled && user.twoFactorSecret) {
               if (!credentials.code) {
                  // First step: password is correct, need 2FA code
                  throw new Error("2FA_REQUIRED");
               }

               const verified = speakeasy.totp.verify({
                  secret: user.twoFactorSecret,
                  encoding: 'base32',
                  token: credentials.code,
                  window: 2
               });

               if (!verified) {
                  return null;
               }
            }

            return {
               id: user.id,
               email: user.email,
               name: user.name,
               image: user.image,
               twoFactorEnabled: user.twoFactorEnabled,
            };
         }
      })
   ],
   session: {
      strategy: "jwt" as SessionStrategy,
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
   // Align with NextAuth naming; NEXTAUTH_SECRET is the standard
   secret: process.env.NEXTAUTH_SECRET ?? "",
   // Optional: debug logging
   // debug: process.env.NODE_ENV === "development",
}; 