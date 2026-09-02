"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function HashRedirectGuard() {
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash.includes("access_token=")) {
      router.replace(`/auth/callback${window.location.hash}`);
    }
  }, [router]);

  return null;
}
