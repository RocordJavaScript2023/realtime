import NextAuth from "next-auth/next";
import { authOptions } from "@/app/config/auth/authoptions";

/**
 * This creates an API handler
 */
const handler = NextAuth(authOptions);


/**
 * Here we export it simply as GET and POST
 */
export { handler as GET, handler as POST, authOptions };