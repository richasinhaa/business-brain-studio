import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { AdapterUser } from "next-auth/adapters";
import type { NextAuthOptions } from "next-auth";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],

  session: {
    strategy: "jwt",
  },

  // ✅ This exists at runtime but isn't in the TS type yet,
  // so we allow it via `satisfies` below.
  allowDangerousEmailAccountLinking: true,

  callbacks: {
    // Attach user.id to JWT on sign-in
    async jwt({ token, user }) {
      if (user) {
        const u = user as AdapterUser;
        token.id = u.id;
      }
      return token;
    },

    // Expose id to the client
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  debug: process.env.NODE_ENV === "development",
} satisfies NextAuthOptions & {
  // extra field that the runtime supports
  allowDangerousEmailAccountLinking: boolean;
};

export default NextAuth(authOptions);
