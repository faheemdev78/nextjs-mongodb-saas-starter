import "server-only";

import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { authConfig, githubProvider } from "@/lib/auth.config";
import { connectDB } from "@/lib/db";
import { mongooseAdapter } from "@/lib/mongoose-adapter";
import type { UserRole } from "@/lib/roles";
import { credentialsSchema } from "@/lib/validators";
import { User } from "@/models/user";

function asRole(role: unknown): UserRole {
  return role === "admin" ? "admin" : "user";
}

const github = githubProvider();

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: mongooseAdapter(),
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = asRole(user.role);
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
  },
  providers: [
    ...(github ? [github] : []),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        await connectDB();
        const user = await User.findOne({ email: parsed.data.email }).select(
          "+passwordHash",
        );
        if (!user?.passwordHash) return null;

        const valid = await compare(parsed.data.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: asRole(user.role),
        };
      },
    }),
  ],
});
