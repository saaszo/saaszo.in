"use client";

import { normalizeErrorMessage, readAccessToken, requestJson } from "@/lib/auth-client";

export async function authedRequest<T extends Record<string, unknown>>(path: string, init?: RequestInit) {
  const token = readAccessToken();
  return requestJson<T>(path, {
    ...init,
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
          ...(init?.headers || {}),
        }
      : (init?.headers || {}),
  });
}

export function apiErrorMessage(fallback: string, payload?: { message?: string | null } | null) {
  return normalizeErrorMessage(fallback, payload);
}

export function money(value: number) {
  return `Rs ${value.toFixed(2)}`;
}
