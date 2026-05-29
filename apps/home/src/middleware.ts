import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * SaaSzo Portal — Auth Middleware
 *
 * Cookie-based session guard running at the Edge.
 *
 * AUTH COOKIE: "saaszo_session=1"
 * Set by the portal backend (Laravel Sanctum) on successful login.
 *
 * Rules:
 * 1. Logged-in user visiting /auth or /register → redirect to /dashboard  ✅
 * 2. Guest visiting /dashboard/**               → redirect to /auth
 */

const SESSION_COOKIE  = "saaszo_session";
const DASHBOARD_PATH  = "/dashboard";
const AUTH_PATH       = "/auth";

// Auth/public pages — redirect to dashboard if already logged in
const AUTH_ROUTES = [AUTH_PATH, "/register"];

// Completely public — never touch
const SKIP_PATHS = [
  "/_next",
  "/api",
  "/favicon",
  "/icon",
  "/support",
  "/terms",
  "/privacy",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Skip static/public paths ─────────────────────────────────────────────
  if (SKIP_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isLoggedIn =
    request.cookies.has(SESSION_COOKIE) &&
    request.cookies.get(SESSION_COOKIE)?.value === "1";

  // ── Auth pages (/auth, /register) ─────────────────────────────────────────
  // Already logged in → skip login, go to dashboard
  if (AUTH_ROUTES.some((p) => pathname.startsWith(p))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DASHBOARD_PATH, request.url));
    }
    return NextResponse.next();
  }

  // ── Protected pages (/dashboard/**) ───────────────────────────────────────
  // Not logged in → redirect to auth
  if (pathname.startsWith(DASHBOARD_PATH)) {
    if (!isLoggedIn) {
      const authUrl = new URL(AUTH_PATH, request.url);
      authUrl.searchParams.set("redirect", pathname + request.nextUrl.search);
      return NextResponse.redirect(authUrl);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icon.*\\.png|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.webp).*)",
  ],
};
