import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { Prisma, PrismaClient } from '.prisma/client';
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { SessionStrategy } from "next-auth";

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
         },
         async authorize(credentials) {
            if (!credentials?.email || !credentials.password) {
               console.log("Missing email or password");
               return null;
            }

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

            // Return only safe fields
            return {
               id: user.id,
               name: user.name,
               email: user.email,
            };
         },
      }),
   ],
   pages: {
      signIn: "/auth/signin",
   },
   session: {
      strategy: "jwt" satisfies SessionStrategy,
   },
   callbacks: {
      async jwt({ token, user }: { token: JWT; user?: User }): Promise<JWT> {
         if (user) {
            token.id = user.id;
         }
         return token;
      },
      async session({ session, token }: { session: Session; token: JWT }): Promise<Session> {
         if (token?.id) {
            (session.user as any).id = token.id;
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
