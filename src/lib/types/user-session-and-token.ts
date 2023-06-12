import type { Session } from "next-auth";
import type { JWT } from "next-auth/jwt";

export type UserSessionAndToken = Session & JWT;