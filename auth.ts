import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import authConfig from "./auth.config";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

async function fetchUserRole(id: string) {
  const user = await prisma.user.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      role: true,
      UserInput: {
        select: { isVerified: true },
      },
    },
  });
  return user;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, //30 days
    updateAge: 24 * 60 * 60, //24 hours
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    jwt: async ({ token, user, trigger, session }) => {
      if (trigger == "update") {
        if (session?.user?.role) {
          token.role = session.user.role;
          token.hasData = session.user.hasData;
          token.isVerified = session.user.isVerified;
        }
      }
      if (user) {
        const id = user.id as string;
        const dbUser = await fetchUserRole(id);

        if (dbUser) {
          token.name = dbUser.name || "";
          token.role = dbUser.role;
          token.isVerified = dbUser.UserInput?.isVerified || false;
          token.hasData = dbUser.UserInput ? true : false;
        }

        return token;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.name = token.name;
        session.user.role = token.role;
        session.user.isVerified = token.isVerified;
        session.user.hasData = token.hasData;
      }
      return session;
    },
  },

  providers: [
    CredentialsProvider({
      name: "Log In",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "JohnDoe@example.com",
        },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        try {
          const dbUser = await prisma.user.findFirst({
            where: { email: credentials.email },
          });

          if (dbUser) {
            const passwordMatch = await bcrypt.compare(
              credentials.password as string,
              dbUser.password
            );

            if (!passwordMatch) return null;
            else {
              return {
                role: "",
                email: dbUser.email,
                id: dbUser.id,
                name: dbUser.name,
                status: "",
                permissions: [],
                isVerified: false,
                hasData: false,
              };
            }
          }
          return null;
        } catch (err) {
          if (err instanceof Error) {
            console.log(err);

            throw new Error("There was an error!");
          } else {
            console.log(err);

            throw new Error("There was an error!");
          }
        }
      },
    }),
  ],
});
