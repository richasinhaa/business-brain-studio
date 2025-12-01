// pages/api/auth/[...nextauth].ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  // 👇 IMPORTANT: use our custom login page instead of /api/auth/signin
  pages: {
    signIn: "/login",
  },

  callbacks: {
  async jwt({ token, user }) {
    // During login, attach user.id to token
    if (user) {
      token.id = (user as any).id;
    }
    return token;
  },

  async session({ session, token }) {
    // Expose id to client
    if (session.user && token.id) {
      session.user.id = token.id as string;
    }
    return session;
  },
},

};

export default NextAuth(authOptions);
