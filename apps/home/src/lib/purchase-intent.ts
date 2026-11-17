const key = "saaszo_purchase_return_v1";
export function savePurchaseReturn(path: string) {
  if (typeof window === "undefined") return;
  const url = new URL(path, window.location.origin);
  if (
    url.origin !== window.location.origin ||
    url.pathname !== "/dashboard/checkout"
  )
    return;
  sessionStorage.setItem(
    key,
    JSON.stringify({
      path: url.pathname + url.search,
      expires: Date.now() + 30 * 60 * 1000,
    }),
  );
}
export function readPurchaseReturn(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = JSON.parse(sessionStorage.getItem(key) || "null");
    if (!saved || saved.expires < Date.now() || typeof saved.path !== "string")
      return null;
    const url = new URL(saved.path, window.location.origin);
    if (
      url.origin !== window.location.origin ||
      url.pathname !== "/dashboard/checkout" ||
      url.username ||
      url.password
    )
      return null;
    return url.pathname + url.search;
  } catch {
    return null;
  }
}
export function clearPurchaseReturn() {
  if (typeof window !== "undefined") sessionStorage.removeItem(key);
}

/** New accounts enter the central dashboard; only an explicit checkout continues elsewhere. */
export function resolveSignupReturn(
  value: string | null | undefined,
  appUrl: string,
): string {
  try {
    const origin = new URL(appUrl).origin;
    const url = new URL(value || "/dashboard", origin);
    return url.origin === origin &&
      url.pathname === "/dashboard/checkout" &&
      !url.username &&
      !url.password
      ? url.pathname + url.search
      : "/dashboard";
  } catch {
    return "/dashboard";
  }
}
