import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { dbConnection } from "@/app/lib/database";
import { UserLogin } from "@/app/lib/model";


declare module "next-auth" {
  interface Session {
    lastActivity?: number;
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    }
  }
}


export const authOptions: NextAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      }),
    ],
    pages: {
      signIn: '/auth/signin',
    },
    session: {
      strategy: "jwt",
      maxAge: 10 * 60, // 10 minutes
    },
    callbacks: {
      async signIn({ user }) {
        await dbConnection();
        const existingUser = await UserLogin.findOne({ email: user.email });
        if (!existingUser) {
          await UserLogin.create({
            email: user.email,
             paid:false,
          });
        }
        return true;
      },
      async session({ session, token }) {
        if (token?.id) {
          session.user = {
            ...session.user,
            id: token.id as string,
          };
        }
        session.lastActivity = Date.now();
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.email = user.email;
        }
        token.lastActivity = Date.now();
        return token;
      },
    },
    events: {
      async signOut({ }) {
        try {
            
          console.log('signouted')
        } catch (error) {
          console.error('Error in signOut event:', error);
        }
      }
    }
};
