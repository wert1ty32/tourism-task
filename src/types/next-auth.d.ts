import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role: "admin" | "employee";
    mustChangePassword: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: "admin" | "employee";
      mustChangePassword: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "employee";
    mustChangePassword: boolean;
  }
}
