"use client";

import { API_BASE_URL } from "./app-config";
import { toAbsoluteApiUrl } from "./config";
import { getCookieValue } from "./utils";

export const PHONE_SESSION_STORAGE_KEY = "saaszo.phone_session_token";
export const PHONE_SESSION_EVENT = "saaszo-phone-session-changed";

export const AUTH_COUNTRY_OPTIONS = [
  { flag: "🇮🇳", code: "+91", name: "India" },
  { flag: "🇺🇸", code: "+1", name: "USA" },
  { flag: "🇬🇧", code: "+44", name: "UK" },
  { flag: "🇦🇪", code: "+971", name: "UAE" },
  { flag: "🇸🇬", code: "+65", name: "Singapore" },
  { flag: "🇦🇺", code: "+61", name: "Australia" },
  { flag: "🇨🇦", code: "+1", name: "Canada" },
  { flag: "🇩🇪", code: "+49", name: "Germany" },
];

const COUNTRY_CODES_BY_PRIORITY = [...AUTH_COUNTRY_OPTIONS].sort(
  (left, right) => right.code.length - left.code.length,
);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ParsedAuthIdentifier =
  | {
      type: "email";
      raw: string;
      email: string;
    }
  | {
      type: "phone";
      raw: string;
      countryCode: string;
      nationalNumber: string;
      e164: string;
    }
  | {
      type: "unknown";
      raw: string;
    };

export type IdentifierLookupResponse = {
  success: boolean;
  exists?: boolean | null;
  identifierType: "email" | "phone" | "unknown";
  normalizedIdentifier: string | null;
  authProvider: string | null;
  canUseGoogle: boolean;
  canUsePassword: boolean;
  canUsePhoneOtp: boolean;
  suggestedFlow: string;
};

export function parseAuthIdentifier(
  value: string,
  defaultCountryCode = "+91",
): ParsedAuthIdentifier {
  const raw = value.trim();

  if (!raw) {
    return { type: "unknown", raw };
  }

  const normalizedEmail = raw.toLowerCase();

  if (EMAIL_PATTERN.test(normalizedEmail)) {
    return {
      type: "email",
      raw,
      email: normalizedEmail,
    };
  }

  const normalizedPhone = normalizePhoneInput(raw, defaultCountryCode);

  if (!normalizedPhone) {
    return { type: "unknown", raw };
  }

  return {
    type: "phone",
    raw,
    ...normalizedPhone,
  };
}

export async function lookupAuthIdentifier(identifier: string) {
  if (!getCookieValue("XSRF-TOKEN")) {
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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const xsrfToken = getCookieValue("XSRF-TOKEN");
  if (xsrfToken) {
    headers["X-XSRF-TOKEN"] = xsrfToken;
  }

  const response = await fetch(`${API_BASE_URL}/auth/check-identifier`, {
    method: "POST",
    headers,
    credentials: "include",
    body: JSON.stringify({ identifier }),
  });

  const data = (await response.json().catch(() => null)) as
    | IdentifierLookupResponse
    | { message?: string }
    | null;

  if (!response.ok || !data || !("success" in data)) {
    throw new Error(
      data && "message" in data && typeof data.message === "string"
        ? data.message
        : "Could not check this account right now.",
    );
  }

  return data;
}

export function getPhoneSessionToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage.getItem(PHONE_SESSION_STORAGE_KEY);
}

export function setPhoneSessionToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(PHONE_SESSION_STORAGE_KEY, token);
  window.dispatchEvent(new Event(PHONE_SESSION_EVENT));
}

export function clearPhoneSessionToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(PHONE_SESSION_STORAGE_KEY);
  window.dispatchEvent(new Event(PHONE_SESSION_EVENT));
}

function normalizePhoneInput(value: string, defaultCountryCode: string) {
  const compactValue = value.replace(/[^\d+]/g, "");
  const digits = compactValue.replace(/\D/g, "");

  if (digits.length < 7) {
    return null;
  }

  if (compactValue.startsWith("+")) {
    const e164 = `+${digits}`;
    const countryCode =
      COUNTRY_CODES_BY_PRIORITY.find((option) => e164.startsWith(option.code))
        ?.code ?? defaultCountryCode;
    const countryDigits = countryCode.replace("+", "");
    const nationalNumber = e164.startsWith(countryCode)
      ? digits.slice(countryDigits.length)
      : digits;

    return {
      countryCode,
      nationalNumber,
      e164,
    };
  }

  if (digits.length === 10) {
    return {
      countryCode: defaultCountryCode,
      nationalNumber: digits,
      e164: `${defaultCountryCode}${digits}`,
    };
  }

  const e164 = `+${digits}`;
  const countryCode =
    COUNTRY_CODES_BY_PRIORITY.find((option) => e164.startsWith(option.code))
      ?.code ?? defaultCountryCode;
  const countryDigits = countryCode.replace("+", "");
  const nationalNumber = e164.startsWith(countryCode)
    ? digits.slice(countryDigits.length)
    : digits;

  return {
    countryCode,
    nationalNumber,
    e164,
  };
}
