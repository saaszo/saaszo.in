import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const DEFAULT_APP_ORIGIN = "https://www.saaszo.in";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getCookieValue(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const escapedName = escapeRegExp(name);
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapedName}=([^;]+)`),
  );

  return match ? decodeURIComponent(match[1]) : null;
}

export function meetsPasswordRequirements(value: string) {
  return (
    value.length >= 8 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /[0-9]/.test(value) &&
    /[^A-Za-z0-9]/.test(value)
  );
}

export function isAllowedSaaszoHostname(hostname: string) {
  const normalizedHostname = hostname.trim().toLowerCase();

  return (
    normalizedHostname === "saaszo.in" ||
    (normalizedHostname.endsWith(".saaszo.in") &&
      normalizedHostname !== ".saaszo.in")
  );
}

function getBaseOrigin(appUrl: string) {
  try {
    return new URL(appUrl).origin;
  } catch {
    return DEFAULT_APP_ORIGIN;
  }
}

export function toSafeAbsoluteUrl(
  target: string | null | undefined,
  appUrl = DEFAULT_APP_ORIGIN,
) {
  const trimmedTarget = target?.trim();

  if (!trimmedTarget) {
    return null;
  }

  try {
    const baseOrigin = getBaseOrigin(appUrl);
    const url = new URL(trimmedTarget, baseOrigin);

    if (url.origin === baseOrigin || isAllowedSaaszoHostname(url.hostname)) {
      return url.toString();
    }
  } catch {
    return null;
  }

  return null;
}

export function toSafeAppPath(
  target: string | null | undefined,
  appUrl = DEFAULT_APP_ORIGIN,
  fallbackPath = "/dashboard",
) {
  const safeAbsoluteUrl = toSafeAbsoluteUrl(target, appUrl);

  if (!safeAbsoluteUrl) {
    return fallbackPath;
  }

  try {
    const baseOrigin = getBaseOrigin(appUrl);
    const url = new URL(safeAbsoluteUrl);

    if (url.origin !== baseOrigin) {
      return fallbackPath;
    }

    const path = `${url.pathname}${url.search}${url.hash}`;

    return /^\/(?![\\/])/.test(path) ? path : fallbackPath;
  } catch {
    return fallbackPath;
  }
}

export function resolveSafeRedirectTarget(
  target: string | null | undefined,
  appUrl = DEFAULT_APP_ORIGIN,
  fallbackPath = "/dashboard",
) {
  const safeAbsoluteUrl = toSafeAbsoluteUrl(target, appUrl);

  if (!safeAbsoluteUrl) {
    return fallbackPath;
  }

  try {
    const baseOrigin = getBaseOrigin(appUrl);
    const url = new URL(safeAbsoluteUrl);

    if (url.origin === baseOrigin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }

    return safeAbsoluteUrl;
  } catch {
    return fallbackPath;
  }
}

export type SearchParamValue = string | number | boolean | null | undefined;

export function buildSearchParams(filters?: Record<string, SearchParamValue>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(filters ?? {})) {
    if (value === undefined || value === null || value === "") {
      continue;
    }

    params.set(key, String(value));
  }

  return params.toString();
}
