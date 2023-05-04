import NextAuth from "next-auth/next";
import type { NextAuthOptions, Session } from "next-auth";
import { prisma } from "@/lib/db/prisma-global";

// The `CredentialsProvider` Module is used for validation
import CredentialsProvider, {
  CredentialInput,
  CredentialsConfig,
} from "next-auth/providers/credentials";
import { User } from "@prisma/client";
import { compare } from "bcryptjs";
import { JWT } from "next-auth/jwt/types";
import { AdapterUser } from "next-auth/adapters";

/**
 * As Credentials for Authentication,
 * we'll use a user's email and password.
 * https://codevoweb.com/setup-and-use-nextauth-in-nextjs-13-app-directory/
 */
const localCredentialsProvider: CredentialsConfig<
  Record<string, CredentialInput>
> = CredentialsProvider({
  name: "Local Account",
  credentials: {
    email: {
      label: "Email",
      type: "email",
      placeholder: "example@example.com",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials.password) {
      return null;
    }

    const user: User | null = await prisma.user.findUnique({
      where: {
        email: credentials.email,
      },
    });

    if (!user || !(await compare(credentials.password, user.password))) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      randomKey: "CHANGE_ME",
    };
  },
});

/**
 * This `authOptions` object contains
 * the configuration for our authentication process.
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [localCredentialsProvider],
  secret: process.env.NEXTAUTH_SECRET,
  // NextAuth provides 2 callbacks:
  // `jwt` and `session` that allow us
  // to add our own custom information
  // to the session object.
  // TODO: evaluate if information about servers and
  // rooms could be transmitted this way.
  callbacks: {
    session: ({ session, token }: { session: Session; token: JWT }) => {
      console.log("Session Callback", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
    jwt: ({ token, user }: { token: JWT; user: User | AdapterUser }) => {
      console.log("JWT Callback", { token, user });
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
};

/**
 * This creates an API handler
 */
const handler = NextAuth(authOptions);

/**
 * Here we export it simply as GET and POST
 */
export { handler as GET, handler as POST };
