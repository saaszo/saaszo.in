"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useAuthSession,
  type BranchInfo,
  type StaffMember,
  type RoleTemplate,
  type PermissionGroup,
} from "@/components/AuthProvider";
import {
  clearSetupRedirectBypass,
  hasSetupRedirectBypass,
} from "@/lib/auth-client";
import { appConfig } from "@/lib/config";
import {
  executionPhases,
  FOUNDER_USER_TARGET,
  getPlanAudience,
  getPlanDisplayName,
  getPlanFounderPriceSummary,
  growthMilestones,
} from "@/lib/pricing-plans";
import {
  meetsPasswordRequirements,
  resolveSafeRedirectTarget,
  toSafeAbsoluteUrl,
  cn,
} from "@/lib/utils";
import { SvgBarChart, SvgAreaChart } from "@/components/dashboard/dashboard-charts";

// ─── Product definitions ───────────────────────────────────────────────────
type ProductStatus = "active" | "coming_soon";
type ProductAccessState =
  | "open"
  | "coming_soon"
  | "locked_inactive"
  | "no_access"
  | "upgrade_plan"
  | "setup_required"
  | "login_required"
  | "restricted";

type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  tool: string;
  status: ProductStatus;
  color: string;        // CSS gradient for icon/button bg
  accentColor: string;  // solid color for tagline/accents
  badge?: string;
  ctaText?: string;
};

const PRODUCTS: Product[] = [
  {
    id: "invoice",
    name: "Invoice & Billing",
    tagline: "GST Invoices · Billing · Collections",
    description:
      "Create GST invoices, track receivables, manage billing workflows, share invoices, and run professional business reports.",
    icon: "receipt_long",
    tool: "invoice",
    status: "active",
    color: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
    accentColor: "#3b82f6",
    ctaText: "Open App",
  },
];

const INVOICE_BRIDGE_FALLBACK_URL =
  "https://invoice.saaszo.in/auth-bridge?redirect=%2Fdashboard";
const TASK_BRIDGE_FALLBACK_URL =
  "https://task.saaszo.in/auth-bridge?redirect=%2Ftask-manager";
const ENGAGE_BRIDGE_FALLBACK_URL =
  "https://engage.saaszo.in/auth-bridge?redirect=%2Fdashboard";
const SELLER_BRIDGE_FALLBACK_URL =
  "https://seller.saaszo.in/auth-bridge?redirect=%2Fdashboard";
const HRMS_BRIDGE_FALLBACK_URL =
  "https://hrms.saaszo.in/auth-bridge?redirect=%2Fdashboard";

// ──────────────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const {
    auth,
    authenticated,
    error,
    loading,
    onboarding,
    postAuthRedirect,
    profile,
    workspaceUser,
    signOut,
    subscription,
    updatePassword,
    updateProfile,
    getHandoffToken,
    getBranches,
    saveBranch,
    deleteBranch,
    getStaff,
    saveStaff,
    deleteStaff,
    checkToolAccess,
  } = useAuthSession();

  const [formValues, setFormValues] = useState({
    fullName: "",
    companyName: "",
    phone: "",
    avatarUrl: "",
  });
  const [profileNotice, setProfileNotice] = useState("");
  const [passwordNotice, setPasswordNotice] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordValues, setPasswordValues] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [launchingTool, setLaunchingTool] = useState<string | null>(null);
  const [launchError, setLaunchError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "branches" | "team" | "settings"
  >("overview");
  const [toolStates, setToolStates] = useState<
    Record<
      string,
      {
        state: ProductAccessState;
        message?: string;
        redirectUrl?: string;
        ctaText?: string;
      }
    >
  >({});

  const [branches, setBranches] = useState<BranchInfo[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isBranchesLoading, setIsBranchesLoading] = useState(false);
  const [isStaffLoading, setIsStaffLoading] = useState(false);
  const [setupRedirectBypass, setSetupRedirectBypass] = useState(false);

  useEffect(() => {
    setSetupRedirectBypass(hasSetupRedirectBypass());
  }, []);

  const roleLabel = useMemo(() => {
    const role = workspaceUser?.role ?? "owner";
    return role
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }, [workspaceUser?.role]);

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

  const isOwnerOrAdmin = useMemo(
    () =>
      ["owner", "super_admin", "branch_admin"].includes(
        workspaceUser?.role ?? "",
      ),
    [workspaceUser?.role],
  );

  const activeBranches = useMemo(
    () => branches.filter((branch) => branch.is_active).length,
    [branches],
  );

  const activeStaff = useMemo(
    () => staff.filter((member) => member.is_active).length,
    [staff],
  );

  const activeProductCount = useMemo(
    () =>
      Object.values(toolStates).filter((entry) => entry.state === "open")
        .length || 1,
    [toolStates],
  );
  const subscriptionHint = useMemo(() => {
    if (!subscription) {
      return "Action Required";
    }

    if (subscription.status !== "active") {
      return "Action Required";
    }

    return `${getPlanAudience(subscription.planName)} · ${getPlanFounderPriceSummary(subscription.planName)}`;
  }, [subscription?.planName, subscription?.status]);
  const founderHint = useMemo(() => {
    if (!subscription) {
      return "Founder pricing details will appear here.";
    }

    if (subscription.founderPricingLocked) {
      return `Locked founder pricing · ${subscription.currentPaidCustomers ?? 0}/${subscription.founderPricingCustomerCap ?? FOUNDER_USER_TARGET} paid customers`;
    }

    return `${subscription.founderSlotsRemaining ?? 0} founder slots still visible`;
  }, [
    subscription?.currentPaidCustomers,
    subscription?.founderPricingCustomerCap,
    subscription?.founderPricingLocked,
    subscription?.founderSlotsRemaining,
  ]);
  const isDataLoading = isBranchesLoading || isStaffLoading;

  useEffect(() => {
    if (
      !loading &&
      authenticated &&
      requiresSetupCompletion &&
      postAuthRedirect?.includes("/dashboard/setup")
    ) {
      startTransition(() => {
        router.replace("/dashboard/setup");
      });
    }
  }, [
    authenticated,
    loading,
    postAuthRedirect,
    requiresSetupCompletion,
    router,
  ]);

  useEffect(() => {
    if (!loading && authenticated && requiresSetupCompletion) {
      startTransition(() => {
        router.replace("/dashboard/setup");
      });
    }
  }, [authenticated, loading, requiresSetupCompletion, router]);

  useEffect(() => {
    const syncTabFromUrl = () => {
      const requestedTab = new URLSearchParams(window.location.search).get(
        "tab",
      );
      if (
        requestedTab === "branches" ||
        requestedTab === "team" ||
        requestedTab === "settings" ||
        requestedTab === "overview"
      ) {
        setActiveTab(requestedTab);
        return;
      }

      setActiveTab("overview");
    };

    syncTabFromUrl();
    window.addEventListener("popstate", syncTabFromUrl);
    return () => window.removeEventListener("popstate", syncTabFromUrl);
  }, []);

  useEffect(() => {
    if (!profile) return;
    setFormValues({
      fullName: profile.fullName ?? "",
      companyName: profile.companyName ?? "",
      phone: profile.phone ?? "",
      avatarUrl: profile.avatarUrl ?? "",
    });
  }, [profile]);

  useEffect(() => {
    if (
      !loading &&
      authenticated &&
      workspaceUser &&
      (activeTab === "branches" || activeTab === "overview")
    ) {
      void loadBranches();
    }
    if (
      !loading &&
      authenticated &&
      workspaceUser &&
      (activeTab === "team" || activeTab === "overview")
    ) {
      void loadStaff();
    }
  }, [authenticated, activeTab, loading, workspaceUser]);

  useEffect(() => {
    if (!authenticated || activeTab !== "overview") {
      return;
    }

    void loadToolStates();
  }, [
    authenticated,
    activeTab,
    workspaceUser?.role,
    subscription?.planName,
    onboarding?.setup_completed,
  ]);

  async function loadBranches() {
    setIsBranchesLoading(true);
    try {
      const data = await getBranches();
      setBranches(data);
    } catch (error) {
      console.error("loadBranches error:", error);
      setBranches([]);
    } finally {
      setIsBranchesLoading(false);
    }
  }

  async function loadStaff() {
    setIsStaffLoading(true);
    try {
      const data = await getStaff();
      setStaff(data);
    } catch (error) {
      console.error("loadStaff error:", error);
      setStaff([]);
    } finally {
      setIsStaffLoading(false);
    }
  }

  async function loadToolStates() {
    const nextStates: Record<
      string,
      {
        state: ProductAccessState;
        message?: string;
        redirectUrl?: string;
        ctaText?: string;
      }
    > = {};

    await Promise.all(
      PRODUCTS.map(async (product) => {
        if (product.status !== "active") {
          nextStates[product.tool] = {
            state: "coming_soon",
            ctaText: product.ctaText ?? "Coming Soon",
          };
          return;
        }

        const access = await checkToolAccess(product.tool);

        if (access.allowed) {
          nextStates[product.tool] = {
            state: "open",
            ctaText: product.ctaText ?? "Open App",
          };
          return;
        }

        const mappedState: ProductAccessState =
          access.status === "inactive_user"
            ? "locked_inactive"
            : access.status === "plan_required"
              ? "upgrade_plan"
              : access.status === "setup_incomplete"
                ? "setup_required"
                : access.status === "unauthenticated"
                  ? "login_required"
                  : access.status === "tool_blocked"
                    ? "no_access"
                    : "restricted";

        nextStates[product.tool] = {
          state: mappedState,
          message:
            mappedState === "upgrade_plan" && access.requiredPlan
              ? `${access.message} Upgrade to ${getPlanDisplayName(access.requiredPlan)} to unlock ${product.name}.`
              : access.message,
          redirectUrl: access.redirectUrl,
          ctaText:
            mappedState === "upgrade_plan"
              ? "Upgrade Plan"
              : mappedState === "setup_required"
                ? "Complete Setup"
                : mappedState === "login_required"
                  ? "Sign In"
                  : mappedState === "no_access"
                    ? "No Access"
                    : mappedState === "locked_inactive"
                      ? "Account Locked"
                      : "Restricted",
        };
      }),
    );

    setToolStates(nextStates);
  }

  if (loading || (authenticated && requiresSetupCompletion)) {
    return (
      <div className="min-h-screen bg-background text-slate-900 flex items-center justify-center px-6">
        <div className="rounded-none border border-slate-200 bg-white px-8 py-6 shadow-xs">
          <p className="text-lg font-semibold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !profile || !auth || !subscription) {
    return null;
  }

  function navigateToTab(tab: "overview" | "branches" | "team" | "settings") {
    setActiveTab(tab);
    router.replace(
      tab === "overview" ? "/dashboard" : `/dashboard?tab=${tab}`,
      { scroll: false },
    );
  }

  async function handleLaunchProduct(product: Product) {
    const access = toolStates[product.tool];

    if (product.status !== "active" || !access || access.state !== "open") {
      if (access?.redirectUrl) {
        window.location.assign(
          resolveSafeRedirectTarget(access.redirectUrl, appConfig.appUrl),
        );
      }
      return;
    }

    setLaunchingTool(product.tool);
    setLaunchError("");
    const pendingWindow = window.open("about:blank", "_blank");
    if (pendingWindow) {
      try {
        pendingWindow.opener = null;
      } catch {
        // Ignore browser-specific readonly opener behavior.
      }
      pendingWindow.document.title = `${product.name} - SaaSzo`;
    }

    const { redirectUrl, error: handoffError } = await getHandoffToken(
      product.tool,
    );
    const fallbackRedirectUrl =
      product.tool === "invoice"
        ? INVOICE_BRIDGE_FALLBACK_URL
        : product.tool === "task"
          ? TASK_BRIDGE_FALLBACK_URL
          : product.tool === "engage"
            ? ENGAGE_BRIDGE_FALLBACK_URL
            : product.tool === "seller"
              ? SELLER_BRIDGE_FALLBACK_URL
            : product.tool === "hrms"
              ? HRMS_BRIDGE_FALLBACK_URL
            : undefined;
    const safeRedirectUrl = toSafeAbsoluteUrl(redirectUrl, appConfig.appUrl);
    const safeFallbackRedirectUrl = toSafeAbsoluteUrl(
      fallbackRedirectUrl,
      appConfig.appUrl,
    );

    if (handoffError || !safeRedirectUrl) {
      if (safeFallbackRedirectUrl) {
        if (pendingWindow) {
          pendingWindow.location.href = safeFallbackRedirectUrl;
        } else {
          setLaunchError(
            "Popup blocked. Please allow popups for SaaSzo and try again.",
          );
        }
        setLaunchingTool(null);
        return;
      }

      pendingWindow?.close();
      setLaunchError(
        handoffError ?? "Could not launch product. Please try again.",
      );
      setLaunchingTool(null);
      return;
    }

    if (!pendingWindow) {
      setLaunchError(
        "Popup blocked. Please allow popups for SaaSzo and try again.",
      );
      setLaunchingTool(null);
      return;
    }

    pendingWindow.location.href = safeRedirectUrl;
    setLaunchingTool(null);
  }

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProfile(true);
    setProfileNotice("");
    const result = await updateProfile(formValues);
    setProfileNotice(
      result.error ? result.error : "Profile saved successfully.",
    );
    setIsSavingProfile(false);
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordNotice("");
    if (!meetsPasswordRequirements(passwordValues.newPassword)) {
      setPasswordNotice(
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      );
      return;
    }
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setPasswordNotice("Passwords do not match.");
      return;
    }
    setIsSavingPassword(true);
    const result = await updatePassword(passwordValues.newPassword);
    setPasswordNotice(
      result.error ? result.error : "Password updated successfully.",
    );
    if (!result.error) {
      setPasswordValues({ newPassword: "", confirmPassword: "" });
    }
    setIsSavingPassword(false);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* ── Page Header & Tab Pills ──────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back{profile.fullName ? `, ${profile.fullName.split(" ")[0]}` : ""}.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Manage your store branches, billing operations, team members, and productivity tools.
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-none border border-slate-200/70 overflow-x-auto self-start sm:self-auto shrink-0 shadow-2xs">
          <TabButton
            active={activeTab === "overview"}
            onClick={() => navigateToTab("overview")}
            icon="dashboard"
            label="Overview"
          />
          <TabButton
            active={activeTab === "branches"}
            onClick={() => navigateToTab("branches")}
            icon="storefront"
            label="Branches"
            count={branches.length || undefined}
          />
          <TabButton
            active={activeTab === "team"}
            onClick={() => navigateToTab("team")}
            icon="groups"
            label="Team"
            count={staff.length || undefined}
          />
          <TabButton
            active={activeTab === "settings"}
            onClick={() => navigateToTab("settings")}
            icon="settings"
            label="Settings"
          />
        </div>
      </div>

      <div className="space-y-8">
        {activeTab === "overview" && (
          <div className="space-y-16 animate-in fade-in duration-500">
            {/* ── Section 1: Overview Cards ────────────────────────────────── */}
            <section>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <StatCard
                  label="Active Products"
                  value={String(activeProductCount)}
                  hint={
                    activeProductCount > 1
                      ? "Multiple tools available"
                      : "Invoice & Billing is ready"
                  }
                  icon="apps"
                />
                <StatCard
                  label="Active Branches"
                  value={String(activeBranches)}
                  hint={branches.length > 0 ? branches[0].name : "No branches"}
                  icon="storefront"
                />
                <StatCard
                  label="Team Members"
                  value={String(activeStaff || 1)}
                  hint={activeStaff > 0 ? "Managed Team" : "Owner Account"}
                  icon="groups"
                />
                <StatCard
                  label="Subscription"
                  value={subscription.planName}
                  hint={subscriptionHint}
                  icon="workspace_premium"
                  trend={subscription.status === "active" ? "up" : "down"}
                />
                <StatCard
                  label="Founder Pricing"
                  value={
                    subscription.founderPricingLocked ? "Locked" : "Open"
                  }
                  hint={founderHint}
                  icon="local_activity"
                  trend={subscription.founderPricingLocked ? "up" : "neutral"}
                />
                <StatCard
                  label="Setup Status"
                  value={onboarding?.setup_completed ? "100%" : "65%"}
                  hint={
                    onboarding?.setup_completed ? "Completed" : "In Progress"
                  }
                  icon="task_alt"
                  trend={onboarding?.setup_completed ? "up" : "neutral"}
                />
                <StatCard
                  label="Profile Status"
                  value={profile.profileCompleted ? "100%" : "80%"}
                  hint={profile.profileCompleted ? "Complete" : "Needs Details"}
                  icon="account_circle"
                  trend={profile.profileCompleted ? "up" : "neutral"}
                />
              </div>

              {/* ── Live Sales & Activity Pulse (SVG Charts) ────────────────── */}
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="rounded-none border border-slate-200/80 bg-white p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Weekly Billing Momentum
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Daily invoice & POS counter transactions
                      </p>
                    </div>
                    <span className="rounded-none bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      +18.4% this week
                    </span>
                  </div>
                  <SvgBarChart
                    data={[
                      { label: "Mon", value: 14 },
                      { label: "Tue", value: 22 },
                      { label: "Wed", value: 18 },
                      { label: "Thu", value: 35 },
                      { label: "Fri", value: 42 },
                      { label: "Sat", value: 58 },
                      { label: "Sun", value: 49 },
                    ]}
                    valueSuffix=" bills"
                    height={190}
                  />
                </div>

                <div className="rounded-none border border-slate-200/80 bg-white p-6 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                        Revenue Trajectory
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Estimated collection & retail receivables
                      </p>
                    </div>
                    <span className="rounded-none bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                      Live Pulse
                    </span>
                  </div>
                  <SvgAreaChart
                    data={[
                      { label: "W1", value: 24000 },
                      { label: "W2", value: 42000 },
                      { label: "W3", value: 38000 },
                      { label: "W4", value: 65000 },
                      { label: "W5", value: 89000 },
                      { label: "W6", value: 112000 },
                    ]}
                    valuePrefix="₹"
                    height={190}
                  />
                </div>
              </div>

              <div className="mt-6 rounded-none border border-slate-200/80 bg-white p-6 shadow-2xs">
                <p className="text-xs font-bold tracking-wider uppercase text-indigo-600">
                  Included In Your Plan
                </p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {subscription.headline ?? "Core workspace access"}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(subscription.includedFeatures ?? []).map((feature) => (
                    <span
                      key={feature}
                      className="rounded-none border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-none border border-slate-200/80 bg-white p-6 shadow-2xs">
                  <p className="text-xs font-bold tracking-wider uppercase text-indigo-600">
                    Founder Milestones
                  </p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    Pricing rises only after the product proves retention and trust.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {growthMilestones.map((milestone) => (
                      <div
                        key={milestone.key}
                        className="rounded-none border border-slate-200/70 bg-slate-50 p-3.5"
                      >
                        <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {milestone.title}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-slate-800">
                          {milestone.goal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-none border border-slate-200/80 bg-white p-6 shadow-2xs">
                  <p className="text-xs font-bold tracking-wider uppercase text-indigo-600">
                    Shipping Phases
                  </p>
                  <p className="mt-1 text-base font-bold text-slate-900">
                    Operational depth expands in a fixed execution order.
                  </p>
                  <div className="mt-4 space-y-2.5">
                    {executionPhases.map((phase, index) => (
                      <div
                        key={phase.key}
                        className="rounded-none border border-slate-200/70 bg-slate-50 p-3.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-none bg-indigo-100 text-[11px] font-bold text-indigo-700">
                            {index + 1}
                          </span>
                          <p className="text-xs font-bold text-slate-900">
                            {phase.title}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-slate-500">
                          {phase.goal}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Section 2: Active Products ────────────────────────────────── */}
            <section id="products">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black tracking-tight">
                    Your Business Suite
                  </h2>
                  <p className="mt-2 text-slate-500 font-medium opacity-70">
                    Switch between tools or explore new solutions for your
                    business.
                  </p>
                </div>
              </div>

              {launchError && (
                <div className="mb-8 p-6 rounded-none bg-error/10 border border-error/20 text-error font-bold flex items-center gap-3 animate-in slide-in-from-top-4">
                  <span className="material-symbols-outlined">error</span>
                  {launchError}
                </div>
              )}

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {PRODUCTS.map((product) => {
                  const fallbackState =
                    product.status === "active"
                      ? {
                          state: "open" as ProductAccessState,
                          ctaText: product.ctaText ?? "Open App",
                        }
                      : {
                          state: "coming_soon" as ProductAccessState,
                          ctaText: product.ctaText ?? "Coming Soon",
                        };
                  const access = toolStates[product.tool] ?? fallbackState;

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isLaunching={launchingTool === product.tool}
                      onLaunch={handleLaunchProduct}
                      accessState={access.state}
                      ctaText={access.ctaText}
                      message={access.message}
                    />
                  );
                })}
              </div>
            </section>

            {/* ── Quick Actions ────────────────────────────────────────── */}
            <section id="quick-actions">
              <div className="mb-8">
                <h2 className="text-3xl font-black tracking-tight">
                  Quick Actions
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <QuickActionCard
                  title="Add Branch"
                  icon="add_business"
                  onClick={() => navigateToTab("branches")}
                  primary
                  disabled={!isOwnerOrAdmin}
                />
                <QuickActionCard
                  title="Add Staff"
                  icon="person_add"
                  onClick={() => navigateToTab("team")}
                  disabled={!isOwnerOrAdmin}
                />
                <QuickActionCard
                  title="New Invoice"
                  icon="description"
                  onClick={() => handleLaunchProduct(PRODUCTS[0])}
                />
                <QuickActionCard
                  title="Reports"
                  icon="analytics"
                  onClick={() => handleLaunchProduct(PRODUCTS[0])}
                />
                <QuickActionCard
                  title="Settings"
                  icon="settings_applications"
                  onClick={() => navigateToTab("settings")}
                />
                <QuickActionCard
                  title="Support"
                  icon="help_center"
                  href="https://saaszo.in/support"
                />
              </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-[1.2fr,0.8fr]">
              <div className="rounded-none border border-slate-200/80 bg-white p-8 shadow-[0_12px_32px_rgba(25,28,30,0.04)]">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">
                      Branch & Team Snapshot
                    </h2>
                    <p className="mt-2 text-sm font-medium text-slate-500 opacity-70">
                      Review how your business is structured before assigning
                      deeper permissions.
                    </p>
                  </div>
                  <button
                    onClick={() => navigateToTab("team")}
                    className="rounded-none border border-slate-200/80 px-5 py-3 text-xs font-black uppercase tracking-wider text-primary transition-colors hover:bg-primary/5"
                  >
                    Manage Team
                  </button>
                </div>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <ReadOnlyCard
                    icon="storefront"
                    label="Branch Model"
                    value={
                      activeBranches > 1 ? "Multi-Branch" : "Single Branch"
                    }
                    helper={
                      activeBranches > 1
                        ? `${activeBranches} active branches in control.`
                        : "Main branch currently active."
                    }
                  />
                  <ReadOnlyCard
                    icon="admin_panel_settings"
                    label="Admin Controls"
                    value={isOwnerOrAdmin ? "Enabled" : "Limited"}
                    helper={
                      isOwnerOrAdmin
                        ? "You can manage branches, staff, and access."
                        : "Only admins can edit control settings."
                    }
                  />
                  <ReadOnlyCard
                    icon="person_check"
                    label="Active Staff"
                    value={String(activeStaff || 1)}
                    helper={
                      activeStaff > 0
                        ? "Employees with current access."
                        : "Only owner account is active."
                    }
                  />
                  <ReadOnlyCard
                    icon="shield_lock"
                    label="Access Scope"
                    value={
                      workspaceUser?.branch_scope === "all"
                        ? "All Branches"
                        : "Assigned Branch"
                    }
                    helper={
                      workspaceUser?.branch_scope === "all"
                        ? "This account can work across all branches."
                        : "This account is branch-limited by default."
                    }
                  />
                </div>
              </div>

              <div className="rounded-none border border-slate-200/80 bg-white p-8 shadow-[0_12px_32px_rgba(25,28,30,0.04)]">
                <h2 className="text-2xl font-black tracking-tight">
                  Workspace Guardrails
                </h2>
                <div className="mt-8 space-y-4">
                  <GuardrailItem
                    icon="workspace_premium"
                    label="Subscription"
                    value={
                      subscription.status === "active"
                        ? "Healthy"
                        : "Needs attention"
                    }
                    tone={subscription.status === "active" ? "good" : "warn"}
                  />
                  <GuardrailItem
                    icon="task_alt"
                    label="Onboarding"
                    value={
                      onboarding?.setup_completed ? "Completed" : "Resume setup"
                    }
                    tone={onboarding?.setup_completed ? "good" : "warn"}
                  />
                  <GuardrailItem
                    icon="badge"
                    label="Role Control"
                    value={roleLabel}
                    tone="neutral"
                  />
                  <GuardrailItem
                    icon="verified_user"
                    label="Security"
                    value={
                      auth.primaryProvider === "Password"
                        ? "Password account"
                        : `${auth.primaryProvider} linked`
                    }
                    tone="neutral"
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "branches" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <BranchesView
              branches={branches}
              onRefresh={loadBranches}
              onSave={saveBranch}
              onDelete={deleteBranch}
              isLoading={isDataLoading}
              canManage={isOwnerOrAdmin}
            />
          </div>
        )}

        {activeTab === "team" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <TeamView
              staff={staff}
              branches={branches}
              onRefresh={loadStaff}
              onSave={saveStaff}
              onDelete={deleteStaff}
              isLoading={isDataLoading}
              canManage={isOwnerOrAdmin}
            />
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-16 animate-in fade-in duration-500">
            {/* ── Company Profile Section ───────────────────────── */}
            <section id="profile" className="grid lg:grid-cols-3 gap-12 pt-8">
              <div className="lg:col-span-1">
                <h2 className="text-3xl font-black tracking-tight">
                  Business Profile
                </h2>
                <p className="mt-4 text-slate-500 text-base font-medium leading-relaxed opacity-70">
                  Update your business identity. These details appear on your
                  invoices and documents.
                </p>

                <div className="mt-8 p-8 rounded-none bg-primary/5 border border-primary/10">
                  <div className="flex items-center gap-3 text-primary mb-4">
                    <span className="material-symbols-outlined text-2xl font-bold">
                      verified
                    </span>
                    <span className="font-black text-xs uppercase tracking-widest">
                      Verified Business
                    </span>
                  </div>
                  <div className="space-y-4">
                    <ProfileInfoItem
                      label="Legal Name"
                      value={profile.companyName || "Not set"}
                      icon="business"
                    />
                    <ProfileInfoItem
                      label="Admin"
                      value={profile.fullName || "Not set"}
                      icon="person"
                    />
                    <ProfileInfoItem
                      label="Plan"
                      value={subscription.planName}
                      icon="workspace_premium"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-none p-8 md:p-12 border border-slate-200/80 shadow-[0_24px_64px_rgba(25,28,30,0.04)]">
                <form className="space-y-8" onSubmit={handleProfileSubmit}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <Field
                      label="Full Name"
                      value={formValues.fullName}
                      onChange={(v) =>
                        setFormValues((c) => ({ ...c, fullName: v }))
                      }
                      placeholder="Your legal name"
                    />
                    <Field
                      label="Company Name"
                      value={formValues.companyName}
                      onChange={(v) =>
                        setFormValues((c) => ({ ...c, companyName: v }))
                      }
                      placeholder="SaaSzo Pvt Ltd"
                    />
                    <Field
                      label="Mobile Number"
                      value={formValues.phone}
                      onChange={(v) =>
                        setFormValues((c) => ({ ...c, phone: v }))
                      }
                      placeholder="+91 99999 99999"
                    />
                    <Field
                      label="Profile Image URL"
                      value={formValues.avatarUrl}
                      onChange={(v) =>
                        setFormValues((c) => ({ ...c, avatarUrl: v }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  {profileNotice && (
                    <div
                      className={`p-6 rounded-none text-sm font-bold animate-in zoom-in-95 duration-300 ${profileNotice.includes("successfully") ? "bg-primary/10 text-primary border border-primary/20" : "bg-error/10 text-error border border-error/20"}`}
                    >
                      {profileNotice}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="w-full md:w-auto px-12 py-5 rounded-none text-white font-bold text-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-primary/20"
                    style={{
                      background:
                        "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
                    }}
                  >
                    {isSavingProfile ? "Saving Changes..." : "Save Profile"}
                  </button>
                </form>
              </div>
            </section>

            {/* ── Security Section ───────────────────── */}
            <section
              id="security"
              className="grid lg:grid-cols-3 gap-12 border-t border-slate-100 pt-16"
            >
              <div className="lg:col-span-1">
                <h2 className="text-3xl font-black tracking-tight">Security</h2>
                <p className="mt-4 text-slate-500 text-base font-medium leading-relaxed opacity-70">
                  Protect your workspace and manage how you access the platform.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 p-5 rounded-none bg-slate-50/50 border border-slate-100">
                    <div className="h-10 w-10 rounded-none bg-tertiary/10 text-tertiary flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">
                        vibration
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">Two-Factor Auth</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        Recommended
                      </p>
                    </div>
                    <div className="h-2 w-2 rounded-none bg-outline-variant/30" />
                  </div>
                  <div className="flex items-center gap-4 p-5 rounded-none bg-slate-50/50 border border-slate-100">
                    <div className="h-10 w-10 rounded-none bg-primary/10 text-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-xl">
                        history
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">Login History</p>
                      <p className="text-[10px] text-slate-500 font-medium">
                        View sessions
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 bg-white rounded-none p-8 md:p-12 border border-slate-200/80 shadow-[0_24px_64px_rgba(25,28,30,0.04)]">
                {auth.canChangePassword ? (
                  <form className="space-y-6" onSubmit={handlePasswordSubmit}>
                    <Field
                      label="New password"
                      type="password"
                      value={passwordValues.newPassword}
                      onChange={(v) =>
                        setPasswordValues((c) => ({ ...c, newPassword: v }))
                      }
                      placeholder="Minimum 8 characters"
                    />
                    <Field
                      label="Confirm password"
                      type="password"
                      value={passwordValues.confirmPassword}
                      onChange={(v) =>
                        setPasswordValues((c) => ({ ...c, confirmPassword: v }))
                      }
                      placeholder="Repeat your new password"
                    />
                    {passwordNotice && (
                      <div
                        className={`p-6 rounded-none text-sm font-bold animate-in zoom-in-95 duration-300 ${passwordNotice.includes("success") ? "bg-primary/10 text-primary border border-primary/20" : "bg-error/10 text-error border border-error/20"}`}
                      >
                        {passwordNotice}
                      </div>
                    )}
                    <button
                      type="submit"
                      disabled={isSavingPassword}
                      className="w-full py-5 rounded-none border border-slate-200/40 bg-slate-50 hover:bg-slate-50-high transition-all font-bold text-lg disabled:opacity-70 shadow-sm"
                    >
                      {isSavingPassword
                        ? "Updating Password..."
                        : "Save New Password"}
                    </button>
                  </form>
                ) : (
                  <div className="rounded-none bg-slate-50 p-10 border border-slate-200/80 shadow-inner">
                    <div className="flex items-start gap-6">
                      <div className="h-16 w-16 rounded-none bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <span className="material-symbols-outlined text-4xl">
                          verified_user
                        </span>
                      </div>
                      <div>
                        <p className="font-black text-2xl text-slate-900 tracking-tight">
                          Social Identity Active
                        </p>
                        <p className="text-lg text-slate-500 mt-3 font-medium leading-relaxed opacity-80">
                          You are authenticated via{" "}
                          <span className="text-primary font-bold">
                            {auth.primaryProvider}
                          </span>
                          . Password management and account security are handled
                          by your identity provider.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="lg:col-span-3 grid md:grid-cols-2 gap-8 mt-4">
                <div className="bg-white rounded-none p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="h-12 w-12 rounded-none bg-error/10 text-error flex items-center justify-center mb-6">
                      <span className="material-symbols-outlined text-2xl">
                        devices
                      </span>
                    </div>
                    <h3 className="text-xl font-black">Active Sessions</h3>
                    <p className="text-sm text-slate-500 font-medium mt-2 mb-6">
                      Sign out of all other active sessions across your browsers
                      and devices to secure your account.
                    </p>
                  </div>
                  <button className="w-full py-4 rounded-none font-bold text-error border border-error/20 hover:bg-error/10 transition-colors">
                    Sign Out All Devices
                  </button>
                </div>

                <div className="bg-white rounded-none p-8 border border-slate-200/80 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black">Security Audit</h3>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider border border-primary/20 px-2 py-1 rounded-none bg-primary/5">
                      Log
                    </span>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-start gap-4">
                      <div className="h-8 w-8 rounded-none bg-slate-50 flex items-center justify-center shrink-0 mt-1">
                        <span className="material-symbols-outlined text-[16px] text-slate-500">
                          login
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Successful Login</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Mac OS • Chrome
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500/70">
                        Just now
                      </span>
                    </div>
                    <div className="flex items-start gap-4 opacity-70">
                      <div className="h-8 w-8 rounded-none bg-slate-50 flex items-center justify-center shrink-0 mt-1">
                        <span className="material-symbols-outlined text-[16px] text-slate-500">
                          shield_person
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold">Tool Access Granted</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Admin updated permissions
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500/70">
                        Yesterday
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Management Views ──────────────────────────────────────────────────────

function BranchesView({
  branches,
  onRefresh,
  onSave,
  onDelete,
  isLoading,
  canManage,
}: {
  branches: BranchInfo[];
  onRefresh: () => void;
  onSave: (data: any) => Promise<any>;
  onDelete: (id: number) => Promise<any>;
  isLoading: boolean;
  canManage: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchInfo | null>(null);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            Business Branches
          </h2>
          <p className="mt-2 text-slate-500 font-medium opacity-70">
            Manage your physical locations, stores, and warehouses.
          </p>
        </div>
        {canManage ? (
          <button
            onClick={() => {
              setEditingBranch(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-6 py-4 rounded-none text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              background: "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
            }}
          >
            <span className="material-symbols-outlined">add_business</span>
            Add New Branch
          </button>
        ) : (
          <div className="rounded-none border border-slate-200/80 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500">
            View-only branch access
          </div>
        )}
      </div>

      {isLoading && branches.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <span className="h-12 w-12 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
          <p className="mt-4 font-bold text-slate-500">
            Fetching branches...
          </p>
        </div>
      ) : branches.length === 0 ? (
        <div className="py-20 rounded-none border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
          <div className="h-20 w-20 rounded-none bg-slate-50 flex items-center justify-center text-slate-500 mb-6">
            <span className="material-symbols-outlined text-4xl">
              storefront
            </span>
          </div>
          <h3 className="text-xl font-bold">No branches found</h3>
          <p className="mt-2 text-slate-500 max-w-sm font-medium">
            Start by adding your first branch. You can manage inventory and
            staff separately for each location.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <div
              key={branch.id}
              className="group rounded-none border border-slate-200/80 bg-white p-8 shadow-[0_12px_32px_rgba(25,28,30,0.04)] hover:shadow-[0_24px_64px_rgba(25,28,30,0.08)] transition-all"
            >
              <div className="flex items-start justify-between mb-6">
                <div
                  className={`px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-wider ${
                    branch.branch_type === "Main Branch"
                      ? "bg-primary/10 text-primary"
                      : "bg-tertiary/10 text-tertiary"
                  }`}
                >
                  {branch.branch_type}
                </div>
                <div className="flex items-center gap-2">
                  {canManage && (
                    <>
                      <button
                        onClick={() => {
                          setEditingBranch(branch);
                          setIsModalOpen(true);
                        }}
                        className="h-8 w-8 rounded-none hover:bg-slate-50 flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">
                          edit
                        </span>
                      </button>
                      <button
                        onClick={async () => {
                          if (
                            confirm(
                              "Are you sure you want to delete this branch?",
                            )
                          ) {
                            await onDelete(branch.id);
                            onRefresh();
                          }
                        }}
                        className="h-8 w-8 rounded-none hover:bg-error/10 hover:text-error flex items-center justify-center text-slate-500 transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">
                          delete
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h4 className="text-2xl font-black tracking-tight mb-1">
                {branch.name}
              </h4>
              <p className="text-xs font-bold text-primary mb-6">
                {branch.branch_code || "No Code"}
              </p>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-500 text-lg">
                    location_on
                  </span>
                  <span className="text-sm font-medium text-slate-900 line-clamp-1">
                    {branch.location || branch.city || "No Location"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-slate-500 text-lg">
                    groups
                  </span>
                  <span className="text-sm font-medium text-slate-900">
                    {branch.employee_count} Team Members
                  </span>
                </div>
              </div>

              {canManage ? (
                <button
                  onClick={() => {
                    setEditingBranch(branch);
                    setIsModalOpen(true);
                  }}
                  className="mt-8 w-full py-4 rounded-none bg-slate-50 font-bold text-sm hover:bg-slate-50-high transition-colors"
                >
                  Manage Branch
                </button>
              ) : (
                <div className="mt-8 w-full rounded-none border border-slate-200/80 bg-surface px-4 py-4 text-center text-sm font-semibold text-slate-500">
                  Branch details locked for your role
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {canManage && isModalOpen && (
        <BranchModal
          branch={editingBranch}
          onClose={() => setIsModalOpen(false)}
          onSave={async (data) => {
            const res = await onSave(data);
            if (res.success) {
              onRefresh();
              setIsModalOpen(false);
            } else {
              alert(res.message || "Failed to save branch");
            }
          }}
        />
      )}
    </div>
  );
}

function TeamView({
  staff,
  branches,
  onRefresh,
  onSave,
  onDelete,
  isLoading,
  canManage,
}: {
  staff: StaffMember[];
  branches: BranchInfo[];
  onRefresh: () => void;
  onSave: (data: any) => Promise<any>;
  onDelete: (id: number) => Promise<any>;
  isLoading: boolean;
  canManage: boolean;
}) {
  const { getStaffTemplates } = useAuthSession();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [branchFilter, setBranchFilter] = useState<string>("all");
  const [templates, setTemplates] = useState<{
    roles: Record<string, RoleTemplate>;
    groups: Record<string, PermissionGroup>;
  } | null>(null);

  useEffect(() => {
    getStaffTemplates().then(setTemplates);
  }, []);

  const filteredStaff =
    branchFilter === "all"
      ? staff
      : staff.filter((s) => s.branch_id.toString() === branchFilter);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">
            Team Management
          </h2>
          <p className="mt-2 text-slate-500 font-medium opacity-70">
            Add employees, assign roles, and manage tool permissions.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-4 py-4 rounded-none border border-slate-200 bg-surface outline-none focus:border-primary font-bold text-sm shadow-sm"
          >
            <option value="all">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
          {canManage ? (
            <button
              onClick={() => {
                setEditingStaff(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-4 rounded-none text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              style={{
                background: "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
              }}
            >
              <span className="material-symbols-outlined">person_add</span>
              Add Employee
            </button>
          ) : (
            <div className="rounded-none border border-slate-200/80 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-500">
              View-only team access
            </div>
          )}
        </div>
      </div>

      {isLoading && staff.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <span className="h-12 w-12 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
          <p className="mt-4 font-bold text-slate-500">
            Fetching team...
          </p>
        </div>
      ) : filteredStaff.length === 0 ? (
        <div className="py-20 rounded-none border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center px-6">
          <div className="h-20 w-20 rounded-none bg-slate-50 flex items-center justify-center text-slate-500 mb-6">
            <span className="material-symbols-outlined text-4xl">groups</span>
          </div>
          <h3 className="text-xl font-bold">No employees found</h3>
          <p className="mt-2 text-slate-500 max-w-sm font-medium">
            {branchFilter === "all"
              ? "Start by adding your first team member to manage your business operations."
              : "No employees are currently assigned to this branch."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-none border border-slate-200/80 shadow-[0_12px_32px_rgba(25,28,30,0.04)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Employee
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Role & Branch
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Tool Access
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {filteredStaff.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-none bg-primary/10 text-primary flex items-center justify-center font-black text-lg">
                          {member.name[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {member.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="px-2 py-1 inline-block rounded-none bg-slate-50 text-[10px] font-black uppercase tracking-wider mb-1">
                        {templates?.roles[member.role]?.name ||
                          member.role.replace("_", " ")}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-500">
                        <span className="material-symbols-outlined text-sm">
                          storefront
                        </span>
                        {member.branch_scope === "all"
                          ? "All Branches"
                          : member.branch_name}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-wrap gap-1.5">
                        {member.tool_access?.length > 0 ? (
                          member.tool_access.map((tool) => (
                            <span
                              key={tool}
                              className="px-2 py-0.5 rounded-none bg-primary/5 text-primary text-[10px] font-bold uppercase"
                            >
                              {tool}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] text-slate-500 italic opacity-50">
                            No tools assigned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {canManage ? (
                          <>
                            <button
                              onClick={() => {
                                setEditingStaff(member);
                                setIsPermissionModalOpen(true);
                              }}
                              className="h-10 w-10 rounded-none bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                              title="Manage Permissions"
                            >
                              <span className="material-symbols-outlined text-lg">
                                shield_person
                              </span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingStaff(member);
                                setIsModalOpen(true);
                              }}
                              className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={async () => {
                                if (
                                  confirm(
                                    "Are you sure you want to remove this employee?",
                                  )
                                ) {
                                  await onDelete(member.id);
                                  onRefresh();
                                }
                              }}
                              className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center text-slate-500 hover:text-error transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">
                                delete
                              </span>
                            </button>
                          </>
                        ) : (
                          <span className="text-xs font-semibold text-slate-500">
                            Limited
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {canManage && isModalOpen && (
        <StaffModal
          staff={editingStaff}
          branches={branches}
          onClose={() => setIsModalOpen(false)}
          onSave={async (data) => {
            const res = await onSave(data);
            if (res.success) {
              onRefresh();
              setIsModalOpen(false);
            } else {
              alert(res.message || "Failed to save staff");
            }
          }}
        />
      )}

      {canManage && isPermissionModalOpen && editingStaff && templates && (
        <PermissionModal
          staff={editingStaff}
          roles={templates.roles}
          groups={templates.groups}
          onClose={() => setIsPermissionModalOpen(false)}
          onSave={async (data) => {
            const res = await onSave({ ...editingStaff, ...data });
            if (res.success) {
              onRefresh();
              setIsPermissionModalOpen(false);
            } else {
              alert(res.message || "Failed to update permissions");
            }
          }}
        />
      )}
    </div>
  );
}

// ─── Modals ──────────────────────────────────────────────────────────────────

function BranchModal({
  branch,
  onClose,
  onSave,
}: {
  branch: BranchInfo | null;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [values, setValues] = useState({
    name: branch?.name || "",
    branch_code: branch?.branch_code || "",
    branch_type: branch?.branch_type || "Sub Branch",
    city: branch?.city || "",
    state: branch?.state || "",
    address: branch?.address || "",
    email: branch?.email || "",
    phone: branch?.phone || "",
    is_active: branch?.is_active ?? true,
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white rounded-none border border-slate-200 shadow-[0_40px_120px_rgba(25,28,30,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tight">
              {branch ? "Edit Branch" : "Add New Branch"}
            </h3>
            <p className="text-sm text-slate-500 font-medium opacity-70">
              Define location and contact details.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-12 w-12 rounded-none hover:bg-slate-50 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-8 py-8 max-h-[70vh] overflow-y-auto space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Field
              label="Branch Name"
              value={values.name}
              onChange={(v) => setValues((c) => ({ ...c, name: v }))}
              placeholder="e.g. Mumbai Central"
            />
            <Field
              label="Branch Code"
              value={values.branch_code}
              onChange={(v) => setValues((c) => ({ ...c, branch_code: v }))}
              placeholder="e.g. MUM01"
            />

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Branch Type
              </span>
              <select
                value={values.branch_type}
                onChange={(e) =>
                  setValues((c) => ({ ...c, branch_type: e.target.value }))
                }
                className="mt-2 w-full rounded-none border border-slate-200 bg-surface px-4 py-3 outline-none focus:border-primary transition-all"
              >
                <option value="Main Branch">Main Branch</option>
                <option value="Sub Branch">Sub Branch</option>
                <option value="Warehouse">Warehouse</option>
              </select>
            </label>

            <Field
              label="City"
              value={values.city}
              onChange={(v) => setValues((c) => ({ ...c, city: v }))}
              placeholder="City name"
            />
            <Field
              label="State"
              value={values.state}
              onChange={(v) => setValues((c) => ({ ...c, state: v }))}
              placeholder="State name"
            />
            <Field
              label="Contact Email"
              value={values.email}
              onChange={(v) => setValues((c) => ({ ...c, email: v }))}
              placeholder="branch@example.com"
            />
            <Field
              label="Contact Phone"
              value={values.phone}
              onChange={(v) => setValues((c) => ({ ...c, phone: v }))}
              placeholder="+91 ..."
            />
          </div>
          <Field
            label="Full Address"
            value={values.address || ""}
            onChange={(v) => setValues((c) => ({ ...c, address: v }))}
            placeholder="Street, Building, Area..."
          />
        </div>

        <div className="px-8 py-8 bg-slate-50/30 border-t border-slate-100 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-4 rounded-none font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...values, id: branch?.id })}
            className="px-10 py-4 rounded-none text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              background: "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
            }}
          >
            {branch ? "Update Branch" : "Create Branch"}
          </button>
        </div>
      </div>
    </div>
  );
}

function StaffModal({
  staff,
  branches,
  onClose,
  onSave,
}: {
  staff: StaffMember | null;
  branches: BranchInfo[];
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [values, setValues] = useState({
    name: staff?.name || "",
    email: staff?.email || "",
    password: "",
    role: staff?.role || "pos_staff",
    branch_id: staff?.branch_id || (branches.length > 0 ? branches[0].id : ""),
    branch_scope: staff?.branch_scope || "single",
    phone: staff?.phone || "",
    employee_id: staff?.employee_id || "",
    department: staff?.department || "",
    designation: staff?.designation || "",
    tool_access: staff?.tool_access || [],
  });

  const tools = [
    "invoice",
    "task",
    "seller",
    "crm",
    "hrms",
    "accounting",
  ];

  const toggleTool = (tool: string) => {
    setValues((c) => {
      const current = c.tool_access || [];
      const next = current.includes(tool)
        ? current.filter((t) => t !== tool)
        : [...current, tool];
      return { ...c, tool_access: next };
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-3xl bg-white rounded-none border border-slate-200 shadow-[0_40px_120px_rgba(25,28,30,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="px-8 py-8 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black tracking-tight">
              {staff ? "Edit Employee" : "Add New Employee"}
            </h3>
            <p className="text-sm text-slate-500 font-medium opacity-70">
              Assign roles and manage tool access.
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-12 w-12 rounded-none hover:bg-slate-50 flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-8 py-8 max-h-[70vh] overflow-y-auto space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
            <Field
              label="Full Name"
              value={values.name}
              onChange={(v) => setValues((c) => ({ ...c, name: v }))}
              placeholder="Legal name"
            />
            <Field
              label="Email Address"
              value={values.email}
              onChange={(v) => setValues((c) => ({ ...c, email: v }))}
              placeholder="email@company.com"
            />
            <Field
              label={staff ? "Change Password (optional)" : "Password"}
              type="password"
              value={values.password}
              onChange={(v) => setValues((c) => ({ ...c, password: v }))}
              placeholder="••••••••"
            />
            <Field
              label="Mobile Number"
              value={values.phone}
              onChange={(v) => setValues((c) => ({ ...c, phone: v }))}
              placeholder="+91 ..."
            />

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Assigned Branch
              </span>
              <select
                value={values.branch_id}
                onChange={(e) =>
                  setValues((c) => ({ ...c, branch_id: e.target.value }))
                }
                className="mt-2 w-full rounded-none border border-slate-200 bg-surface px-4 py-3 outline-none focus:border-primary transition-all"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-900">
                Branch Scope
              </span>
              <select
                value={values.branch_scope}
                onChange={(e) =>
                  setValues((c) => ({
                    ...c,
                    branch_scope: e.target.value as "all" | "single",
                  }))
                }
                className="mt-2 w-full rounded-none border border-slate-200 bg-surface px-4 py-3 outline-none focus:border-primary transition-all"
              >
                <option value="single">This Branch Only</option>
                <option value="all">All Branches</option>
              </select>
            </label>

            <Field
              label="Department"
              value={values.department}
              onChange={(v) => setValues((c) => ({ ...c, department: v }))}
              placeholder="e.g. Sales, Operations"
            />
            <Field
              label="Designation"
              value={values.designation}
              onChange={(v) => setValues((c) => ({ ...c, designation: v }))}
              placeholder="e.g. Senior Associate"
            />
          </div>

          <div>
            <span className="text-sm font-black uppercase tracking-widest text-slate-500 block mb-4">
              Tool Access Permissions
            </span>
            <div className="flex flex-wrap gap-3">
              {tools.map((tool) => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`px-6 py-3 rounded-none border font-bold text-xs transition-all ${
                    values.tool_access?.includes(tool)
                      ? "bg-primary border-primary text-white shadow-md"
                      : "bg-surface border-slate-200 text-slate-500 hover:border-primary/30"
                  }`}
                >
                  {tool.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-8 py-8 bg-slate-50/30 border-t border-slate-100 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-8 py-4 rounded-none font-bold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...values, id: staff?.id })}
            className="px-10 py-4 rounded-none text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            style={{
              background: "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
            }}
          >
            {staff ? "Update Employee" : "Create Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PermissionModal({
  staff,
  roles,
  groups,
  onClose,
  onSave,
}: {
  staff: StaffMember;
  roles: Record<string, RoleTemplate>;
  groups: Record<string, PermissionGroup>;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [selectedRole, setSelectedRole] = useState(staff.role);
  const [toolAccess, setToolAccess] = useState<string[]>(
    staff.tool_access || [],
  );
  const [overrides, setOverrides] = useState<Record<string, boolean>>(
    staff.permission_overrides || {},
  );
  const [branchScope, setBranchScope] = useState<"all" | "single">(
    staff.branch_scope || "single",
  );

  const applyPreset = (roleKey: string) => {
    const role = roles[roleKey];
    if (!role) return;
    setSelectedRole(roleKey);
    setToolAccess(role.tools);
    setOverrides(role.permissions);
    setBranchScope(role.branch_scope);
  };

  const togglePermission = (key: string) => {
    setOverrides((c) => ({ ...c, [key]: !c[key] }));
  };

  const toggleTool = (tool: string) => {
    setToolAccess((c) =>
      c.includes(tool) ? c.filter((t) => t !== tool) : [...c, tool],
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-6xl bg-white rounded-none border border-slate-200 shadow-[0_40px_120px_rgba(25,28,30,0.2)] flex flex-col md:flex-row h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Left Sidebar: Role Presets */}
        <div className="w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/20">
          <div className="p-8 border-b border-slate-100">
            <h3 className="text-xl font-black tracking-tight">Role Presets</h3>
            <p className="text-xs text-slate-500 font-medium mt-1 opacity-70">
              Apply a predefined access level.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
            {Object.entries(roles).map(([key, role]) => (
              <button
                key={key}
                onClick={() => applyPreset(key)}
                className={`w-full text-left p-4 rounded-none transition-all border ${
                  selectedRole === key
                    ? "bg-primary/10 border-primary/20 ring-1 ring-primary/20"
                    : "hover:bg-slate-50 border-transparent"
                }`}
              >
                <p
                  className={`font-bold text-sm ${selectedRole === key ? "text-primary" : "text-slate-900"}`}
                >
                  {role.name}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {role.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Detailed Permissions */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-none bg-primary/10 text-primary flex items-center justify-center font-black">
                {staff.name[0]}
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight">
                  {staff.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Configure individual access overrides.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="h-12 w-12 rounded-none hover:bg-slate-50 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-12 no-scrollbar">
            {/* Tool Access Grid */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <span className="h-1 w-4 rounded-none bg-primary" />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Tool Access
                </h4>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {Object.keys(groups).map((tool) => (
                  <button
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`flex items-center gap-3 p-4 rounded-none border transition-all ${
                      toolAccess.includes(tool)
                        ? "bg-primary text-white border-primary shadow-md"
                        : "bg-surface border-slate-200 text-slate-500"
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {tool === "invoice"
                        ? "receipt_long"
                        : tool === "task"
                          ? "task_alt"
                        : tool === "pos"
                          ? "restaurant"
                          : tool === "crm"
                            ? "contacts"
                            : tool === "hrms"
                              ? "badge"
                              : "account_balance"}
                    </span>
                    <span className="text-xs font-bold capitalize">{tool}</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Branch Scope */}
            <section>
              <div className="flex items-center gap-2 mb-6">
                <span className="h-1 w-4 rounded-none bg-tertiary" />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Branch Scope
                </h4>
              </div>
              <div className="flex gap-4 p-2 bg-slate-50/30 rounded-none border border-slate-100 max-w-sm">
                <button
                  onClick={() => setBranchScope("single")}
                  className={`flex-1 py-3 px-4 rounded-none text-xs font-bold transition-all ${branchScope === "single" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:bg-white/50"}`}
                >
                  Assigned Branch
                </button>
                <button
                  onClick={() => setBranchScope("all")}
                  className={`flex-1 py-3 px-4 rounded-none text-xs font-bold transition-all ${branchScope === "all" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:bg-white/50"}`}
                >
                  All Branches
                </button>
              </div>
              <p className="mt-3 text-[10px] text-slate-500 font-medium ml-2">
                {branchScope === "all"
                  ? "This user can view and manage data across all registered branches."
                  : `Access is restricted to the ${staff.branch_name || "assigned"} branch.`}
              </p>
            </section>

            {/* Grouped Permissions */}
            <section className="space-y-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-1 w-4 rounded-none bg-primary" />
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
                  Detailed Permissions
                </h4>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {Object.entries(groups).map(([toolKey, group]) => (
                  <div
                    key={toolKey}
                    className={`rounded-none border p-6 ${toolAccess.includes(toolKey) ? "border-slate-200 bg-slate-50/50" : "border-slate-100 opacity-40 grayscale pointer-events-none"}`}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-none bg-primary/10 text-primary flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg">
                            {toolKey === "invoice" ? "receipt_long" : "apps"}
                          </span>
                        </div>
                        <p className="font-black text-sm">{group.label}</p>
                      </div>
                      {!toolAccess.includes(toolKey) && (
                        <span className="text-[10px] font-bold uppercase text-slate-500">
                          Disabled
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      {Object.entries(group.actions).map(([permKey, label]) => (
                        <button
                          key={permKey}
                          onClick={() => togglePermission(permKey)}
                          className="w-full flex items-center justify-between p-3 rounded-none hover:bg-slate-50 transition-colors group"
                        >
                          <span className="text-xs font-medium text-slate-500 group-hover:text-slate-900">
                            {label}
                          </span>
                          <div
                            className={`h-5 w-9 rounded-none relative transition-colors duration-200 ${overrides[permKey] ? "bg-primary" : "bg-outline-variant/30"}`}
                          >
                            <div
                              className={`absolute top-1 h-3 w-3 rounded-none bg-white transition-all duration-200 ${overrides[permKey] ? "left-5" : "left-1"}`}
                            />
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex justify-end gap-4 shrink-0">
            <button
              onClick={onClose}
              className="px-8 py-4 rounded-none font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() =>
                onSave({
                  role: selectedRole,
                  tool_access: toolAccess,
                  permission_overrides: overrides,
                  branch_scope: branchScope,
                })
              }
              className="px-10 py-4 rounded-none text-white font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              style={{
                background: "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
              }}
            >
              Save Access Control
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── UI Helpers ────────────────────────────────────────────────────────────

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-none text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer select-none active:scale-[0.98]",
        active
          ? "bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200/80 font-bold"
          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50",
      )}
    >
      <span className="material-symbols-rounded text-[18px]">
        {icon}
      </span>
      <span>{label}</span>
      {count !== undefined && (
        <span
          className={cn(
            "text-[10px] px-1.5 py-0.5 rounded-none font-bold",
            active
              ? "bg-indigo-100 text-indigo-700"
              : "bg-slate-200 text-slate-600",
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function ProductCard({
  product,
  isLaunching,
  onLaunch,
  accessState = "open",
  ctaText,
  message,
}: {
  product: Product;
  isLaunching: boolean;
  onLaunch: (p: Product) => void;
  accessState?: string;
  ctaText?: string;
  message?: string;
}) {
  const isActive = accessState === "open";
  const isActionable =
    accessState === "open" ||
    accessState === "upgrade_plan" ||
    accessState === "setup_required" ||
    accessState === "login_required";

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-none border bg-white p-6 shadow-2xs transition-all duration-200",
        isActive
          ? "border-slate-200/80 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5"
          : "border-slate-200/50 bg-slate-50/70 opacity-90",
      )}
    >
      {/* Badge */}
      {accessState === "locked_inactive" && (
        <span className="absolute top-5 right-5 rounded-none bg-rose-50 text-rose-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-rose-200/60">
          Locked
        </span>
      )}
      {accessState === "no_access" && (
        <span className="absolute top-5 right-5 rounded-none bg-slate-100 text-slate-600 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-slate-200">
          No Access
        </span>
      )}
      {accessState === "upgrade_plan" && (
        <span className="absolute top-5 right-5 rounded-none bg-indigo-50 text-indigo-700 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border border-indigo-200/60">
          Premium
        </span>
      )}
      {accessState === "coming_soon" && product.badge && (
        <span className="absolute top-5 right-5 rounded-none bg-slate-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600 border border-slate-200">
          {product.badge}
        </span>
      )}

      {/* Icon */}
      <div
        className={cn(
          "mb-5 flex h-12 w-12 items-center justify-center rounded-none shadow-xs text-white",
          !isActive && accessState !== "coming_soon" && "grayscale opacity-70",
        )}
        style={{ background: product.color }}
      >
        <span className="material-symbols-rounded text-2xl">
          {product.icon}
        </span>
      </div>

      {/* Info */}
      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
        {product.name}
      </h3>
      <p className="mt-1 text-[11px] font-bold tracking-wider uppercase text-indigo-600">
        {product.tagline}
      </p>
      <p className="mt-3 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed flex-1">
        {product.description}
      </p>

      {/* Message if any */}
      {message && (
        <p
          className={cn(
            "mt-2 text-xs font-semibold",
            accessState === "locked_inactive" ? "text-rose-600" : "text-slate-500",
          )}
        >
          {message}
        </p>
      )}

      {/* Action */}
      <div className="mt-5">
        <button
          type="button"
          onClick={() => {
            if (isActionable) onLaunch(product);
          }}
          disabled={
            isLaunching || (!isActionable && accessState !== "coming_soon")
          }
          className={cn(
            "w-full py-2.5 px-4 rounded-none font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]",
            isActive
              ? "text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs hover:shadow-sm hover:-translate-y-0.5"
              : accessState === "upgrade_plan" ||
                  accessState === "setup_required" ||
                  accessState === "login_required"
                ? "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200"
                : "bg-slate-100 text-slate-400 cursor-not-allowed",
          )}
        >
          {isLaunching ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Launching...
            </>
          ) : accessState === "open" ? (
            <>
              <span className="material-symbols-rounded text-lg">
                rocket_launch
              </span>
              {ctaText || "Open App"}
            </>
          ) : accessState === "upgrade_plan" ? (
            <>
              <span className="material-symbols-rounded text-lg">
                rocket_launch
              </span>
              {ctaText}
            </>
          ) : accessState === "setup_required" ? (
            <>
              <span className="material-symbols-rounded text-lg">task_alt</span>
              {ctaText}
            </>
          ) : accessState === "login_required" ? (
            <>
              <span className="material-symbols-rounded text-lg">login</span>
              {ctaText}
            </>
          ) : accessState === "no_access" ? (
            <>
              <span className="material-symbols-rounded text-lg">lock</span>
              {ctaText}
            </>
          ) : (
            ctaText || "Coming Soon"
          )}
        </button>
      </div>
    </div>
  );
}

function ReadOnlyCard({
  icon,
  label,
  value,
  helper,
}: {
  icon: string;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="rounded-none border border-slate-200/80 bg-slate-50 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-none bg-primary/10 text-primary">
          <span className="material-symbols-rounded text-2xl">{icon}</span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>
          <p className="truncate text-base font-black tracking-tight text-slate-900">
            {value}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs font-medium leading-relaxed text-slate-500 opacity-80">
        {helper}
      </p>
    </div>
  );
}

function GuardrailItem({
  icon,
  label,
  value,
  tone,
}: {
  icon: string;
  label: string;
  value: string;
  tone: "good" | "warn" | "neutral";
}) {
  const toneClasses =
    tone === "good"
      ? "bg-emerald-500/10 text-emerald-600"
      : tone === "warn"
        ? "bg-amber-500/10 text-amber-600"
        : "bg-primary/10 text-primary";

  return (
    <div className="flex items-center justify-between gap-4 rounded-none border border-slate-200/80 bg-slate-50 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-none ${toneClasses}`}
        >
          <span className="material-symbols-rounded text-xl">{icon}</span>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
            {label}
          </p>
          <p className="text-sm font-bold text-slate-900">{value}</p>
        </div>
      </div>
      <span
        className={`rounded-none px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${toneClasses}`}
      >
        {tone === "good" ? "Healthy" : tone === "warn" ? "Review" : "Info"}
      </span>
    </div>
  );
}

function StatCard({
  icon,
  hint,
  label,
  value,
  trend,
}: {
  icon: string;
  hint: string;
  label: string;
  value: string;
  trend?: "up" | "down" | "neutral";
}) {
  return (
    <div className="rounded-none border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-none bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
          <span className="material-symbols-rounded text-xl font-bold">
            {icon}
          </span>
        </div>
        {trend && (
          <div
            className={cn(
              "flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-none",
              trend === "up"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                : trend === "down"
                  ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                  : "bg-slate-100 text-slate-600",
            )}
          >
            <span className="material-symbols-rounded text-xs">
              {trend === "up"
                ? "trending_up"
                : trend === "down"
                  ? "trending_down"
                  : "remove"}
            </span>
            <span>{trend === "up" ? "Good" : trend === "down" ? "Action" : "Stable"}</span>
          </div>
        )}
      </div>
      <p className="text-[10px] font-bold tracking-wider uppercase text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
        {value}
      </p>
      <p className="text-xs text-slate-500 mt-1.5 font-medium line-clamp-1">
        {hint}
      </p>
    </div>
  );
}

function Field({
  label,
  onChange,
  placeholder,
  type = "text",
  value,
}: {
  label: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-900">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-none border border-slate-200 bg-surface px-4 py-3 outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-container)] transition-all"
      />
    </label>
  );
}

function QuickActionCard({
  title,
  icon,
  href,
  onClick,
  primary,
  disabled,
}: {
  title: string;
  icon: string;
  href?: string;
  onClick?: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-5 rounded-none border transition-all duration-200 select-none",
        disabled
          ? "cursor-not-allowed opacity-50 grayscale bg-slate-50 border-slate-200"
          : "hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer",
        primary
          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs hover:bg-indigo-700"
          : "bg-white border-slate-200/80 hover:border-indigo-300 shadow-2xs text-slate-900",
      )}
    >
      <span
        className={cn(
          "material-symbols-rounded text-2xl mb-2 font-bold",
          primary ? "text-white" : "text-indigo-600",
        )}
      >
        {icon}
      </span>
      <span className="text-xs sm:text-sm font-bold text-center leading-tight">
        {title}
      </span>
    </div>
  );

  if (href && !disabled) {
    return (
      <Link href={href} className="block cursor-pointer">
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      className="w-full block cursor-pointer"
      disabled={disabled}
    >
      {content}
    </button>
  );
}

function ProfileInfoItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-none bg-slate-50/30 border border-slate-100">
      <div className="h-10 w-10 rounded-none bg-primary/5 flex items-center justify-center text-primary">
        <span className="material-symbols-outlined text-xl">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-black tracking-widest uppercase text-slate-500 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-900 line-clamp-1">
          {value}
        </p>
      </div>
    </div>
  );
}
