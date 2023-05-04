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
import { FrontendMapper } from "@/lib/util/map/frontend-mapper";

/**
 * As Credentials for Authentication,
 * we'll use a user's email and password.
 * TODO:
 * https://codevoweb.com/setup-and-use-nextauth-in-nextjs-13-app-directory/
 * https://codevoweb.com/nextjs-use-custom-login-and-signup-pages-for-nextauth-js/
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

    const frontendMapper = new FrontendMapper();

    const frontendUser = frontendMapper.mapToType(user);

    return frontendUser;
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
  // TODO: evaluate if information about servers,
  // rooms and friends could be transmitted this way.
  callbacks: {
    session: ({ session, token }: { session: Session; token: JWT }) => {
      console.log("Session Callback", { session, token });
      return {
        ...session,
        user: {
          ...session.user,
        },
        token: {
          ...token
        }
      };
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
