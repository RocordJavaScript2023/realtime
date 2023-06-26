import { User as PrismaUser, Server } from "@prisma/client";
import { prisma } from "@/lib/db/prisma-global";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { v4 as uuid } from "uuid";
import type {
  Account,
  NextAuthOptions,
  Profile,
  Session,
  User,
} from "next-auth";
import CredentialsProvider, {
  CredentialInput,
  CredentialsConfig,
} from "next-auth/providers/credentials";
import { compare, hashSync } from "bcryptjs";
import { FrontendMapper } from "@/lib/util/map/frontend-mapper";
import { UserDTO } from "../types/dto/user-dto";
import { AdapterUser } from "next-auth/adapters";

const gitHubProvider = GitHubProvider({
  clientId: process.env.GITHUB_ID ?? "changeMe",
  clientSecret: process.env.GITHUB_SECRET ?? "",
});

const googleProvider = GoogleProvider({
  clientId: process.env.GOOGLE_CLIENT_ID ?? "changeMe",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
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

    const user: PrismaUser | null = await prisma.user.findUnique({
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
    session: async ({ session }: { session: Session }) => {
      if (session.user?.email) {
        let backendUser: PrismaUser | null = await prisma.user.findUnique({
          where: {
            email: session.user.email,
          },
        });

        if (backendUser) {
          let frontendUser: UserDTO = new FrontendMapper().mapToType(
            backendUser
          );

          return {
            ...session,
            user: frontendUser,
          };
        }
      }

      return session;
    },
    // Controls what happens on sign in.
    signIn: async ({
      user,
      account,
      profile,
      email,
      credentials,
    }: {
      user: User | AdapterUser;
      account: Account | null;
      profile?: Profile | undefined;
      email?: { verificationRequest?: boolean | undefined } | undefined;
      credentials?: Record<string, CredentialInput> | undefined;
    }): Promise<string | boolean> => {
      // If the user is provided to us from an external website,
      // persist him to the database in order to be able to
      // look up his information later on during interactions with the session.
      if (account !== null && typeof account !== "undefined") {
        // If the provider for the account is not our own CredentialsProvider
        // then the user must come from an external service and has to be persisted.
        if (account.provider !== "credentials") {
          if (
            user !== null &&
            typeof user !== "undefined" &&
            user.email !== null &&
            typeof user.email !== "undefined" &&
            user.name !== null &&
            typeof user.name !== "undefined"
          ) {
            // check if the account has already been persisted.
            const alreadyPersistedUser: PrismaUser | null =
              await prisma.user.findUnique({
                where: { email: user.email },
              });

            if (alreadyPersistedUser === null) {
              // then the user has not yet been persisted.
              // and we are persisting him as a user, just without a password, since
              // that comes from the external service.
              const defaultServer: Server | null = await prisma.server.findFirst();

              const createUserAction: PrismaUser | null = await prisma.user.create({
                data: {
                  name: user.name,
                  email: user.email,
                  password: hashSync(uuid(), 10),
                  picture: user.image ?? `https://robohash.org/${user.name}`,
                  servers: {
                    connect: {
                      id: defaultServer?.id ?? "0",
                    },
                  },
                },
              });

              if (createUserAction !== null && typeof createUserAction !== 'undefined') {
                return true;
              } else {

                // just in case, so we know when something goes wrong.
                return false;
              }
            }
          }
        }
      }

      return true;
    },
  },
};
