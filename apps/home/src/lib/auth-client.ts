"use client";

import { appConfig, toAbsoluteApiUrl } from "@/lib/config";
import { getCookieValue, resolveSafeRedirectTarget } from "@/lib/utils";

export const authStorageKey = "saaszo.backend_auth_token";
export const legacyAuthStorageKey = "saaszo_home_token";
export const lastActivityKey = "saaszo_home_last_activity";
export const deviceIdKey = "saaszo_home_device_id";
export const authCookieKey = "saaszo_session";
export const setupRedirectBypassKey = "saaszo.setup_redirect_bypass";
const sharedCookieDomain = ".saaszo.in";
let accessTokenCache: string | null = null;

export type ApiResult<T = Record<string, unknown>> = T & {
  success?: boolean;
  message?: string;
  redirect?: string;
  access_token?: string;
  type?: string;
};

export function getDeviceId() {
  if (typeof window === "undefined") return "server-device-id";
  let deviceId = window.localStorage.getItem(deviceIdKey);
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    window.localStorage.setItem(deviceIdKey, deviceId);
  }
  return deviceId;
}

export async function requestJson<T extends Record<string, unknown>>(
  path: string,
  init?: RequestInit,
): Promise<{ ok: boolean; status: number; data: ApiResult<T> }> {
  const isMutation = !["GET", "HEAD", "OPTIONS"].includes(
    init?.method?.toUpperCase() || "GET",
  );

  if (isMutation && !getCookieValue("XSRF-TOKEN")) {
    await fetch(
      toAbsoluteApiUrl("/sanctum/csrf-cookie").replace(
        "/api/sanctum",
        "/sanctum",
      ),
      {
        method: "GET",
        credentials: "include",
      },
    ).catch(() => null);
  }

  const isFormData =
    typeof FormData !== "undefined" && init?.body instanceof FormData;
  const headers: Record<string, string> = {
    Accept: "application/json",
    "X-Device-ID": getDeviceId(),
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...((init?.headers as Record<string, string>) || {}),
  };

  const xsrfToken = getCookieValue("XSRF-TOKEN");
  if (xsrfToken && isMutation) {
    headers["X-XSRF-TOKEN"] = xsrfToken;
  }

  const response = await fetch(toAbsoluteApiUrl(path), {
    ...init,
    credentials: "include",
    headers,
  });

  const data = (await response.json().catch(() => ({
    success: false,
    message: `Unexpected server response (${response.status}).`,
  }))) as ApiResult<T>;

  return {
    ok: response.ok,
    status: response.status,
    data,
  };
}

export function persistAccessToken(token?: string) {
  if (!token || typeof window === "undefined") {
    return;
  }

  accessTokenCache = token;
  const secureFlag = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${authCookieKey}=1; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax${secureFlag}`;
  document.cookie = `${authCookieKey}=1; Path=/; Domain=${sharedCookieDomain}; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax${secureFlag}`;
  updateActivityTimestamp();
}

export function hasSessionCookie() {
  if (typeof window === "undefined") {
    return false;
  }

  return document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .some((entry) => entry.startsWith(`${authCookieKey}=`));
}

export function clearAccessToken() {
  if (typeof window === "undefined") {
    return;
  }

  accessTokenCache = null;
  window.localStorage.removeItem(lastActivityKey);
  document.cookie = `${authCookieKey}=; Path=/; Max-Age=0; SameSite=Lax`;
  document.cookie = `${authCookieKey}=; Path=/; Max-Age=0; Domain=${sharedCookieDomain}; SameSite=Lax`;
}

export function updateActivityTimestamp() {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(lastActivityKey, Date.now().toString());
}

export function markSetupRedirectBypass() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(setupRedirectBypassKey, Date.now().toString());
}

export function clearSetupRedirectBypass() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(setupRedirectBypassKey);
}

export function hasSetupRedirectBypass(maxAgeMs = 5 * 60 * 1000) {
  if (typeof window === "undefined") {
    return false;
  }

  const raw = window.sessionStorage.getItem(setupRedirectBypassKey);
  if (!raw) {
    return false;
  }

  const timestamp = Number(raw);
  if (!Number.isFinite(timestamp)) {
    window.sessionStorage.removeItem(setupRedirectBypassKey);
    return false;
  }

  if (Date.now() - timestamp > maxAgeMs) {
    window.sessionStorage.removeItem(setupRedirectBypassKey);
    return false;
  }

  return true;
}

export function readAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return accessTokenCache;
}

export async function fetchProfile(accessToken?: string | null) {
  return requestJson<{ user?: { name?: string; email?: string } }>(
    "/api/auth/profile",
    {
      method: "GET",
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
  );
}

export function resolveRedirect(redirect?: string) {
  return resolveSafeRedirectTarget(redirect, appConfig.appUrl);
}

export function buildAuthBridgeUrl(redirect?: string) {
  const resolved = resolveRedirect(redirect);

  try {
    const url = new URL(resolved, appConfig.appUrl);
    const redirectTarget = `${url.pathname}${url.search}`;

    if (!redirectTarget.startsWith("/dashboard")) {
      return "/auth-bridge?redirect=%2Fdashboard";
    }

    return `/auth-bridge?redirect=${encodeURIComponent(redirectTarget)}`;
  } catch {
    return "/auth-bridge?redirect=%2Fdashboard";
  }
}

export function getRequestedRedirect() {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get("redirect") || "";
}

function navigateWithMode(url: string, mode: "assign" | "replace") {
  if (mode === "replace") {
    window.location.replace(url);
    return;
  }

  window.location.href = url;
}

export function navigateTo(
  url?: string,
  options?: {
    replace?: boolean;
  },
) {
  if (typeof window === "undefined") {
    return;
  }

  const resolved = resolveRedirect(url);
  const mode = options?.replace ? "replace" : "assign";

  // If resolveRedirect returned a bare path (e.g. "/dashboard"), always
  // navigate to the canonical www origin so middleware runs on the right host.
  // Without this, a browser sitting on saaszo.in (apex) would navigate to
  // saaszo.in/dashboard — middleware would then redirect to /auth before the
  // next.config.ts canonical redirect fires, causing a broken auth loop.
  if (resolved.startsWith("/")) {
    const canonicalBase = appConfig.appUrl.replace(/\/$/, ""); // https://www.saaszo.in
    navigateWithMode(`${canonicalBase}${resolved}`, mode);
    return;
  }

  navigateWithMode(resolved, mode);
}

export function normalizeErrorMessage(
  fallback: string,
  payload?: { message?: string | null } | null,
) {
  return payload?.message?.trim() || fallback;
}
