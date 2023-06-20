import { User } from '@prisma/client';
import { prisma } from '@/lib/db/prisma-global';
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider, { CredentialInput, CredentialsConfig} from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { FrontendMapper } from "@/lib/util/map/frontend-mapper";
import { FrontendUser } from "@/lib/types/frontend-user.type";
import NextAuth from "next-auth/next";

const gitHubProvider = GitHubProvider({
  clientId: process.env.GITHUB_ID ?? "changeMe",
  clientSecret: process.env.GITHUB_SECRET ?? ""
});

const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID?? "changeMe",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
});

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
  }
});


/**
 * This `authOptions` object contains
 * the configuration for our authentication process.
 */
export const authOptions: NextAuthOptions = {
  // General options for session
  session: {
    // We are going to use jwt as auth Method.
    // The Session Object will be stored as a cookie.
    strategy: "jwt",

    // The time in seconds until an idle session expires and is no longer valid
    maxAge: 60 * 60 * 24, // 24 hours
  },

  // Specific options for the jwt token itself.
  jwt: {
    // The Maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to session.maxAge.
    // But I'm paranoid, so I'm going to set it to the same value
    // as session.maxAge manually.
    maxAge: 60 * 60 * 24, // 24 hours
  },

  // The Array of Credential Providers (i.e Sign-In Options)
  providers: [localCredentialsProvider, googleProvider, gitHubProvider],

  // Provide an emergency fallback secret, just in case.
  secret: process.env.NEXTAUTH_SECRET ?? "TkVYVEpT",


  // Configuration for login pages should go here.
  pages: {
    signIn: "/login",
  },

  // NextAuth provides 2 callbacks:
  // `jwt` and `session` that allow us
  // to add our own custom information
  // to the session object.
  callbacks: {
    session: async ({session} : {session: Session}) => {

      if(session.user?.email) {
        let backendUser: User | null = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
        });

        if(backendUser) {
          let frontendUser: FrontendUser = new FrontendMapper().mapToType(backendUser);

          return {
            ...session,
            user: frontendUser,
          };

        }

      }

      return session;
    },
  }
};

