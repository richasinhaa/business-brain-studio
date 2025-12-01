// src/pages/api/auth/[...nextauth].ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import type { AdapterUser } from "next-auth/adapters";

// Adjust this if you add more providers
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    // Attach user.id to the JWT
    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: AdapterUser | null;
    }): Promise<JWT> {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },

    // Expose id on session.user so getCurrentUser() can read it
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }): Promise<Session> {
      if (session.user && token.sub) {
        (session.user as Session["user"] & { id: string }).id = token.sub;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
