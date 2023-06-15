import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked 'async' if using 'await' inside
export async function middleware(request: NextRequest) {
  console.log('middleware running');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * Match all request paths except for the ones starting with:
     * - api/auth (next-auth routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico ( favicon file)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
}