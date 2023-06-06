import NextAuth from "next-auth/next";
import type { NextAuthOptions, Session } from "next-auth";
import { User } from '@prisma/client';
import { prisma } from "@/lib/db/prisma-global";
import GitHubProvider from "next-auth/providers/github";

// The `CredentialsProvider` Module is used for validation
import CredentialsProvider, {
    CredentialInput,
    CredentialsConfig,
} from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { FrontendMapper } from "@/lib/util/map/frontend-mapper";
import { FrontendUser } from "@/lib/types/frontend-user.type";

const gitHubProvider = GitHubProvider({
    clientId: process.env.GITHUB_ID ?? "changeMe",
    clientSecret: process.env.GITHUB_SECRET ?? ""
});


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
    providers: [localCredentialsProvider,gitHubProvider],

    // Provide an emergency fallback secret, just in case.
    secret: process.env.NEXTAUTH_SECRET ?? "TkVYVEpT",

    // NextAuth provides 2 callbacks:
    // `jwt` and `session` that allow us
    // to add our own custom information
    // to the session object.
    // TODO: evaluate if information about servers,
    // rooms and friends could be transmitted this way. (Probably extremely unsecure)
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

/**
 * This creates an API handler
 */
const handler = NextAuth(authOptions);

/**
 * Here we export it simply as GET and POST
 */
export { handler as GET, handler as POST };
