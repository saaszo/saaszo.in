import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side auth guard for protected routes.
 *
 * Checks for the `saaszo_session` marker cookie — set by the backend on every
 * successful login (Google, email, phone). If missing, the user hasn't signed
 * in yet and is redirected to `/auth?redirect=<intended_path>`.
 *
 * NOTE: This is a lightweight gate — full token validation still happens
 * client-side in AuthProvider. The cookie check prevents the flash of
 * dashboard content that occurs when the auth guard is purely client-side.
 */
export function middleware(request: NextRequest) {
  const hasSession = request.cookies.get("saaszo_session");

  if (!hasSession) {
    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
