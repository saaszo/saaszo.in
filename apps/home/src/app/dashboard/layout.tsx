"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useAuthSession } from "@/components/AuthProvider";
import {
  clearSetupRedirectBypass,
  hasSetupRedirectBypass,
} from "@/lib/auth-client";

/** Read a browser cookie by name (client-side only). */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

/** True if the saaszo_session marker cookie is still present. */
function hasSessionCookie() {
  return getCookie("saaszo_session") === "1";
}

export default function DashboardLayout(props: LayoutProps<"/dashboard">) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading, onboarding, workspaceUser } = useAuthSession();
  const { children } = props;
  const [setupRedirectBypass, setSetupRedirectBypass] = useState(false);

  // Track whether we've seen a definitive "not authenticated" result
  // AFTER an initial grace period to let Firebase restore the session.
  // Without this, closing+reopening a tab wipes sessionStorage and
  // AuthProvider briefly sets authenticated=false before onIdTokenChanged
  // fires — causing the dashboard to redirect to /auth and creating a loop.
  // Using state (not a ref) so that when the timer fires, React re-renders
  // and the redirect useEffect below can detect the expired grace period.
  const [unauthGraceExpired, setUnauthGraceExpired] = useState(false);
  const graceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSetupPage = pathname === "/dashboard/setup";

  useEffect(() => {
    setSetupRedirectBypass(hasSetupRedirectBypass());
  }, [pathname]);

  const requiresSetupCompletion = useMemo(() => {
    const role = workspaceUser?.role ?? "";
    const isPrimaryOwner = role === "owner" || role === "super_admin";
    const setupComplete =
      onboarding?.setup_completed || onboarding?.setup_skipped;

    return isPrimaryOwner && !setupComplete && !setupRedirectBypass;
  }, [
    onboarding?.setup_completed,
    onboarding?.setup_skipped,
    setupRedirectBypass,
    workspaceUser?.role,
  ]);

  useEffect(() => {
    if (onboarding?.setup_completed || onboarding?.setup_skipped) {
      clearSetupRedirectBypass();
      setSetupRedirectBypass(false);
    }
  }, [onboarding?.setup_completed, onboarding?.setup_skipped]);

  // Start a grace timer once loading flips to false while unauthenticated.
  // If the saaszo_session cookie is present, Firebase's onIdTokenChanged
  // might still be resolving — give it up to 3 seconds before redirecting.
  useEffect(() => {
    if (loading || authenticated) {
      // Reset grace state whenever we're loading or successfully authenticated
      setUnauthGraceExpired(false);
      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
        graceTimerRef.current = null;
      }
      return;
    }

    // Not loading, not authenticated:
    if (unauthGraceExpired) {
      // Grace period already over — proceed to redirect
      return;
    }

    // If there's no session cookie at all, skip grace period — user is genuinely signed out
    if (!hasSessionCookie()) {
      setUnauthGraceExpired(true);
      return;
    }

    // Cookie is present but AuthProvider says unauthenticated — give Firebase
    // a chance to restore the session via onIdTokenChanged.
    if (!graceTimerRef.current) {
      graceTimerRef.current = setTimeout(() => {
        graceTimerRef.current = null;
        // Setting state triggers a re-render so the redirect useEffect below
        // can fire. Do NOT call router.refresh() here — that re-runs the
        // middleware which sees the session cookie and bounces the user back
        // to /dashboard, creating an infinite redirect loop.
        setUnauthGraceExpired(true);
      }, 3000);
    }
  }, [authenticated, loading, unauthGraceExpired]);

  // Cleanup grace timer on unmount
  useEffect(() => {
    return () => {
      if (graceTimerRef.current) {
        clearTimeout(graceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (loading || authenticated) {
      return;
    }

    // Only redirect after the grace period has expired
    if (!unauthGraceExpired) {
      return;
    }

    const query =
      typeof window === "undefined" ? "" : window.location.search || "";
    const redirectTarget = pathname
      ? `${pathname}${query}`
      : "/dashboard";

    router.replace(`/auth?redirect=${encodeURIComponent(redirectTarget)}`);
  }, [authenticated, loading, pathname, router, unauthGraceExpired]);

  useEffect(() => {
    if (loading || !authenticated || !requiresSetupCompletion || isSetupPage) {
      return;
    }

    router.replace("/dashboard/setup");
  }, [authenticated, isSetupPage, loading, requiresSetupCompletion, router]);

  if (
    loading ||
    !authenticated ||
    (requiresSetupCompletion && !isSetupPage)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-slate-500">
            Preparing your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
