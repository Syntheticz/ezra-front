import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT, JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      name: string;
      email: string;
      isVerified: boolean;
      hasData: Boolean;
    } & DefaultSession;
  }

  interface User extends DefaultUser {
    role: string;
    name: string;
    email: string;
    isVerified: boolean;
    hasData: Boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: string;
    email: string;
    name: string;
    isVerified: boolean;
    hasData: Boolean;
  }
}
