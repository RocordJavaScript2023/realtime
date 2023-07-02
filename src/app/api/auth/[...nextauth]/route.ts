import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth/authoptions";
import { AuthOptions } from "next-auth";

/**
 * This creates an API handler
 */
const handler = NextAuth(authOptions as AuthOptions);


/**
 * Here we export it simply as GET and POST
 */
export { handler as GET, handler as POST, authOptions };