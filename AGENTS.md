# AGENTS.md — SaaSzo Auth Architecture & Bug Fix Reference

> **Purpose:** This file documents the complete SaaSzo authentication architecture,
> the bugs that were identified and fixed, and the reasoning behind every change.
> Written for AI coding agents (Codex, Copilot, etc.) to understand the codebase
> and avoid introducing regressions.
>
> **See also:** [`/Users/pankaj/Desktop/saaszo/AGENTS.md`](../AGENTS.md) — monorepo-level
> architecture reference including the Golden Rule for product redirects, per-product
> auth patterns, and the step-by-step guide for adding new products.

---

## 1. Platform Overview

SaaSzo is a multi-product SaaS platform. All products share one auth system:

| App | URL | Role |
|-----|-----|------|
| **Auth Portal** | `https://www.saaszo.in` | Central login/signup, dashboard, settings |
| **API Backend** | `https://api.saaszo.in` | Laravel 11 API — Sanctum + Firebase Auth |
| **HRMS App** | `https://hrms.saaszo.in` | Has own login page + SSO handoff |
| **Invoice App** | `https://invoice.saaszo.in` | Has own login page + SSO handoff |
| **Task App** | `https://task.saaszo.in` | Has own login page + SSO handoff |
| **Seller App** | `https://seller.saaszo.in` | Has own login page + SSO handoff |
| **Connect App** | `https://connect.saaszo.in` | Has own login page + SSO handoff |
| **Admin Panel** | `https://admin.saaszo.in` | Admin-only access |

### ⚠️ Product Auth Redirect Rule (CRITICAL)

> When a user logs out of a product, or their session expires, they MUST be redirected to
> **that product's own `/login` page** — NEVER to `www.saaszo.in` or `www.saaszo.in/auth`.

`buildPortalLoginUrl()` is ONLY for the **"Sign in via SaaSzo Portal"** opt-in link shown
on a product's own `/login` page. It must NEVER appear in logout, session-expiry, or
middleware redirect paths.

### Domain Canonicalization
- Apex `saaszo.in` **always** redirects to `www.saaszo.in` (via next.config.ts redirect)
- Backend config normalizes `saaszo.in` → `www.saaszo.in` (in `config/saaszo.php`)
- All cookies are set on `.saaszo.in` (shared across all subdomains)

---

## 2. Authentication Methods

### 2a. Google Sign-in (Firebase Popup + Redirect Fallback)

```
User → clicks "Sign in with Google"
  → Try signInWithPopup(auth, GoogleAuthProvider) [100% Reliable, bypasses cookie blocks]
  → Popup completes and returns Firebase user
  → Fallback (if popup blocked): signInWithRedirect(auth)
      → Google OAuth consent screen → Redirect back to /auth
      → getRedirectResult(auth) returns Firebase user
  → POST /api/auth/sync { Authorization: Bearer <firebase_id_token> }
  → Backend verifies token via kreait/firebase-php
  → Finds or creates User + Company + Branch
  → Returns { access_token: <sanctum_token>, profile, onboarding, redirect }
  → Frontend stores sanctum_token in memory + sessionStorage
  → Navigates to /dashboard or /dashboard/setup based on onboarding.setup_completed
```

**Key files:**
- Frontend: `apps/home/src/components/AuthProvider.tsx` → `signInWithGoogle()`, `syncFirebaseUserSession()`
- Backend: `app/Http/Controllers/AuthController.php` → `syncFirebaseProfile()`, `findOrCreateFirebaseUser()`

### 2b. Email/Password Login (Backend Only — No Firebase)

```
User → enters email + password
  → POST /api/auth/login { email, password }
  → Backend validates credentials via Auth::attempt()
  → Returns { data: { access_token: <sanctum_token>, redirect } }
  → Frontend stores token in memory + sessionStorage
  → Navigates to redirect URL
```

**Key files:**
- Frontend: `AuthProvider.tsx` → `signInWithEmail()`
- Backend: `AuthController.php` → `handleLogin()`

### 2c. Phone OTP Login (Firebase)

```
User → enters phone number
  → RecaptchaVerifier (invisible) solves challenge
  → signInWithPhoneNumber(auth, phone, appVerifier)
  → User enters 6-digit OTP
  → confirmationResult.confirm(otp)
  → Firebase onIdTokenChanged fires
  → Same as Google flow: POST /api/auth/sync → sanctum token
```

**Key files:**
- Frontend: `apps/home/src/app/auth/phone/page.tsx`, `AuthProvider.tsx` → `setupRecaptcha()`, `sendPhoneOtp()`

---

## 3. Session & Token Architecture

### Token Storage (Frontend)

| Storage | What | Survives refresh? | Used by |
|---------|------|-------------------|---------|
| `backendTokenCache` (JS module var) | Sanctum access token | ❌ No | All API calls |
| `sessionStorage["saaszo_backend_token"]` | Same token (persisted) | ✅ Yes (same tab) | Fallback on refresh |
| Firebase IndexedDB | Firebase auth state | ✅ Yes | Google/Phone users |
| Cookie `saaszo_session=1` (.saaszo.in) | Marker — "user has logged in" | ✅ Yes | Middleware, session bridge |
| Cookie `XSRF-TOKEN` (.saaszo.in) | Laravel CSRF token | ✅ Yes | fetchWithCsrf() |

### Session Hydration on Page Refresh

```
Page loads → AuthProvider useEffect runs
  1. Is there a Firebase auth user? (IndexedDB)
     → Yes: onIdTokenChanged fires → syncFirebaseUserSession() → new sanctum token ✅
  2. Is there a cached backend token? (sessionStorage)
     → Yes: hydrateBackendSession(token) → GET /api/auth/profile → validate ✅
  3. Is there a saaszo_session cookie?
     → Yes: hydrateCookieSession() → GET /api/auth/profile (session-based) ✅
     → This only works if the domain is in SANCTUM_STATEFUL_DOMAINS!
  4. None of the above → user is signed out
```

### Sanctum Stateful Domains (CRITICAL)

Laravel Sanctum only applies session middleware to requests from domains listed in
`SANCTUM_STATEFUL_DOMAINS`. Without the domain in this list, `credentials: "include"`
sends the cookies but Laravel ignores them.

```env
# .env (production)
SANCTUM_STATEFUL_DOMAINS=saaszo.in,www.saaszo.in,invoice.saaszo.in,task.saaszo.in,api.saaszo.in,admin.saaszo.in,hrms.saaszo.in,crm.saaszo.in,projects.saaszo.in,localhost:3000
```

> ⚠️ `Str::is('saaszo.in', 'www.saaszo.in')` → FALSE. These are separate domains
> in Sanctum's eyes. Both MUST be listed explicitly.

---

## 4. Cross-Domain SSO (Product Handoff)

When user opens a product (invoice/task) from the dashboard:

### Standard Flow (Invoice, Task, and all products)

```
Dashboard → getHandoffToken("invoice")
  → POST /api/auth/product-token { tool: "invoice" }
    (Auth: Bearer <sanctum_token>)
  → Backend generates 64-char handoff token, cached 90 seconds
  → Returns { redirect_url: "https://invoice.saaszo.in/auth-bridge?token=XXX&tool=invoice" }
  → Frontend redirects user to that URL

Invoice app → /auth-bridge page loads
  → POST /api/auth/consume-handoff { handoff_token: "XXX", tool: "invoice" }
  → Backend verifies token, creates fresh Sanctum token for product
  → Returns { access_token, user, company }
  → Invoice app stores token, redirects to /dashboard
```

**Key files:**
- Frontend: `AuthProvider.tsx` → `getHandoffToken()`
- Backend: `app/Http/Controllers/ProductHandoffController.php`
- Invoice: `components/auth-bridge-client.tsx`
- Task: `components/auth-bridge-client.tsx`

### Session Bridge (Fallback)

If handoff token expired or missing, product apps try session-based auth:

```
GET /api/auth/bridge-token (credentials: include)
  → Backend reads session cookie → creates Sanctum token
  → Only works if domain is in SANCTUM_STATEFUL_DOMAINS
```

---

## 5. Backend Auth Middleware Stack

### `WorkspaceAuthMiddleware` (`workspace_auth`)

Three-tier authentication cascade:
1. **Session** → `Auth::guard('web')->user()` — Laravel session cookies
2. **Sanctum** → `Auth::guard('sanctum')->user()` — `Authorization: Bearer <token>`
3. **Firebase** → `Firebase::auth()->verifyIdToken($token)` — Firebase ID token

File: `app/Http/Middleware/WorkspaceAuthMiddleware.php`

### Request Flow

```
Request from www.saaszo.in
  → CORS middleware (config/cors.php) — checks origin
  → EnsureFrontendRequestsAreStateful (if domain in SANCTUM_STATEFUL_DOMAINS)
    → Attaches session middleware
  → WorkspaceAuthMiddleware
    → Tries session → sanctum → firebase
  → Controller handles request
```

---

## 6. Bugs Fixed (2026-05-27)

### Bug #1 — CRITICAL: `SANCTUM_STATEFUL_DOMAINS` missing www and task

**Root cause:** The `.env` had `saaszo.in` but NOT `www.saaszo.in`. Since the app
canonicalizes to `www.saaszo.in`, Sanctum didn't recognize it as a trusted SPA.
Session middleware wasn't applied, so `Auth::guard('web')->user()` returned null.

**Impact:** Email/password users lost their session on page refresh.

**Fix:** Added `www.saaszo.in` and `task.saaszo.in` to `SANCTUM_STATEFUL_DOMAINS` in `.env`.

**Files changed:**
- `api.saaszo.in_backend/.env` (line 38)

---

### Bug #2 — HIGH: `NEXT_PUBLIC_APP_URL` origin mismatch

**Root cause:** `.env.example` had `NEXT_PUBLIC_APP_URL="https://saaszo.in"` (no www).
Backend returns redirect URLs with `www.saaszo.in`. When `navigateAfterAuth()` compared
origins, they didn't match → `window.location.assign()` (full reload) instead of
`router.push()` (client-side navigation).

**Impact:** Every login caused a full page reload. For email/password users with
tokens only in memory, the token was lost.

**Fix:** Changed `.env.example` to `https://www.saaszo.in`. User MUST also update the
Vercel environment variable.

**Files changed:**
- `saaszo.in_platform/saaszo.in_frontend/apps/home/.env.example` (line 2)

> ⚠️ **MANUAL ACTION REQUIRED:** Set `NEXT_PUBLIC_APP_URL=https://www.saaszo.in`
> in Vercel project settings → Environment Variables → Production.

---

### Bug #3 — HIGH: `?redirect=` URL param ignored

**Root cause:** `syncFirebaseUserSession()` sent POST `/api/auth/sync` with NO request
body. The backend's `resolveSuccessfulRedirect()` checked `$request->input('redirect')`
which was null, so it always returned `/dashboard`.

**Impact:** Deep-links like `/auth?redirect=/dashboard/billing` always landed on
`/dashboard` instead of the intended page.

**Fix:** Now reads `?redirect=` from the current URL and sends it in the POST body.

**Files changed:**
- `AuthProvider.tsx` → `syncFirebaseUserSession()` (around line 496)

---

### Bug #4 — HIGH: Double-sync race condition on Google redirect

**Root cause:** In the `useEffect`, two things fired simultaneously:
1. `hydrateRedirectResult()` → `getRedirectResult(auth)` → `syncFirebaseUserSession()`
2. `onIdTokenChanged()` listener → also called `syncFirebaseUserSession()`

Both hit `POST /api/auth/sync` concurrently, creating duplicate Sanctum tokens.

**Fix:** Added `syncedFromRedirect` flag. When `hydrateRedirectResult()` successfully
syncs, it sets the flag. `onIdTokenChanged` checks the flag and skips sync if already done.

**Files changed:**
- `AuthProvider.tsx` → `useEffect` (around line 784)

---

### Bug #5 — HIGH: Task handoff exposed bearer token in URL

**Root cause:** `getHandoffToken("task")` had a special case that put the Sanctum
access token directly in the URL query string: `?access_token=XXX`. This token
appeared in browser history, server logs, and Referer headers.

**Fix:** Removed the task-specific branch. Task now uses the same secure handoff-token
flow as invoice (`POST /api/auth/product-token` → cache-backed single-use token).

**Files changed:**
- `AuthProvider.tsx` → `getHandoffToken()` (around line 1186)

---

### Bug #6 — MEDIUM: Backend token lost on page refresh

**Root cause:** `backendTokenCache` was a module-level JavaScript variable — wiped
on every page refresh. Email/password users (no Firebase) had no way to recover
their token without session-based auth (which also failed due to Bug #1).

**Fix:** Token is now also persisted to `sessionStorage` under key `saaszo_backend_token`.
`getStoredBackendToken()` checks memory first, then sessionStorage. The token
automatically clears when the tab closes (sessionStorage behavior).

**Files changed:**
- `AuthProvider.tsx` → `getStoredBackendToken()`, `setStoredBackendToken()`, `clearStoredBackendToken()` (around line 267)

---

### Bug #7 — MEDIUM: No server-side auth guard on dashboard

**Root cause:** All auth protection was client-side in `dashboard/layout.tsx`. The
dashboard HTML was sent to the browser before the auth check ran, causing a brief
flash of protected content.

**Fix:** Added `middleware.ts` that checks for `saaszo_session` cookie at the edge.
If missing, redirects to `/auth?redirect=<path>` before any HTML is sent.

**Files created:**
- `apps/home/src/middleware.ts` (new file)

---

### Bug #8 — HIGH: Google Sign-In fails on modern browsers due to third-party cookies / redirect blocking

**Root cause:** The previous implementation relied purely on `signInWithRedirect()`. Modern browsers block third-party cookies/iframes by default, preventing Firebase Auth from reading redirect states on custom domains. Additionally, random third-party iframe exceptions on page load were shown to users even if they did not click the Google Sign-in button. Finally, a double-sync race condition existed between `getRedirectResult()` and `onIdTokenChanged()`.

**Impact:** Google Login and Google Signup were broken or completely unresponsive for many users.

**Fix:**
1. Upgraded to a hybrid **Popup-First approach** (`signInWithPopup()`) which is 100% reliable as it avoids cookie blocks, with automatic fallback to `signInWithRedirect()` if popups are blocked/cancelled.
2. Added `redirectSyncInitiated` flag to strictly block duplicate `/api/auth/sync` requests.
3. Guarded global error setting so that page load redirect errors are only displayed if `hasGoogleRedirectIntent()` is true.

---

## 7. Key Files Reference

### Frontend (www.saaszo.in)

| File | Purpose |
|------|---------|
| `apps/home/src/components/AuthProvider.tsx` | **Core auth logic** — Google/email/phone login, session management, product handoff |
| `apps/home/src/middleware.ts` | Server-side auth guard for /dashboard/* routes |
| `apps/home/src/app/auth/page.tsx` | Login page UI |
| `apps/home/src/app/auth/phone/page.tsx` | Phone OTP login UI |
| `apps/home/src/app/dashboard/layout.tsx` | Dashboard auth guard + setup enforcement |
| `apps/home/src/lib/config.ts` | App URL, API URL, Firebase config |
| `apps/home/src/lib/utils.ts` | Safe redirect validation (`toSafeAppPath`, `toSafeAbsoluteUrl`) |
| `apps/home/src/lib/firebase.ts` | Firebase initialization |
| `apps/home/next.config.ts` | COOP headers, redirects, invoice rewrites |
| `apps/home/.env.example` | Production env template |

### Backend (api.saaszo.in)

| File | Purpose |
|------|---------|
| `app/Http/Controllers/AuthController.php` | Login, register, Firebase sync, profile, bridge-token |
| `app/Http/Controllers/ProductHandoffController.php` | Cross-domain SSO token exchange |
| `app/Http/Middleware/WorkspaceAuthMiddleware.php` | 3-tier auth: session → sanctum → firebase |
| `config/saaszo.php` | Platform URLs, cookie domain, origin allowlists |
| `config/cors.php` | CORS origins and headers |
| `routes/api.php` | All API route definitions |
| `.env` | `SANCTUM_STATEFUL_DOMAINS`, `SESSION_DOMAIN`, product URLs |

### Product Apps

| File | Purpose |
|------|---------|
| `invoice.saaszo.in_frontend/apps/invoice/components/auth-bridge-client.tsx` | SSO handoff consumer |
| `invoice.saaszo.in_frontend/apps/invoice/lib/auth-client.ts` | Token management, API calls |
| `task.saaszo.in/components/auth-bridge-client.tsx` | SSO handoff consumer |
| `task.saaszo.in/lib/auth-client.ts` | Token management, portal redirect |

---

## 8. Rules for Future Changes

1. **Never remove `www.saaszo.in` from `SANCTUM_STATEFUL_DOMAINS`** — it breaks all session-based auth
2. **`NEXT_PUBLIC_APP_URL` MUST be `https://www.saaszo.in`** on Vercel — mismatches cause full-page reloads
3. **All cross-domain product launches MUST use handoff-token flow** — never put bearer tokens in URLs
4. **Token changes in `AuthProvider.tsx`** must update both `backendTokenCache` AND `sessionStorage`
5. **Adding a new product app** requires following the 5-step integration guide in Section 9.
6. **Shared cookies** use domain `.saaszo.in` — accessible from ALL subdomains
7. **The `redirect` query param** must be forwarded to `/api/auth/sync` for deep-linking to work
8. **Google redirect flow** fires both `getRedirectResult` and `onIdTokenChanged` — always guard against double-sync
9. **Google Sign-In uses a Popup-first approach** with fallback to redirect to bypass browser third-party cookie restrictions. Do not revert to redirect-only flow.

---

## 9. Comprehensive Step-by-Step Guide: How to Add a New App to SaaSzo Auth (in 5 Minutes)

When adding a new SaaSzo sub-product (e.g., `pos.saaszo.in`, `crm.saaszo.in`, `hrms.saaszo.in`):

### 🏢 PART A: Backend Configuration (api.saaszo.in_backend)

#### Step 1: Authorize the App Domain
In your backend `.env` file (and in the host manager environment settings e.g. Hostinger), add the new app's subdomain to `SANCTUM_STATEFUL_DOMAINS` so that Sanctum applies session tracking and stateful cookies.
```env
SANCTUM_STATEFUL_DOMAINS=saaszo.in,www.saaszo.in,invoice.saaszo.in,task.saaszo.in,pos.saaszo.in,localhost:3000
```

#### Step 2: Allow CORS Requests
Open `config/cors.php` and append the new app's URL to the `allowed_origins` or patterns list to authorize cross-domain headers:
```php
'allowed_origins' => [
    'https://www.saaszo.in',
    'https://invoice.saaszo.in',
    'https://task.saaszo.in',
    'https://pos.saaszo.in', // <-- ADDED
],
```

#### Step 3: Register the Product Path
Open `config/saaszo.php` and define the new tool's base URL:
```php
'products' => [
    'invoice_base_url' => env('SAASZO_INVOICE_URL', 'https://invoice.saaszo.in'),
    'task_base_url' => env('SAASZO_TASK_URL', 'https://task.saaszo.in'),
    'pos_base_url' => env('SAASZO_POS_URL', 'https://pos.saaszo.in'), // <-- ADDED
],
```

#### Step 4: Issue Stateful Cookies
Open `app/Http/Controllers/ProductHandoffController.php`. Under `consumeHandoffToken` (around line 172), expand the cookie assignment list to drop the `{tool}_saaszo_session` cookie on `.saaszo.in`:
```php
if (in_array($tool, ['invoice', 'task', 'pos'], true)) { // <-- Added 'pos'
    $response->cookie(
        $tool . '_saaszo_session',
        '1',
        self::SHARED_COOKIE_TTL_MINUTES,
        '/',
        (string) config('saaszo.shared_cookie_domain', '.saaszo.in'),
        true,
        true,
        false,
        'Lax'
    );
}
```

---

### 💻 PART B: Frontend Integration (Your New Next.js / React App)

#### Step 5: Implement Auth Client & Bridge Page
1. **Cookie & Storage Keys (`lib/auth-client.ts`):** Define the local storage and session cookie keys unique to this app:
   ```typescript
   export const authStorageKey = "pos_saaszo_token";
   export const authCookieKey = "pos_saaszo_session";
   ```
2. **Implement Bridge Consumer (`app/auth-bridge/page.tsx`):**
   Create a page that consumes the single-use `handoff_token` issued by the portal and requests a real Sanctum token:
   ```typescript
   // Calls POST api.saaszo.in/api/auth/consume-handoff
   const result = await requestJson("/api/auth/consume-handoff", {
     method: "POST",
     body: JSON.stringify({ handoff_token: token, tool: "pos" }),
   });
   if (result.ok && result.data.success) {
     persistAccessToken(result.data.access_token);
     navigateTo("/dashboard");
   }
   ```
3. **Build Standalone Login Page (`app/login/page.tsx`):**
   Create a direct email/password login page containing a standard Next.js form:
   ```typescript
   // Calls POST api.saaszo.in/api/auth/login
   const result = await requestJson("/api/auth/login", {
     method: "POST",
     body: JSON.stringify({ email, password, remember: true }),
   });
   if (result.ok && result.data.success) {
     persistAccessToken(result.data.access_token);
     navigateTo("/dashboard");
   }
   ```
   *This standalone pattern matches both `invoice.saaszo.in` and `task.saaszo.in`, ensuring users can log in directly on the sub-app or delegate to the portal.*

