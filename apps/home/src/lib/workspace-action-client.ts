"use client";

import { normalizeErrorMessage, readAccessToken, requestJson } from "@/lib/auth-client";

export async function authedRequest<T extends Record<string, unknown>>(path: string, init?: RequestInit) {
  const token = readAccessToken();

  if (!token) {
    return {
      ok: false,
      status: 401,
      data: {
        success: false,
        message: "Login required.",
      } as T & { success?: boolean; message?: string },
    };
  }

  return requestJson<T>(path, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.headers || {}),
    },
  });
}

export function apiErrorMessage(fallback: string, payload?: { message?: string | null } | null) {
  return normalizeErrorMessage(fallback, payload);
}

export function money(value: number) {
  return `Rs ${value.toFixed(2)}`;
}
