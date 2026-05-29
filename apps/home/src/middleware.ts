import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * SaaSzo Portal — Auth Middleware
 *
 * Cookie-based session guard running at the Edge (www.saaszo.in only).
 *
 * AUTH COOKIE: "saaszo_session=1"
 *   Set by persistAccessToken() in auth-client.ts on every successful login.
 *
 * Rules:
 * 1. Request on apex saaszo.in (no www)   → pass through (canonical redirect in next.config.ts handles it)
 * 2. Logged-in user visiting /auth or /register → redirect to /dashboard  ✅
 * 3. Guest visiting /dashboard/**               → redirect to /auth        ✅
 *
 * IMPORTANT: Always redirect to https://www.saaszo.in/... to stay on the
 * canonical host. Using relative redirects on the apex domain would send
 * users to saaszo.in/auth and create a loop.
 */

const SESSION_COOKIE = "saaszo_session";
const WWW_ORIGIN     = "https://www.saaszo.in";
const DASHBOARD_PATH = "/dashboard";
const AUTH_PATH      = "/auth";

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
  "/manifest",
];

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl;

  // ── 1. Skip apex domain (saaszo.in without www) ──────────────────────────
  // next.config.ts already has a permanent redirect from saaszo.in → www.saaszo.in.
  // If we intercept here we would produce saaszo.in/auth?redirect=… (apex URL)
  // which sends users to the login page even when they are already logged in.
  if (host === "saaszo.in") {
    return NextResponse.next();
  }

  // ── 2. Skip static / fully public paths ──────────────────────────────────
  if (SKIP_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const isLoggedIn =
    request.cookies.has(SESSION_COOKIE) &&
    request.cookies.get(SESSION_COOKIE)?.value === "1";

  // ── 3. Auth pages (/auth, /register) ─────────────────────────────────────
  // Already logged in → skip login, go straight to dashboard
  if (AUTH_ROUTES.some((p) => pathname.startsWith(p))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DASHBOARD_PATH, WWW_ORIGIN));
    }
    return NextResponse.next();
  }

  // ── 4. Protected pages (/dashboard/**) ───────────────────────────────────
  // Not logged in → redirect to auth with the intended destination
  if (pathname.startsWith(DASHBOARD_PATH)) {
    if (!isLoggedIn) {
      const authUrl = new URL(AUTH_PATH, WWW_ORIGIN);
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
