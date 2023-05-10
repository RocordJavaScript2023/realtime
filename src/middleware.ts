import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Session, getServerSession } from "next-auth";
import { NextURL } from "next/dist/server/web/next-url";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { JWT, getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {

    const userSession: Session | null = await getServerSession(authOptions);
    const userToken: JWT | null = await getToken({ req: request });
    const requestUrl: string = request.url;

    if(userSession !== null && typeof userSession !== 'undefined') {

        return NextResponse.next();

    }

    return NextResponse.redirect(new NextURL('/login'));
}

export const config = {
    matcher: [

    ]
};