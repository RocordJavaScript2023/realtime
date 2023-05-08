/**
 * Based off of: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices#solution
 *
 * In development, the command "next dev" clears the NodeJS cache on run.
 * This in turn initializes a new PrismaClient instance each time due to hot reloading that
 * creates a connection to the database.
 * 
 * This can quickly exhaust the database connections as each PrismaClient instance holds its own 
 * connection pool.
 * 
 * The solution in this case is to instantiate a single 
 * instance PrismaClient and save it on the global object.
 * 
 * Docs on NodeJS global object: https://nodejs.org/api/globals.html#globals_global
 * 
 * In short: the 'global' object exposes a variety of useful properties about the environment.
 * Also, this is the place where functions such as 'setImmediate' and 'clearTimeout' are located.
 * 
 * Then we keep a check to only instantiate PrismaClient if it's not on the
 * global object. Otherwise we use the same instance again if already present
 * to prevent instantiating extra PrismaClient instances.
 * 
 * 
 * You can then import this global PrismaClient instance anywhere in 
 * our Application as follows:
 * 
 * for example in src/app/page.tsx
 * 
 * import { prisma } from '@/db';
 * 
 * async function getUserPosts(userId) {
 *  const posts = await prisma.post.findMany({
 *      where: {
 *          author: { id: userId },
 *      }
 *  });
 * 
 * return posts;
 * }
 * 
 * 
 */


import { PrismaClient } from '@prisma/client';

/**
 * Here we save the global PrismaClient instance to the 
 * global object.
 */
const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined,
};

/**
 * Here we export our prisma client
 * and also check if the global object already has a
 * PrismaClient instance. If not, we create one.
 */
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: ['query'],
});

/**
 * This check ensures, that if the environment does not contain
 * the variable NODE_ENV=production. If so, then we must be 
 * in a dev environment and should therefore set the globalForPrisma.prisma
 * property to our exported constant.
 */
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;