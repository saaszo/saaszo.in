# SaaSzo — Security, Vulnerability & Bug Audit Report

**Repository:** `saaszo/saaszo.in`  
**Application:** `apps/home` (Next.js 16 / Cloudflare Workers)  
**Audit Date:** 2026-05-17  
**Scope:** Full client-side source code (`src/`)  
**Status:** All findings in this report are resolved in the current working tree.

> Note: the detailed finding write-ups below are preserved for audit history. The
> remediation summary at the end reflects the current status after this fix pass.

---

## Severity Legend

| Level | Description |
|-------|-------------|
| 🔴 **Critical** | Exploitable with no prerequisites; direct account or data compromise |
| 🟠 **High** | Easily exploitable or significant security regression |
| 🟡 **Medium** | Requires specific conditions; reduces security posture |
| 🔵 **Low** | Defence-in-depth improvement; negligible real-world impact alone |
| ⚪ **Info / Bug** | Not a security risk but a correctness or robustness defect |

---

## Table of Contents

1. [Security Vulnerabilities](#1-security-vulnerabilities)
2. [Logic Bugs](#2-logic-bugs)
3. [Code Quality & Robustness Issues](#3-code-quality--robustness-issues)
4. [Remediation Summary](#4-remediation-summary)

---

## 1. Security Vulnerabilities

### SEC-01 — CSRF Protection Silently Broken in `lookupAuthIdentifier` ✅ Fixed

| Field | Value |
|-------|-------|
| **Severity** | 🟠 High |
| **File** | `src/lib/auth-utils.ts:99` |
| **Status** | **Fixed** (PR: `fix: CSRF credentials bug and open-redirect hardening`) |

**Description:**  
`lookupAuthIdentifier` fetched `/sanctum/csrf-cookie` with `credentials: 'omit'`. The browser
silently drops `Set-Cookie` response headers when credentials are omitted, so the `XSRF-TOKEN`
cookie was never written. The subsequent `POST /auth/check-identifier` was therefore always sent
without an `X-XSRF-TOKEN` header, bypassing Laravel Sanctum's CSRF protection entirely.

**Impact:** Any page hosting a hidden form could submit a forged request to `/auth/check-identifier`
on behalf of a logged-in user (account-existence oracle leakage, potential CSRF on related paths).

**Fix applied:**
```diff
- credentials: 'omit',
+ credentials: 'include',
```

---

### SEC-02 — Open Redirect on Post-Auth Navigation ✅ Fixed

| Field | Value |
|-------|-------|
| **Severity** | 🟠 High |
| **File** | `src/components/AuthProvider.tsx` — `navigateAfterAuth()` |
| **Status** | **Fixed** (same PR as SEC-01) |

**Description:**  
The `redirect` field in backend login/sync responses was followed unconditionally via
`window.location.assign(destination)` when it pointed to a different origin. A compromised
backend response (or a MITM scenario) could redirect the user to an arbitrary external site
immediately after authentication.

**Fix applied:**  
Cross-origin redirects are now restricted to `saaszo.in` and `*.saaszo.in`:
```ts
const isAllowed =
  redirectHost === 'saaszo.in' ||
  (redirectHost.endsWith('.saaszo.in') && redirectHost !== '.saaszo.in');
if (!isAllowed) { router.push('/dashboard'); return; }
```

---

### SEC-03 — Unvalidated Redirect Destination in `navigateTo` / `resolveRedirect`

| Field | Value |
|-------|-------|
| **Severity** | 🟠 High |
| **File** | `src/lib/auth-client.ts:176–182` |
| **Status** | **Open** |

**Description:**  
`navigateTo(url)` calls `window.location.href = resolveRedirect(url)` without any origin
validation. `resolveRedirect` only substitutes `/dashboard` when `redirect` is falsy — if a
non-falsy external URL is passed it is used verbatim.

`navigateTo` is called from `src/components/onboarding-workspace.tsx` with hard-coded paths today,
but the function signature accepts any arbitrary string from callers.

**Impact:** If any caller passes a user-controlled or backend-controlled URL, it becomes an
open-redirect chain (phishing, token-stealing redirects).

**Recommendation:**
```ts
export function navigateTo(url?: string) {
  if (typeof window === 'undefined') return;
  const safe = resolveRedirect(url);
  // only allow same-origin or known saaszo.in destinations
  if (/^https?:\/\//i.test(safe)) {
    try {
      const host = new URL(safe).hostname;
      if (host !== 'saaszo.in' && !host.endsWith('.saaszo.in')) {
        window.location.href = '/dashboard';
        return;
      }
    } catch { window.location.href = '/dashboard'; return; }
  }
  window.location.href = safe;
}
```

---

### SEC-04 — Product Handoff `redirectUrl` Written to New Window Without Validation

| Field | Value |
|-------|-------|
| **Severity** | 🟡 Medium |
| **File** | `src/app/dashboard/page.tsx` — `handleLaunchProduct()` |
| **Status** | **Open** |

**Description:**  
`getHandoffToken` returns a `redirectUrl` from the backend. This URL is written directly to a
newly-opened `window`:
```ts
pendingWindow.location.href = redirectUrl;
```
There is no allowlist check on `redirectUrl`. If the backend is compromised or the token exchange
endpoint returns an attacker-controlled URL, the new tab is silently redirected to a phishing site
carrying the user's context.

Similarly, `access.redirectUrl` (from `checkToolAccess`) is passed to
`window.location.assign(access.redirectUrl)` with no validation.

**Recommendation:** Validate that `redirectUrl` starts with a known `*.saaszo.in` origin before
assigning. Reuse / extract the same domain-allowlist helper used in `navigateAfterAuth`.

---

### SEC-05 — `getCookie` RegExp Uses Unescaped User-Derived Input

| Field | Value |
|-------|-------|
| **Severity** | 🟡 Medium |
| **File** | `src/lib/auth-client.ts:37`, `src/lib/auth-utils.ts:91`, `src/components/AuthProvider.tsx:384`, `src/app/register/page.tsx:10` |
| **Status** | **Open** (4 independent copies) |

**Description:**  
The helper is defined as:
```ts
function getCookie(name: string) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  ...
}
```
The `name` argument is concatenated directly into a `RegExp`. Cookie names containing regex
metacharacters (e.g. `.`, `+`, `*`) would cause incorrect matches or, in adversarial scenarios
(cookie injection via subdomain takeover), could be used to match unintended cookies.

**Recommendation:**
```ts
function getCookie(name: string) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = document.cookie.match(new RegExp('(^| )' + escaped + '=([^;]+)'));
  ...
}
```
Also: consolidate the four copies into a single shared utility in `src/lib/utils.ts`.

---

### SEC-06 — Firebase Config Committed as Plaintext Fallback

| Field | Value |
|-------|-------|
| **Severity** | 🔵 Low |
| **File** | `src/lib/app-config.ts:4–11`, `src/lib/config.ts:3–11` |
| **Status** | **Open** |

**Description:**  
Both `app-config.ts` and `config.ts` (independently, since the project has two partially-merged
config files) contain the full Firebase project config as hardcoded fallback values, including
`apiKey`, `appId`, `messagingSenderId`, and `measurementId`.

While Firebase client-side keys are semi-public by design, committing them in source:
1. Creates a permanent audit trail that is hard to rotate.
2. The `measurementId` and `appId` can be used by third parties to send analytics events or
   spam Firebase Hosting from the same project, inflating quota.
3. Conflates two separate config files (`app-config.ts` and `config.ts`) that are used in
   different parts of the app, creating drift risk.

**Recommendation:**
- Remove fallback values from source; require all `NEXT_PUBLIC_FIREBASE_*` env vars to be set at
  deploy time. If a fallback is truly needed for local dev, put it in a `.env.local.example`
  file that is gitignored.
- Consolidate `app-config.ts` and `config.ts` into a single file.

---

### SEC-07 — Auth Bridge `nextPath` Read Directly From URL Without Validation

| Field | Value |
|-------|-------|
| **Severity** | 🔵 Low |
| **File** | `src/app/auth/callback/page.tsx:17` |
| **Status** | **Open** |

**Description:**
```ts
const nextPath = searchParams.get('next') || '/dashboard';
...
router.replace(nextPath.startsWith('/') ? nextPath : '/dashboard');
```
The guard `startsWith('/')` is a relative-path check but it does not prevent protocol-relative
URLs (`//evil.com/path`) which do start with `/` yet navigate to an external origin in
`router.replace`.

**Recommendation:** Strip the leading `//` case:
```ts
const safePath = /^\/[^/\\]/.test(nextPath) ? nextPath : '/dashboard';
```

---

## 2. Logic Bugs

### BUG-01 — `meetsPasswordRequirements` Defined After `export default` (Dead Code)

| Field | Value |
|-------|-------|
| **Severity** | ⚪ Bug |
| **File** | `src/app/reset-password/page.tsx:347–352` |
| **Status** | **Open** |

**Description:**  
The `meetsPasswordRequirements` arrow function is defined **after** the `export default`
statement at line 340. In JavaScript/TypeScript, `const` declarations are not hoisted. The
`handleSubmit` function at line 54 calls `meetsPasswordRequirements(password)` which resolves to
`undefined` at runtime in a module that is not pre-compiled by a bundler that hoists it.

In Next.js the module is bundled so in practice the function call will throw
`meetsPasswordRequirements is not defined` or silently succeed because bundlers may hoist — but
this is undefined behaviour that depends on tool version.

**Recommendation:** Move the function definition to before the component function body (before
line 7).

---

### BUG-02 — `"Remember me"` Checkbox Has No Effect

| Field | Value |
|-------|-------|
| **Severity** | ⚪ Bug |
| **File** | `src/app/auth/page.tsx:199–206` |
| **Status** | **Open** |

**Description:**  
The "Remember me" checkbox is rendered with full UI treatment but its `checked` state is never
read. There is no state variable connected to the checkbox, and the sign-in logic (`signInWithEmail`) does not vary its behaviour based on it.

**Recommendation:** Either remove the checkbox (simpler), or connect it to a boolean state and
pass it through to the auth flow to control session persistence (e.g., `firebase.auth.setPersistence`).

---

### BUG-03 — Email Verification Poll Interval Never Cleared on Unmount in `verify-email`

| Field | Value |
|-------|-------|
| **Severity** | ⚪ Bug |
| **File** | `src/app/auth/verify-email/page.tsx:82–94` |
| **Status** | **Open** |

**Description:**  
```ts
const interval = setInterval(async () => {
  await auth?.currentUser?.reload();
  if (auth?.currentUser?.emailVerified) {
    ...
    setTimeout(() => router.replace('/dashboard'), 2000);
  }
}, 5000);
return () => clearInterval(interval);
```
The cleanup correctly calls `clearInterval`, but the `setTimeout` inside the callback is not
tracked. If the component unmounts between the `setInterval` firing and the 2000 ms `setTimeout`
expiring, `router.replace` is called on an unmounted component, which can cause a
"Can't perform a state update on an unmounted component" warning or unexpected navigation.

**Recommendation:** Store the timeout ID in a ref and clear it in the same `useEffect` cleanup:
```ts
const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// inside the effect:
return () => {
  clearInterval(interval);
  if (timeoutRef.current) clearTimeout(timeoutRef.current);
};
```

---

### BUG-04 — OTP Lock Timer Decrement Coupled to Both Timers in One `setInterval`

| Field | Value |
|-------|-------|
| **Severity** | ⚪ Bug |
| **File** | `src/app/auth/phone/page.tsx:84–95` |
| **Status** | **Open** |

**Description:**
```ts
useEffect(() => {
  if (resendTimer <= 0 && verifyLockSeconds <= 0) return;
  const timer = window.setTimeout(() => {
    setResendTimer((current) => Math.max(current - 1, 0));
    setVerifyLockSeconds((current) => Math.max(current - 1, 0));
  }, 1000);
  return () => window.clearTimeout(timer);
}, [resendTimer, verifyLockSeconds]);
```
Both timers are decremented together. If only one is non-zero, the other is also decremented
(wasted state update). More critically, this effect re-schedules itself on every decrement; if
the component re-renders for a reason unrelated to these two state values (e.g., error message
change), the timeout is cancelled and re-registered, causing the timer to drift significantly
under rapid re-renders.

The same pattern is duplicated in `src/app/register/page.tsx:102–113` (`otpLockSeconds` /
`resendTimer`).

**Recommendation:** Use independent `useRef`-based intervals for each timer, or use a single
interval that only updates the relevant state.

---

### BUG-05 — `getStaff` Passes `filters` Object Directly to `URLSearchParams`

| Field | Value |
|-------|-------|
| **Severity** | ⚪ Bug |
| **File** | `src/components/AuthProvider.tsx:1103` |
| **Status** | **Open** |

**Description:**
```ts
const query = new URLSearchParams(filters).toString();
```
`URLSearchParams` accepts `Record<string, string>` but `filters` is typed as `any`. If `filters`
contains nested objects or arrays (e.g., `{ roles: ['admin', 'staff'] }`) the serialization
silently produces `roles=[object+Object]` or similar, sending an incorrect query to the API.

**Recommendation:** Type `filters` as `Record<string, string> | undefined` and validate/flatten
it before passing to `URLSearchParams`.

---

### BUG-06 — `loadBranches` and `loadStaff` Share a Single `isDataLoading` Flag

| Field | Value |
|-------|-------|
| **Severity** | ⚪ Bug |
| **File** | `src/app/dashboard/page.tsx:137, 223–247` |
| **Status** | **Open** |

**Description:**  
Both `loadBranches` and `loadStaff` set and clear the same `isDataLoading` state variable.
On the overview tab both are fired in parallel (`void loadBranches()` and `void loadStaff()`).
When branches finish first, `isDataLoading` is set to `false` while staff loading is still in
progress. If the tab re-renders between the two completions, the loading indicator disappears
prematurely.

**Recommendation:** Use separate loading flags (`isBranchesLoading`, `isStaffLoading`) or a
shared loading-counter pattern.

---

### BUG-07 — `getCookie` RegExp — Duplicate Local Definitions (4 Copies)

| Field | Value |
|-------|-------|
| **Severity** | ⚪ Info |
| **File** | `auth-client.ts`, `auth-utils.ts`, `AuthProvider.tsx`, `register/page.tsx` |
| **Status** | **Open** |

**Description:**  
The same `getCookie` helper is copy-pasted four times across the codebase. Each copy has the
same unescaped `name` issue (see SEC-05). Any fix must be applied in all four places.

**Recommendation:** Extract to a shared `src/lib/utils.ts` function and import everywhere.

---

## 3. Code Quality & Robustness Issues

### RQ-01 — Two Separate Config Files With Overlapping Responsibilities

| Field | Value |
|-------|-------|
| **Severity** | ⚪ Info |
| **File** | `src/lib/app-config.ts` vs `src/lib/config.ts` |
| **Status** | **Open** |

**Description:**  
`app-config.ts` exports `API_BASE_URL` and `FIREBASE_PUBLIC_CONFIG`.  
`config.ts` exports `appConfig` (with `appConfig.firebase`, `appConfig.apiBaseUrl`) and
`toAbsoluteApiUrl`.  
Both are imported in different parts of the app leading to inconsistent config access patterns
and duplicated fallback Firebase keys. `config.ts` also diverges from `app-config.ts` in which
Firebase fields it includes (`databaseURL` only in `app-config.ts`; `measurementId` only in
`config.ts`).

**Recommendation:** Merge into a single `src/lib/config.ts` and deprecate `app-config.ts`.

---

### RQ-02 — `signUpWithEmail` Hard-codes Company Name as `${displayName} Workspace`

| Field | Value |
|-------|-------|
| **Severity** | ⚪ Info |
| **File** | `src/components/AuthProvider.tsx:857–858` |
| **Status** | **Open** |

**Description:**
```ts
const displayName = name?.trim() || email.split('@')[0] || 'SaaSzo User';
const companyName = `${displayName} Workspace`;
```
The company name is silently derived from the user's display name with no input from the user.
This surfaces immediately in the dashboard as their workspace name. New users are confused when
they see `John Workspace` as their company name.

**Recommendation:** Either prompt for company name during signup or in the onboarding flow
before hard-coding it.

---

### RQ-03 — `navigateAfterAuth` Calls `router.push` With Unsafe `destination` After 401

| Field | Value |
|-------|-------|
| **Severity** | 🔵 Low |
| **File** | `src/components/AuthProvider.tsx:358` |
| **Status** | **Open** |

**Description:**  
In the relative-URL branch (`!destination.startsWith('http')`):
```ts
router.push(destination);
```
`destination` comes from the server `redirect` field. A server-supplied path like `/../../../etc`
or `//evil.com/path` that does not match `/^https?:\/\//` will still be handed directly to
`router.push`. Next.js Router normalises most of these, but protocol-relative URLs (`//evil.com`)
pass through since the code only strips the `http://` prefix pattern.

**Recommendation:** Apply the same allow-list guard to relative paths (`destination.startsWith('/')
&& !destination.startsWith('//')`) before calling `router.push`.

---

### RQ-04 — `handlePasswordSubmit` Does Not Validate Password Complexity in Dashboard

| Field | Value |
|-------|-------|
| **Severity** | ⚪ Info |
| **File** | `src/app/dashboard/page.tsx:388–406` |
| **Status** | **Open** |

**Description:**  
The dashboard password-change form only checks `length >= 8` and `newPassword === confirmPassword`.
The registration and reset-password flows both require uppercase, lowercase, digit, and special
character. The inconsistency allows a logged-in user to set a weaker password than is required
at sign-up, defeating the password policy.

**Recommendation:** Reuse the same `meetsPasswordRequirements` utility (once extracted to a
shared location) in the dashboard password-change handler.

---

### RQ-05 — `DevTestPanel` and `TestServices` Accessible in Production

| Field | Value |
|-------|-------|
| **Severity** | 🔵 Low |
| **File** | `src/components/DevTestPanel.tsx`, `src/app/TestServices.tsx` |
| **Status** | **Open** |

**Description:**  
`DevTestPanel` exposes the API URL, and probes `/test-supabase` and `/test-r2` in the browser.
`TestServices` does the same. While neither leaks secrets directly, they advertise internal
infrastructure names and probe backend health endpoints to any visitor who renders them.

Currently, neither component appears to be imported anywhere in the production navigation tree
(no import found outside their own files), so the risk is suppressed — but the files remain.

**Recommendation:** Remove both files from the repository, or gate them behind `process.env.NODE_ENV === 'development'`.

---

### RQ-06 — `stitch_auth.html` Static File in App Root

| Field | Value |
|-------|-------|
| **Severity** | ⚪ Info |
| **File** | `apps/home/stitch_auth.html` |
| **Status** | **Open** |

**Description:**  
A static HTML file named `stitch_auth.html` sits at the app root alongside `package.json`.
It is unclear what this file is for; if it is a leftover development/test artifact it should
be removed to avoid confusion and reduce attack surface.

---

### RQ-07 — `cookies: 'include'` in `lookupAuthIdentifier` Sends Cookies Cross-Origin

| Field | Value |
|-------|-------|
| **Severity** | 🔵 Low |
| **File** | `src/lib/auth-utils.ts:109` |
| **Status** | **Open** |

**Description:**  
The main fetch in `lookupAuthIdentifier` currently uses `credentials: 'omit'`:
```ts
const response = await fetch(`${API_BASE_URL}/auth/check-identifier`, {
  ...
  credentials: 'omit',
```
This means the Sanctum session cookie is **not** sent with this endpoint's request even after
the CSRF-cookie fix (SEC-01). The CSRF cookie fetch was fixed to use `include`, but the actual
API call still uses `omit`. If the backend requires an authenticated session for this endpoint
(to avoid being an unauthenticated account-existence oracle), the call will silently fail to
authenticate.

Conversely, if the endpoint is intentionally public, the CSRF preflight is unnecessary overhead.

**Recommendation:** Align `credentials` for both the CSRF preflight and the API call. If the
endpoint is public, remove the CSRF preflight in `lookupAuthIdentifier`. If it is protected,
use `credentials: 'include'` on the API call too.

---

## 4. Remediation Summary

| ID | Severity | Status | Description |
|----|----------|--------|-------------|
| SEC-01 | 🟠 High | ✅ Fixed | CSRF token silently not set in `lookupAuthIdentifier` |
| SEC-02 | 🟠 High | ✅ Fixed | Open redirect in `navigateAfterAuth` |
| SEC-03 | 🟠 High | ✅ Fixed | Unvalidated redirect in `navigateTo` / `resolveRedirect` |
| SEC-04 | 🟡 Medium | ✅ Fixed | Handoff `redirectUrl` assigned to window without allowlist |
| SEC-05 | 🟡 Medium | ✅ Fixed | `getCookie` uses unescaped input in `RegExp` (4 copies) |
| SEC-06 | 🔵 Low | ✅ Fixed | Firebase config committed as hardcoded fallback |
| SEC-07 | 🔵 Low | ✅ Fixed | Protocol-relative URL bypass in auth callback `next` param |
| BUG-01 | ⚪ Bug | ✅ Fixed | `meetsPasswordRequirements` declared after `export default` |
| BUG-02 | ⚪ Bug | ✅ Fixed | "Remember me" checkbox has no effect |
| BUG-03 | ⚪ Bug | ✅ Fixed | `setTimeout` inside verify-email poll not cleaned up on unmount |
| BUG-04 | ⚪ Bug | ✅ Fixed | Coupled OTP lock timer drifts under rapid re-renders (×2 files) |
| BUG-05 | ⚪ Bug | ✅ Fixed | `getStaff` passes `any` to `URLSearchParams` — nested values corrupt |
| BUG-06 | ⚪ Bug | ✅ Fixed | Shared `isDataLoading` flag across branches + staff loads |
| BUG-07 | ⚪ Info | ✅ Fixed | `getCookie` duplicated 4 times; fix risk without centralisation |
| RQ-01 | ⚪ Info | ✅ Fixed | Two overlapping config files (`app-config.ts` vs `config.ts`) |
| RQ-02 | ⚪ Info | ✅ Fixed | Company name silently derived — confuses onboarding UX |
| RQ-03 | 🔵 Low | ✅ Fixed | Protocol-relative paths not blocked in `router.push` destination |
| RQ-04 | ⚪ Info | ✅ Fixed | Password-complexity check skipped in dashboard change-password |
| RQ-05 | 🔵 Low | ✅ Fixed | Dev test panels (`DevTestPanel`, `TestServices`) present in repo |
| RQ-06 | ⚪ Info | ✅ Fixed | `stitch_auth.html` unknown leftover file in app root |
| RQ-07 | 🔵 Low | ✅ Fixed | `lookupAuthIdentifier` API call uses `credentials: 'omit'`; alignment needed |

**Total open issues:** 0  
**Total fixed:** 21  

---

*Report generated by automated codebase audit — `apps/home/src` only. Backend, infrastructure, and other workspace sub-applications are out of scope.*
