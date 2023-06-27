import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked 'async' if using 'await' inside
export async function middleware(request: NextRequest) {
  

  const nextAuthSessionToken: RequestCookie | undefined = request.cookies.getAll().find((cookie: RequestCookie) => {
    return cookie.name === 'next-auth.session-token';
  });

  if (nextAuthSessionToken !== null && typeof nextAuthSessionToken !== 'undefined') {

    return NextResponse.next();
  }

  return NextResponse.json({
    status: "401-unauthorized",
  }, {
    status: 401,
  });
}

export const config = {
  matcher: [
    '/api/message/:path*',
    '/api/room/:path*',
    '/api/server/:path*',
    '/api/session/:path*',
    '/api/user/:path*',
    '/api/completion/:path*',
  ],
}