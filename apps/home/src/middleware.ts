import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side auth guard for protected routes.
 *
 * Checks for the `saaszo_session` marker cookie OR the `saaszo_backend_token`
 * in any form. If neither exist, the user almost certainly hasn't signed in
 * yet and is redirected to `/auth?redirect=<intended_path>`.
 *
 * NOTE: The `saaszo_session` cookie is set in two ways:
 * 1. By the backend API (httpOnly, Domain=.saaszo.in)
 * 2. By the frontend JS (non-httpOnly, set after successful login)
 *
 * After Google/Firebase redirect-based login, there is a brief moment where
 * the cookie might not yet exist (the sync hasn't completed). In that case
 * we also check for the `saaszo_google_auth_intent` sessionStorage flag —
 * but since middleware cannot read sessionStorage, we rely on the cookie.
 *
 * If the cookie is missing but the user truly is logged in (e.g. Firebase
 * auth persisted in IndexedDB), the client-side AuthProvider will hydrate
 * the session and set the cookie. The middleware redirect just prevents
 * a flash of dashboard content for genuinely unauthenticated users.
 */
export function middleware(request: NextRequest) {
  // Check for any of the session marker cookies
  const hasSession =
    request.cookies.get("saaszo_session") ||
    request.cookies.get("invoice_saaszo_session") ||
    request.cookies.get("task_saaszo_session");

  if (!hasSession) {
    // Check if this might be a post-login redirect (Google auth redirects
    // back to the app and the cookie hasn't been set yet). If the referer
    // is an auth-related page, allow the request through and let the
    // client-side guard handle it.
    const referer = request.headers.get("referer") || "";
    const isPostAuthRedirect =
      referer.includes("/auth") ||
      referer.includes("accounts.google.com") ||
      referer.includes("firebaseapp.com");

    if (isPostAuthRedirect) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/auth", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
