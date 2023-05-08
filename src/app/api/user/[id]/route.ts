import { NextRequest, NextResponse } from "next/server";
import { Session, getServerSession } from "next-auth";
import { FrontendUser } from "@/lib/types/frontend-user.type";
import { FrontendMapper } from "@/lib/util/map/frontend-mapper";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db/prisma-global";
import { User } from "@prisma/client";
import { unauthorized } from "@/lib/response/responses";
import { JWT, getToken } from "next-auth/jwt";
import { hash } from "bcryptjs";

function validUserSession(session: { user: FrontendUser } | null | undefined, token: JWT | null): Boolean {

    // TODO: unsecure, validate the session at least.
    if(!(session === null) && !(typeof session === 'undefined')) {
        if(token) {
            return true;
        }
    }

    return false;
}

/**
 * GET Info about a User with given [id]
 * 
 * Will only return information if the user can present a valid 
 * Session. Otherwise 401-Unauthorized will be returned.
 * 
 * @param request NextRequest
 * @param param1 Dynamic section
 * @returns Promise<NextResponse>
 */
export async function GET(request: NextRequest,{ params }: {params: { id: string }}) : Promise<NextResponse> {

    const session: {user: FrontendUser} | null = await getServerSession(authOptions);
    const token: JWT | null = await getToken({ req: request });

    console.log(session);

    if(validUserSession(session, token)) {
        // TODO: Continue here
    }

    return unauthorized();
}

// TODO: Necessary?
export async function POST(): Promise<NextResponse> {

    return unauthorized();
}