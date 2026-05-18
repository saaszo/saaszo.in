"use client";

import { startTransition, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useAuthSession } from "@/components/AuthProvider";

export default function DashboardLayout(props: LayoutProps<"/dashboard">) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, loading, onboarding, workspaceUser } = useAuthSession();
  const { children } = props;

  const isSetupPage = pathname === "/dashboard/setup";

  const requiresSetupCompletion = useMemo(() => {
    const role = workspaceUser?.role ?? "";
    const isPrimaryOwner = role === "owner" || role === "super_admin";
    const setupComplete =
      onboarding?.setup_completed || onboarding?.setup_skipped;

    return isPrimaryOwner && !setupComplete;
  }, [
    onboarding?.setup_completed,
    onboarding?.setup_skipped,
    workspaceUser?.role,
  ]);

  useEffect(() => {
    if (loading || authenticated) {
      return;
    }

    const query =
      typeof window === "undefined" ? "" : window.location.search || "";
    const redirectTarget = pathname
      ? `${pathname}${query}`
      : "/dashboard";

    startTransition(() => {
      router.replace(`/auth?redirect=${encodeURIComponent(redirectTarget)}`);
    });
  }, [authenticated, loading, pathname, router]);

  useEffect(() => {
    if (loading || !authenticated || !requiresSetupCompletion || isSetupPage) {
      return;
    }

    startTransition(() => {
      router.replace("/dashboard/setup");
    });
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
