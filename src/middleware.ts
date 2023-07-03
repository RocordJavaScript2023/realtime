import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked 'async' if using 'await' inside
export async function middleware(request: NextRequest) {
  

  const nextAuthSessionToken: RequestCookie | undefined = request.cookies.getAll().find((cookie: RequestCookie) => {
    return cookie.name === 'next-auth.session-token';
  });

  const nextAuthCSRFToken: RequestCookie | undefined = request.cookies.getAll().find((cookie: RequestCookie) => {
    return cookie.name === 'next-auth.csrf-token';
  });

  const hasSessionToken: boolean = (nextAuthSessionToken !== null && typeof nextAuthSessionToken !== 'undefined');
  const hasAuthCSRFToken: boolean = (nextAuthCSRFToken !== null && typeof nextAuthCSRFToken !== 'undefined');

  if (hasSessionToken || hasAuthCSRFToken) {

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
    '/api/openai/:path*',
    '/api/huggingface/:path*',
    '/users/',
    '/chats',
    '/profile',
  ],
}