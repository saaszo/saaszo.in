"use client";

import { appConfig, toAbsoluteApiUrl } from "@/lib/config";
import { getCookieValue, resolveSafeRedirectTarget } from "@/lib/utils";

export const authStorageKey = "saaszo_home_token";
export const lastActivityKey = "saaszo_home_last_activity";
export const deviceIdKey = "saaszo_home_device_id";
export const authCookieKey = "saaszo_session";
const sharedCookieDomain = ".saaszo.in";

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

  window.localStorage.setItem(authStorageKey, token);
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

  window.localStorage.removeItem(authStorageKey);
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

export function readAccessToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(authStorageKey);
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

export function navigateTo(url?: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.location.href = resolveRedirect(url);
}

export function normalizeErrorMessage(
  fallback: string,
  payload?: { message?: string | null } | null,
) {
  return payload?.message?.trim() || fallback;
}
