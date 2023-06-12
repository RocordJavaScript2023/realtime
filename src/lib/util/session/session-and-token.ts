import { UserSessionAndToken } from "@/lib/types/user-session-and-token";
import { AuthOptions, Session, getServerSession } from "next-auth";
import { JWT, getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getUserSessionAndToken(authOptions: AuthOptions, request: NextRequest): Promise<UserSessionAndToken | null> {
    const userSession: Session | null = await getServerSession(authOptions);
    const userToken: JWT | null = await getToken({ req: request });

    return {
        ...userSession,
        ...userToken,
    };
}