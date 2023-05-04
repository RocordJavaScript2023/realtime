import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import { OAuthConfig } from "next-auth/providers";
import GitHubProvider, { GithubProfile }  from "next-auth/providers/github";
import  CredentialsProvider  from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from '@/lib/db/prisma-global';


/**
 * TODO: We need to check if other sign in methods still
 * TODO: work when we are using this sign in method.
 * https://next-auth.js.org/providers/credentials
 * 
 * This `CredentialsProvider` allows us to handle signin 
 * with a local user. Meaning the users signing in with this 
 * Method have to be managed by us.
 * 
 * The Credentials provider is specified like any other next-auth provider.
 * The only exception here is that we need to define a handler function for 
 * `authorize()` that accepts credentials submitted via HTTP POST as input and
 * returns either:
 * 
 * 1. A User object, which indicates the credentials are valid.
 * - If we return an object it will be persisted to the JSON Web Token and the 
 *   user will be signed in, unless a custom signIn() callback is configured that
 *   subsequently rejects it.
 * 
 * 2. If we return `null` then an error will be displayed advising the user to check their
 *    details.
 * 
 * 3. If we throw an Error, the user will be sent to the error page with the error message as the
 *    query parameter.
 */
const customProvider = CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with Local")
    name: "Local",
    // `credentials` is used to generate a form on the sign in page.
    // We can specify which fields should be submitted, by adding keys to the `credentials` object.
    // For Example: domain, username, password, 2FA token etc.
    // We can pass any HTML attribute to the <input> tag through the object.
    credentials: {
        username: { label: "Username", type: "text", placeholder: "Username"},
        password: { label: "Password", type: "password" },
    },
    async authorize(credentials, req) {
        // HERE WE NEED TO ADD OUR OWN LOGIC TO LOOK UP THE USER FROM THE SUPPLIED 
        // CREDENTIALS!
        // TODO: Add functional logic.
        const user = { id: "1", name: "Placeholder_User", email: "placeholder.user@changeme.org" };

        if (user) {
            // Any object returned will be saved in the `user` property of the JWT
            return user;
        } else {
            // If we return null then an error will be displayed advising the user to check
            // their details.
            return null;

            // We could also reject this callback with an Error and the user will be sent to the error page.
        }
    }
})
/**
 * 
 */
const gitHub: OAuthConfig<GithubProfile> = GitHubProvider({
    clientId: process.env.GITHUB_ID ?? "NO_GITHUB_ID_PROVIDED!",
    clientSecret: process.env.GITHUB_SECRET ?? "NO_GITHUB_SECRET_PROVIDED!",
});

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt"
    },
    providers: [
        customProvider,
        gitHub,
    ],
    adapter: PrismaAdapter(prisma),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };