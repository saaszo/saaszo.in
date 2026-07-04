# saaszo.in — Home App (Auth Portal) — Agent Reference

> **Read this before touching ANY auth, session, redirect, or navigation code.**
> Last updated: 2026-07-04

---

## Architecture Overview

`saaszo.in` (home app) is the **central auth portal** for the SaaSzo platform.

```
User → www.saaszo.in  (this app, Next.js 15, App Router)
       ├─ /auth            Login (email + password, Google popup/redirect, Mobile OTP)
       ├─ /register        Email signup (OTP verification + account creation)
       ├─ /forgot-password Password reset request
       ├─ /reset-password  Password reset with OTP code
       ├─ /dashboard       Main hub (product launcher, workspace settings)
       └─ /dashboard/setup Onboarding wizard (new users only)
```

**Backend:** `https://api.saaszo.in/api` (Laravel Sanctum + Bearer tokens)
**Firebase:** Used ONLY for Google OAuth and Mobile OTP (phone number sign-in)
**Product apps:** `hrms.saaszo.in`, `task.saaszo.in`, `invoice.saaszo.in`, `seller.saaszo.in`, `engage.saaszo.in`

---

## The Golden Rules (NEVER violate these)

### Rule 1 — Always navigate to `www.saaszo.in`, never use relative paths for auth redirects

```ts
// CORRECT — forces canonical domain
window.location.replace("https://www.saaszo.in/auth?redirect=/dashboard");
navigateTo("/auth"); // navigateTo() from auth-client.ts always prepends appConfig.appUrl

// WRONG — stays on whatever domain the browser is currently on
router.replace("/auth?redirect=...");
// If user is on saaszo.in (apex) → goes to saaszo.in/auth → middleware skips apex → loop!
```

**Why this matters:**
- `next.config.ts` has a `saaszo.in → www.saaszo.in` redirect but it only fires on fresh
  server-side (HTTP) requests
- `router.replace()` is a client-side Next.js navigation — it STAYS on the current domain
- Middleware explicitly skips apex: `if (host === "saaszo.in") return NextResponse.next()`
- `sessionStorage` is origin-scoped: tokens stored on `www.saaszo.in` are NOT accessible
  on `saaszo.in` — causing auth failures and redirect loops

### Rule 2 — signOut must use `window.location.replace()` with absolute URL

```ts
// CORRECT (in AuthProvider.tsx signOut)
const wwwOrigin = new URL(appConfig.appUrl).origin; // "https://www.saaszo.in"
window.location.replace(`${wwwOrigin}/auth`);

// WRONG (previous bug — stays on saaszo.in if user was there)
router.replace("/auth");
startTransition(() => { router.replace("/auth"); });
```

### Rule 3 — DashboardLayout must use `window.location.replace()` for redirects

```ts
// CORRECT
const wwwOrigin = new URL(appConfig.appUrl).origin;
window.location.replace(`${wwwOrigin}/auth?redirect=${encodeURIComponent(target)}`);
window.location.replace(`${wwwOrigin}/dashboard/setup`);

// WRONG
router.replace(`/auth?redirect=...`);
router.replace("/dashboard/setup");
```

### Rule 4 — Set navigatingRef BEFORE calling navigateTo() in flows watched by useEffects

```ts
// CORRECT (prevents double-navigation race condition)
navigatingRef.current = true;
navigateTo(consumePostSetupRedirect("/dashboard?tab=settings"));

// WRONG — useEffect fires simultaneously with navigateTo()
navigateTo(consumePostSetupRedirect("/dashboard?tab=settings")); // no ref guard
```

---

## Session & Token Architecture

### Storage Keys

| Key | Storage | Purpose |
|-----|---------|---------|
| `saaszo_backend_token` | `sessionStorage` (www.saaszo.in origin) | Bearer access token from Laravel backend |
| `saaszo_session=1` | Cookie on `.saaszo.in` + `www.saaszo.in` | Middleware presence marker. NO Max-Age (session cookie) |
| `saaszo_home_last_activity` | `localStorage` | Idle logout tracking (8h timeout) |
| `saaszo_home_device_id` | `localStorage` | Persistent device fingerprint for API requests |
| `saaszo.setup_redirect_bypass` | `sessionStorage` | Bypass onboarding redirect for 5 mins after setup completion |
| `saaszo_google_auth_intent` | `sessionStorage` + cookie | Signals a Google redirect-flow is in progress |
| `saaszo_post_setup_redirect` | `sessionStorage` | Target URL to redirect to after onboarding completes |

### Cookie Lifetime — CRITICAL

```
saaszo_session=1; Path=/; SameSite=Lax   (NO Max-Age = browser session lifetime)
```

**Intentionally NO Max-Age.** The old code used `Max-Age=30days` which outlived the
`sessionStorage` token (which dies when the tab closes). This caused middleware to admit
users whose backend sessions were actually expired, leading to auth loops in DashboardLayout.
Now cookie lifetime = sessionStorage lifetime = browser session.

### Auth State Flow (AuthProvider mount)

```
App mounts → loading: true
│
├── Apex domain detected (hostname = "saaszo.in")?
│     └── window.location.replace("https://www.saaszo.in/...") → ends here
│
├── Firebase initialized?
│     ├── YES → hydrateRedirectResult() + onIdTokenChanged listener
│     │     ├── Google redirect result? → syncFirebaseUserSession() → navigateAfterAuth()
│     │     └── Firebase user (existing session)? → syncFirebaseUserSession() → authenticated
│     │
│     └── NO Firebase → hydrateStoredBackendToken() directly
│
└── hydrateStoredBackendToken():
      ├── Has sessionStorage token? → hydrateBackendSession(token) → authenticated ✓
      │     └── 401? → try hydrateCookieSession() → fail? → clearStoredBackendToken() → signedOut
      │
      ├── No token + has saaszo_session cookie? → hydrateCookieSession() → authenticated ✓
      │     └── fail? → clearStoredBackendToken() → signedOut
      │
      ├── No token + no cookie + googleRedirectIntent? → loading stays true (waiting for redirect)
      │
      └── Nothing → setState(signedOutState) → loading: false, authenticated: false
```

---

## All Auth Flows — Complete Reference

### Flow 1: Email Sign-In (`/auth` page, Email tab)

```
User: email + password → handleEmailSubmit()
  └── signInWithEmail(email, password, { redirect, remember: true })
        ├── POST /auth/login
        ├── hydrateBackendSession(accessToken)  → sets state: authenticated=true
        ├── setStoredBackendToken(accessToken)  → sessionStorage + cookie
        └── navigateAfterAuth(router, redirectUrl)
              ├── onboarding not done → /dashboard/setup
              └── onboarding done → redirectUrl or /dashboard
```

**Errors handled:** wrong password, account locked (LOCKOUT), not registered → throws, caught in UI

---

### Flow 2: Email Sign-Up (`/register` page)

```
User: name + company + email OTP + password → handleSubmit()
  ├── navigatingRef.current = true  ← CRITICAL: prevents auth useEffect from double-navigating
  └── signUpWithEmail(email, password, name, companyName, { redirect })
        ├── POST /auth/register (with email_verified_via: "otp")
        ├── hydrateBackendSession(accessToken)
        ├── setStoredBackendToken(accessToken)
        └── navigateAfterAuth(router, "/dashboard/setup")  ← always setup for new users
              └── window.location.replace("https://www.saaszo.in/dashboard/setup")

  → /dashboard/setup (OnboardingWorkspace)
        └── handleSetupComplete()
              ├── markSetupRedirectBypass()      → sessionStorage bypass flag
              ├── setOnboardingState({ setup_completed: true })
              ├── void reloadUser().catch(() => {})  ← fire-and-forget (abandoned on nav)
              ├── navigatingRef.current = true   ← suppresses setupAlreadyResolved useEffect
              └── navigateTo(consumePostSetupRedirect("/dashboard?tab=settings"))
                    └── window.location.href = "https://www.saaszo.in/dashboard?tab=settings"

  → /dashboard?tab=settings
        ├── Middleware: saaszo_session cookie present → allows ✓
        ├── AuthProvider: saaszo_backend_token in sessionStorage → hydrateBackendSession() ✓
        └── Dashboard renders ✓
```

---

### Flow 3: Google Sign-In (Popup → Redirect fallback)

```
handleGoogleSignIn() → signInWithGoogle()
  ├── PRIMARY: signInWithPopup(auth, GoogleAuthProvider)
  │     ├── SUCCESS: syncFirebaseUserSession(result.user)
  │     │     ├── POST /auth/sync (Firebase ID token)
  │     │     ├── setStoredBackendToken(sanctumToken)  ← also sets saaszo_session cookie
  │     │     └── navigateAfterAuth(router, target)
  │     └── FAIL popup-blocked / cancelled-popup-request:
  │           ├── setGoogleRedirectIntent()  ← sessionStorage + cookie signal
  │           └── signInWithRedirect(auth, provider)  ← page navigates to Google
  │
  └── ON RETURN from Google redirect:
        └── hydrateRedirectResult() (AuthProvider useEffect on mount)
              ├── getRedirectResult(auth) → result.user
              ├── syncFirebaseUserSession(result.user)
              ├── clearGoogleRedirectIntent()
              └── navigateAfterAuth(router, target)
```

**New user via Google:** `setup_completed: false` → `/dashboard/setup`
**Existing user:** `setup_completed: true` → `/dashboard`

---

### Flow 4: Mobile OTP Sign-In (`/auth` page, Mobile OTP tab)

```
User: +91 XXXXXXXXXX → handleSendOtp()
  └── ensureRecaptcha() → invisible reCAPTCHA
      sendPhoneOtp("+91XXXXXXXXXX", verifier) → Firebase signInWithPhoneNumber()
      → setConfirmationResult(result) → phoneStep = "otp"

User: 6-digit OTP → handleVerifyOtp()
  └── confirmationResult.confirm(code)
      → Firebase onIdTokenChanged fires in AuthProvider
      → syncFirebaseUserSession(user)  → POST /auth/sync
      → setStoredBackendToken(sanctumToken)
      → navigateAfterAuth(router, target)
      → phoneStep = "success" (UI feedback)
```

**Note:** Mobile OTP uses Firebase phone auth. The backend `/auth/sync` endpoint either
finds the matching account by phone or creates a new one (backend-configured behavior).

---

### Flow 5: Sign-Out

```
User: Logout button → signOut() (from useAuthSession)
  ├── signOutInProgressRef.current = true  ← blocks onIdTokenChanged re-hydration
  ├── POST /auth/logout (Bearer token)
  ├── clearStoredBackendToken()  → removes sessionStorage token + cookie
  ├── setBackendToken(null)
  ├── firebaseSignOut(auth)  ← if Firebase user
  ├── setState(signedOutState)
  ├── window.location.replace("https://www.saaszo.in/auth")  ← ABSOLUTE URL
  └── after 1s: signOutInProgressRef.current = false
```

---

### Flow 6: Session Restore (Tab Reopen / Page Refresh)

```
Fresh page load: www.saaszo.in/dashboard
  ├── Middleware: saaszo_session=1 cookie → allows through ✓
  └── AuthProvider mounts (loading: true)
        └── onIdTokenChanged:
              ├── Firebase user active → syncFirebaseUserSession() → authenticated ✓
              └── No Firebase user → hydrateStoredBackendToken()
                    ├── sessionStorage token → hydrateBackendSession() → authenticated ✓
                    ├── No token + cookie → hydrateCookieSession() → authenticated ✓
                    └── Nothing → signedOut → DashboardLayout redirects to /auth
```

**DashboardLayout grace timer:**
- `loading=false` + `authenticated=false` + `saaszo_session cookie present`:
  → Wait 3 seconds (Firefox/Safari need time for onIdTokenChanged to fire)
- `loading=false` + `authenticated=false` + NO cookie:
  → Redirect immediately (user is genuinely signed out, no point waiting)

---

### Flow 7: Idle Logout (8h timeout)

```
AuthProvider (when authenticated=true):
  ├── Tracks activity: mousemove, keydown, click, scroll, touchstart
  ├── Updates saaszo_home_last_activity in localStorage on activity
  └── Every 60s: checks if Date.now() - lastActivity > 8 hours
        └── YES → signOut() → /auth
```

---

## Middleware Logic (`src/middleware.ts`)

```ts
function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl;

  // 1. Skip apex domain (handled by next.config.ts server-side redirect)
  if (host === "saaszo.in") return NextResponse.next();

  // 2. Skip static/public paths
  if (SKIP_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

  const isLoggedIn = cookies.get("saaszo_session")?.value === "1";

  // 3. AUTH_ROUTES: /auth, /register
  if (AUTH_ROUTES.some(p => pathname.startsWith(p))) {
    if (isLoggedIn) {
      const redirectParam = searchParams.get("redirect");
      if (redirectParam && isSameOrigin(redirectParam)) {
        // REDIRECT LOGGED-IN USER DIRECTLY TO TARGET
        // Do NOT let them see /auth page — that creates a loop when
        // DashboardLayout briefly bounces them here with ?redirect=
        return NextResponse.redirect(new URL(redirectParam, WWW_ORIGIN));
      }
      return NextResponse.redirect(new URL("/dashboard", WWW_ORIGIN));
    }
    return NextResponse.next(); // Show login/register page
  }

  // 4. Protected: /dashboard/**
  if (pathname.startsWith("/dashboard")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(`/auth?redirect=${encodeURIComponent(pathname + search)}`, WWW_ORIGIN)
      );
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}
```

---

## Files & Their Roles

| File | Role |
|------|------|
| `src/middleware.ts` | Edge auth guard — cookie check, runs before page renders |
| `src/components/AuthProvider.tsx` | ALL auth logic, session state, signIn/signUp/signOut |
| `src/lib/auth-client.ts` | Token/cookie utilities, `navigateTo()`, device ID |
| `src/lib/config.ts` | `appConfig.appUrl = "https://www.saaszo.in"` |
| `src/app/auth/page.tsx` | Login UI: email + password, Google, mobile OTP tabs |
| `src/app/register/page.tsx` | Signup: OTP email verify + account creation |
| `src/app/dashboard/layout.tsx` | Client-side dashboard guard, grace timer, setup redirect |
| `src/components/onboarding-workspace.tsx` | Onboarding wizard, `handleSetupComplete()`, `handleSkip()` |
| `src/app/forgot-password/page.tsx` | Password reset request (sends OTP) |
| `src/app/reset-password/page.tsx` | Password reset confirmation |
| `next.config.ts` | Canonical redirect `saaszo.in → www.saaszo.in` (server-side only!) |

---

## Environment Variables

```env
NEXT_PUBLIC_APP_NAME="SaaSzo"
NEXT_PUBLIC_APP_URL="https://www.saaszo.in"          # MUST be www, not apex domain
NEXT_PUBLIC_API_BASE_URL="https://api.saaszo.in/api"
NEXT_PUBLIC_FIREBASE_API_KEY="..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="..."
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
NEXT_PUBLIC_FIREBASE_APP_ID="..."
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="..."
NEXT_PUBLIC_FIREBASE_DATABASE_URL="..."
```

---

## Mistakes to NEVER Repeat

| ❌ WRONG | ✅ CORRECT | Why |
|----------|-----------|-----|
| `router.replace("/auth")` in signOut | `window.location.replace(wwwOrigin + "/auth")` | router.replace stays on current domain |
| `router.replace("/auth?redirect=...")` in DashboardLayout | `window.location.replace(wwwOrigin + "/auth?redirect=...")` | Same — must use absolute URL |
| `router.replace("/dashboard/setup")` in DashboardLayout | `window.location.replace(wwwOrigin + "/dashboard/setup")` | Same |
| `navigateTo()` without `navigatingRef.current = true` when useEffect watches auth state | Set `navigatingRef.current = true` first | Prevents double-navigation race |
| `middleware: if (?redirect=) NextResponse.next()` for logged-in users | Redirect to the `?redirect=` target directly | Prevents loop: DashboardLayout → /auth?redirect= → auth page renders → navigateTo → DashboardLayout → loop |
| `saaszo_session` cookie with `Max-Age=30days` | NO Max-Age (session cookie) | 30-day cookie outlives sessionStorage token → phantom auth |
| Clearing token without clearing cookie | Always call `clearStoredBackendToken()` which clears both | Cookie staying = middleware admits expired user |
| Relative path in `navigateAfterAuth()` fallback | `router.replace()` only if `window.location.origin === appOrigin` | Otherwise use `window.location.replace(appOrigin + path)` |

---

## Bug History (for context)

### Bug 1 — Signup → Redirect Loop (FIXED 2026-07-01, commit `f7388c9f`)

**Symptom:** After completing onboarding setup, user stuck in loop at `saaszo.in/auth?redirect=/dashboard?tab=settings`

**Root Cause:** `DashboardLayout` used `router.replace('/auth?redirect=...')` — a client-side navigation that stays on the current domain. If the user was on `saaszo.in` (apex), this produced `saaszo.in/auth?redirect=...`. Middleware skips apex domain. On `saaszo.in`, there's no sessionStorage token (different origin from www.saaszo.in), so auth fails, producing another redirect to `/auth?redirect=...` → infinite loop.

**Fix:** Changed `DashboardLayout` both redirects to use `window.location.replace(wwwOrigin + "/auth?redirect=...")` and `window.location.replace(wwwOrigin + "/dashboard/setup")`.

### Bug 2 — Middleware Passes Logged-In User to `/auth` Page (FIXED 2026-07-01, commit `5e8e1b13`)

**Symptom:** User with valid session hitting `/auth?redirect=...` sees the auth form briefly before being redirected.

**Root Cause:** Middleware had `if (searchParams.has("redirect")) return NextResponse.next()` — letting ALL users (including logged-in ones) through to the auth page when a redirect param was present. This was meant to handle stale sessions but caused a loop.

**Fix:** Middleware now checks `isLoggedIn` FIRST. If logged-in + has `?redirect=`, it validates and redirects directly to the target. Only passes through to auth page if NOT logged in.

### Bug 3 — Double Navigation After Signup (FIXED 2026-07-01, commit `5e8e1b13`)

**Symptom:** After signup, two simultaneous navigations would race, sometimes landing on wrong target.

**Root Cause:** `register/page.tsx` had a `useEffect` watching `authenticated` that would call `navigateTo()` RIGHT after `signUpWithEmail()` also called `navigateAfterAuth()`.

**Fix:** Added `navigatingRef.current = true` before `signUpWithEmail()` call. The useEffect checks this ref and skips if already navigating.

### Bug 4 — Double Navigation After Onboarding (FIXED 2026-07-01, commit `5e8e1b13`)

**Symptom:** After setup completion, `setupAlreadyResolved` useEffect fires simultaneously with explicit `navigateTo()` in `handleSetupComplete()`.

**Fix:** Added `navigatingRef.current = true` before `navigateTo()` in both `handleSetupComplete()` and `handleSkip()`. The `setupAlreadyResolved` useEffect checks this ref.

### Bug 5 — signOut stays on apex domain (FIXED 2026-07-04, commit pending)

**Symptom:** If user was on saaszo.in when signOut fires, `router.replace("/auth")` navigates to `saaszo.in/auth` instead of `www.saaszo.in/auth`.

**Fix:** Changed `signOut()` to use `window.location.replace("https://www.saaszo.in/auth")`.
