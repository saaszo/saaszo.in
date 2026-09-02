"use client";

import Link from "next/link";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  useAuthSession,
  type PlatformBusinessTypePoint,
  type PlatformOrganizationInfo,
  type PlatformOrganizationUpdateInput,
  type PlatformOverviewInfo,
  type PlatformPaymentInfo,
  type PlatformPlanInput,
  type PlatformPlanInfo,
  type PlatformRevenueReportPoint,
  type PlatformSignupReportPoint,
  type PlatformSubscriptionInput,
  type PlatformSubscriptionInfo,
  type PlatformToolUsageReport,
} from "@/components/AuthProvider";
import {
  executionPhases,
  getPlanPrice,
  growthMilestones,
  type PricingCatalogSnapshot,
} from "@/lib/pricing-plans";

type OrganizationFormState = {
  plan_type: string;
  billing_cycle: "monthly" | "yearly" | "free_forever";
  account_state: string;
  is_active: boolean;
  founder_pricing_locked: boolean;
  founder_pricing_customer_cap: string;
  founder_pricing_plan_type: string;
  founder_pricing_billing_cycle: "monthly" | "yearly" | "free_forever";
};

type PlanFormState = {
  key: string;
  name: string;
  billing_cycle: string;
  price: string;
  currency: string;
  trial_days: string;
  status: string;
};

type SubscriptionFormState = {
  company_id: string;
  product_key: string;
  plan_name: string;
  months: string;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  amount_paid: string;
  payment_id: string;
};

const PLAN_OPTIONS = [
  "free",
  "starter",
  "growth",
  "business_pro",
  "enterprise",
];

const BILLING_OPTIONS: Array<"monthly" | "yearly" | "free_forever"> = [
  "monthly",
  "yearly",
  "free_forever",
];

const ACCOUNT_STATE_OPTIONS = [
  "active",
  "trial",
  "paused",
  "inactive",
  "cancelled",
];

const PLAN_STATUS_OPTIONS = ["active", "beta", "disabled"];
const PRODUCT_KEY_OPTIONS = [
  "invoice",
  "seller",
  "task",
  "engage",
  "hrms",
  "connect",
  "crm",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function getFounderCatalogValue(
  overview: PlatformOverviewInfo | null,
): PricingCatalogSnapshot | null {
  return overview?.pricingCatalog ?? null;
}

function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function createFormState(
  organization: PlatformOrganizationInfo | null,
): OrganizationFormState {
  return {
    plan_type: organization?.plan_type || "free",
    billing_cycle:
      organization?.billing_cycle === "yearly" ||
      organization?.billing_cycle === "free_forever"
        ? organization.billing_cycle
        : "monthly",
    account_state:
      organization?.account_state ||
      (organization?.is_active === false ? "inactive" : "active"),
    is_active: organization?.is_active !== false,
    founder_pricing_locked: Boolean(organization?.founder_pricing_locked_at),
    founder_pricing_customer_cap: organization?.founder_pricing_customer_cap
      ? String(organization.founder_pricing_customer_cap)
      : "",
    founder_pricing_plan_type:
      organization?.founder_pricing_plan_type || organization?.plan_type || "growth",
    founder_pricing_billing_cycle:
      organization?.founder_pricing_billing_cycle === "yearly" ||
      organization?.founder_pricing_billing_cycle === "free_forever"
        ? organization.founder_pricing_billing_cycle
        : "monthly",
  };
}

function createPlanFormState(plan?: PlatformPlanInfo | null): PlanFormState {
  return {
    key: plan?.key ?? "",
    name: plan?.name ?? "",
    billing_cycle: plan?.billing_cycle ?? "monthly",
    price: plan ? String(plan.price) : "",
    currency: plan?.currency ?? "INR",
    trial_days:
      typeof plan?.trial_days === "number" ? String(plan.trial_days) : "",
    status: plan?.status ?? "active",
  };
}

function createSubscriptionFormState(
  subscription?: PlatformSubscriptionInfo | null,
): SubscriptionFormState {
  return {
    company_id: subscription ? String(subscription.company_id) : "",
    product_key: subscription?.product_key ?? "invoice",
    plan_name: subscription?.plan_name ?? "",
    months: "",
    starts_at: subscription?.starts_at?.slice(0, 10) ?? "",
    expires_at: subscription?.expires_at?.slice(0, 10) ?? "",
    is_active: subscription?.is_active ?? true,
    amount_paid: subscription ? String(subscription.amount_paid) : "",
    payment_id: subscription?.payment_id ?? "",
  };
}

export default function PlatformAdminPage() {
  const router = useRouter();
  const {
    authenticated,
    getPlatformBusinessTypesReport,
    getPlatformOrganizations,
    getPlatformOverview,
    getPlatformPayments,
    getPlatformPlans,
    getPlatformRevenueReport,
    getPlatformSignupReport,
    getPlatformSubscriptions,
    getPlatformToolUsageReport,
    loading,
    savePlatformPlan,
    savePlatformSubscription,
    updatePlatformOrganization,
    workspaceUser,
  } = useAuthSession();
  const [overview, setOverview] = useState<PlatformOverviewInfo | null>(null);
  const [organizations, setOrganizations] = useState<PlatformOrganizationInfo[]>(
    [],
  );
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<
    number | null
  >(null);
  const [signupReport, setSignupReport] = useState<PlatformSignupReportPoint[]>([]);
  const [revenueReport, setRevenueReport] = useState<PlatformRevenueReportPoint[]>([]);
  const [businessTypesReport, setBusinessTypesReport] = useState<
    PlatformBusinessTypePoint[]
  >([]);
  const [toolUsageReport, setToolUsageReport] = useState<PlatformToolUsageReport | null>(
    null,
  );
  const [plans, setPlans] = useState<PlatformPlanInfo[]>([]);
  const [subscriptions, setSubscriptions] = useState<PlatformSubscriptionInfo[]>(
    [],
  );
  const [payments, setPayments] = useState<PlatformPaymentInfo[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<number | null>(
    null,
  );
  const [planForm, setPlanForm] = useState<PlanFormState>(createPlanFormState());
  const [subscriptionForm, setSubscriptionForm] = useState<SubscriptionFormState>(
    createSubscriptionFormState(),
  );
  const [formState, setFormState] = useState<OrganizationFormState>(
    createFormState(null),
  );
  const [search, setSearch] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<"success" | "error" | "info">(
    "info",
  );
  const [billingMessage, setBillingMessage] = useState<string | null>(null);
  const [billingTone, setBillingTone] = useState<"success" | "error" | "info">(
    "info",
  );
  const [savingPlan, setSavingPlan] = useState(false);
  const [savingSubscription, setSavingSubscription] = useState(false);

  const isSuperAdmin = workspaceUser?.role === "super_admin";
  const pricingCatalog = useMemo(() => getFounderCatalogValue(overview), [overview]);
  const selectedOrganization =
    organizations.find((organization) => organization.id === selectedOrganizationId) ??
    null;
  const selectedPlan =
    plans.find((plan) => plan.id === selectedPlanId) ?? null;
  const selectedSubscription =
    subscriptions.find((subscription) => subscription.id === selectedSubscriptionId) ??
    null;

  useEffect(() => {
    if (!loading && authenticated && !isSuperAdmin) {
      startTransition(() => {
        router.replace("/dashboard");
      });
    }
  }, [authenticated, isSuperAdmin, loading, router]);

  useEffect(() => {
    if (!authenticated || !isSuperAdmin) {
      return;
    }

    void loadData();
  }, [authenticated, isSuperAdmin]);

  useEffect(() => {
    if (!organizations.length) {
      setSelectedOrganizationId(null);
      setFormState(createFormState(null));
      return;
    }

    const nextSelected =
      organizations.find((organization) => organization.id === selectedOrganizationId) ??
      organizations[0];

    setSelectedOrganizationId(nextSelected.id);
    setFormState(createFormState(nextSelected));
  }, [organizations, selectedOrganizationId]);

  useEffect(() => {
    if (!plans.length) {
      setSelectedPlanId(null);
      setPlanForm(createPlanFormState());
      return;
    }

    const nextSelected = plans.find((plan) => plan.id === selectedPlanId) ?? plans[0];
    setSelectedPlanId(nextSelected.id);
    setPlanForm(createPlanFormState(nextSelected));
  }, [plans, selectedPlanId]);

  useEffect(() => {
    if (!subscriptions.length) {
      setSelectedSubscriptionId(null);
      setSubscriptionForm(createSubscriptionFormState());
      return;
    }

    const nextSelected =
      subscriptions.find((subscription) => subscription.id === selectedSubscriptionId) ??
      subscriptions[0];
    setSelectedSubscriptionId(nextSelected.id);
    setSubscriptionForm(createSubscriptionFormState(nextSelected));
  }, [subscriptions, selectedSubscriptionId]);

  async function loadData(query?: string, options?: { preserveStatus?: boolean }) {
    setRefreshing(true);
    if (!options?.preserveStatus) {
      setStatusMessage(null);
    }
    const [
      overviewPayload,
      organizationsPayload,
      signupPayload,
      revenuePayload,
      businessTypesPayload,
      toolUsagePayload,
      plansPayload,
      subscriptionsPayload,
      paymentsPayload,
    ] = await Promise.all([
      getPlatformOverview(),
      getPlatformOrganizations({ q: query, perPage: 30 }),
      getPlatformSignupReport(),
      getPlatformRevenueReport(),
      getPlatformBusinessTypesReport(),
      getPlatformToolUsageReport(),
      getPlatformPlans(),
      getPlatformSubscriptions({ perPage: 12 }),
      getPlatformPayments({ perPage: 12 }),
    ]);
    setOverview(overviewPayload);
    setOrganizations(organizationsPayload);
    setSignupReport(signupPayload);
    setRevenueReport(revenuePayload);
    setBusinessTypesReport(businessTypesPayload);
    setToolUsageReport(toolUsagePayload);
    setPlans(plansPayload);
    setSubscriptions(subscriptionsPayload);
    setPayments(paymentsPayload);
    setLoadingData(false);
    setRefreshing(false);
  }

  async function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await loadData(search.trim());
  }

  function handleOrganizationSelect(organization: PlatformOrganizationInfo) {
    setSelectedOrganizationId(organization.id);
    setFormState(createFormState(organization));
    setStatusMessage(null);
  }

  function updateFormValue<Key extends keyof OrganizationFormState>(
    key: Key,
    value: OrganizationFormState[Key],
  ) {
    setFormState((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updatePlanForm<Key extends keyof PlanFormState>(
    key: Key,
    value: PlanFormState[Key],
  ) {
    setPlanForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function updateSubscriptionForm<Key extends keyof SubscriptionFormState>(
    key: Key,
    value: SubscriptionFormState[Key],
  ) {
    setSubscriptionForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedOrganization) {
      setStatusTone("error");
      setStatusMessage("Select an organization first.");
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const payload: PlatformOrganizationUpdateInput = {
      plan_type: formState.plan_type,
      billing_cycle: formState.billing_cycle,
      account_state: formState.account_state,
      is_active: formState.is_active,
      founder_pricing_locked: formState.founder_pricing_locked,
      founder_pricing_customer_cap: formState.founder_pricing_locked
        ? Number(formState.founder_pricing_customer_cap || 0) || null
        : null,
      founder_pricing_plan_type: formState.founder_pricing_locked
        ? formState.founder_pricing_plan_type
        : null,
      founder_pricing_billing_cycle: formState.founder_pricing_locked
        ? formState.founder_pricing_billing_cycle
        : null,
    };

    const result = await updatePlatformOrganization(selectedOrganization.id, payload);

    if (!result.success) {
      setStatusTone("error");
      setStatusMessage(result.message || "Could not save organization settings.");
      setSaving(false);
      return;
    }

    setStatusTone("success");
    setStatusMessage(result.message || "Organization settings saved.");
    await loadData(search.trim(), { preserveStatus: true });
    setSelectedOrganizationId(selectedOrganization.id);
    setSaving(false);
  }

  async function handlePlanSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingPlan(true);
    setBillingMessage(null);

    const payload: PlatformPlanInput = {
      key: planForm.key.trim(),
      name: planForm.name.trim(),
      billing_cycle: planForm.billing_cycle.trim(),
      price: Number(planForm.price || 0),
      currency: planForm.currency.trim() || "INR",
      trial_days: planForm.trial_days ? Number(planForm.trial_days) : null,
      status: planForm.status.trim() || "active",
    };

    const result = await savePlatformPlan(payload, selectedPlan?.id ?? null);

    if (!result.success) {
      setBillingTone("error");
      setBillingMessage(result.message || "Could not save plan.");
      setSavingPlan(false);
      return;
    }

    setBillingTone("success");
    setBillingMessage(result.message || "Plan saved successfully.");
    await loadData(search.trim(), { preserveStatus: true });
    setSelectedPlanId(result.plan?.id ?? selectedPlan?.id ?? null);
    setSavingPlan(false);
  }

  async function handleSubscriptionSave(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setSavingSubscription(true);
    setBillingMessage(null);

    const payload: PlatformSubscriptionInput = {
      company_id: Number(subscriptionForm.company_id || 0),
      product_key: subscriptionForm.product_key.trim(),
      plan_name: subscriptionForm.plan_name.trim(),
      months: subscriptionForm.months ? Number(subscriptionForm.months) : null,
      starts_at: subscriptionForm.starts_at || null,
      expires_at: subscriptionForm.expires_at || null,
      is_active: subscriptionForm.is_active,
      amount_paid: subscriptionForm.amount_paid
        ? Number(subscriptionForm.amount_paid)
        : 0,
      payment_id: subscriptionForm.payment_id || null,
    };

    const result = await savePlatformSubscription(
      payload,
      selectedSubscription?.id ?? null,
    );

    if (!result.success) {
      setBillingTone("error");
      setBillingMessage(result.message || "Could not save subscription.");
      setSavingSubscription(false);
      return;
    }

    setBillingTone("success");
    setBillingMessage(result.message || "Subscription saved successfully.");
    await loadData(search.trim(), { preserveStatus: true });
    setSelectedSubscriptionId(
      result.subscription?.id ?? selectedSubscription?.id ?? null,
    );
    setSavingSubscription(false);
  }

  function startNewPlan() {
    setSelectedPlanId(null);
    setPlanForm(createPlanFormState());
    setBillingTone("info");
    setBillingMessage("Creating a new plan record.");
  }

  function startNewSubscription() {
    setSelectedSubscriptionId(null);
    setSubscriptionForm(createSubscriptionFormState());
    setBillingTone("info");
    setBillingMessage("Creating a new subscription record.");
  }

  function exportSignupCsv() {
    downloadCsv("platform-signups-report.csv", [
      ["Day", "Total Signups"],
      ...signupReport.map((row) => [row.day, String(row.total)]),
    ]);
  }

  function exportRevenueCsv() {
    downloadCsv("platform-revenue-report.csv", [
      ["Period", "Revenue"],
      ...revenueReport.map((row) => [row.period, String(row.total)]),
    ]);
  }

  function exportBusinessTypesCsv() {
    downloadCsv("platform-business-types-report.csv", [
      ["Business Category", "Organizations"],
      ...businessTypesReport.map((row) => [
        row.business_category,
        String(row.total),
      ]),
    ]);
  }

  function exportToolUsageCsv() {
    downloadCsv("platform-tool-usage-report.csv", [
      ["Metric", "Tool", "Count"],
      ...(toolUsageReport?.events ?? []).map((row) => [
        "events",
        row.tool_key,
        String(row.events),
      ]),
      ...(toolUsageReport?.subscriptions ?? []).map((row) => [
        "subscriptions",
        row.tool_key,
        String(row.subscriptions),
      ]),
    ]);
  }

  function exportPlansCsv() {
    downloadCsv("platform-plans.csv", [
      ["Key", "Name", "Billing Cycle", "Price", "Currency", "Status"],
      ...plans.map((row) => [
        row.key,
        row.name,
        row.billing_cycle,
        String(row.price),
        row.currency,
        row.status,
      ]),
    ]);
  }

  function exportSubscriptionsCsv() {
    downloadCsv("platform-subscriptions.csv", [
      [
        "Company",
        "Tool",
        "Plan",
        "Starts At",
        "Expires At",
        "Active",
        "Amount Paid",
      ],
      ...subscriptions.map((row) => [
        row.company_name,
        row.product_key,
        row.plan_name,
        row.starts_at ?? "",
        row.expires_at ?? "",
        row.is_active ? "Yes" : "No",
        String(row.amount_paid),
      ]),
    ]);
  }

  function exportPaymentsCsv() {
    downloadCsv("platform-payments.csv", [
      ["Company", "Type", "Date", "Amount", "Method", "Transaction ID"],
      ...payments.map((row) => [
        row.company_name,
        row.payment_type,
        row.payment_date ?? "",
        String(row.amount),
        row.method ?? "",
        row.transaction_id ?? "",
      ]),
    ]);
  }

  if (loading || (authenticated && !isSuperAdmin)) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center px-6">
        <p className="text-lg font-semibold">Loading platform controls...</p>
      </div>
    );
  }

  if (!authenticated || !isSuperAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-tertiary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to dashboard
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Platform Admin
            </p>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight">
              Founder pricing and growth control center
            </h1>
            <p className="mt-3 max-w-3xl text-sm text-on-surface-variant">
              Use this view to monitor founder pricing progress, manage workspace
              billing states, and lock founder offers before public pricing goes up.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadData(search.trim())}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Founder Target"
            value={String(overview?.founderPricingTarget ?? 0)}
            hint="Paid users before public price increase"
          />
          <MetricCard
            label="Paid Companies"
            value={String(overview?.paidPlanUsers ?? 0)}
            hint="Current paid workspaces"
          />
          <MetricCard
            label="Founder Slots Remaining"
            value={String(overview?.founderPricingSlotsRemaining ?? 0)}
            hint="Still visible for new founder signups"
          />
          <MetricCard
            label="Founder Locked"
            value={String(overview?.founderPricingLockedCompanies ?? 0)}
            hint="Workspaces with founder pricing already locked"
          />
          <MetricCard
            label="Total Organizations"
            value={String(overview?.totalOrganizations ?? 0)}
            hint="All workspaces on the platform"
          />
          <MetricCard
            label="Active Users"
            value={String(overview?.activeUsers ?? 0)}
            hint="Currently active users"
          />
          <MetricCard
            label="Revenue"
            value={formatCurrency(overview?.totalRevenue ?? 0)}
            hint="Recorded total revenue"
          />
          <MetricCard
            label="MRR"
            value={formatCurrency(overview?.monthlyRecurringRevenue ?? 0)}
            hint="Active monthly recurring revenue"
          />
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_20px_60px_rgba(25,28,30,0.08)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Founder Milestones
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Growth gates before pricing changes
                </h2>
              </div>
              {pricingCatalog ? (
                <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
                  {pricingCatalog.paidCustomers} paid ·{" "}
                  {pricingCatalog.founderSlotsRemaining} slots left
                </div>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {growthMilestones.map((milestone) => (
                <div
                  key={milestone.key}
                  className="rounded-2xl border border-outline-variant/20 bg-surface-container px-4 py-4"
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
                    {milestone.title}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-on-surface">
                    {milestone.goal}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {milestone.signals.map((signal) => (
                      <li
                        key={signal}
                        className="flex items-start gap-2 text-xs text-on-surface-variant"
                      >
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_20px_60px_rgba(25,28,30,0.08)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Shipping Phases
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight">
              Delivery order tied to pricing confidence
            </h2>
            <div className="mt-5 space-y-3">
              {executionPhases.map((phase, index) => (
                <div
                  key={phase.key}
                  className="rounded-2xl border border-outline-variant/20 bg-surface-container px-4 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                      {index + 1}
                    </span>
                    <p className="text-sm font-bold text-on-surface">
                      {phase.title}
                    </p>
                  </div>
                  <p className="mt-2 text-sm text-on-surface-variant">
                    {phase.goal}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_20px_60px_rgba(25,28,30,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Pricing Ladder
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Founder offer versus post-1000 pricing
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-on-surface-variant">
                Annual pricing should remain the default best-value choice while
                founder slots are still open. This snapshot helps admin and sales
                teams explain the current entry offer clearly.
              </p>
            </div>
            {pricingCatalog ? (
              <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                {pricingCatalog.founderSlotsRemaining} founder slots still visible
              </div>
            ) : null}
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
            {(pricingCatalog?.publicPlans ?? []).filter((plan) => plan.slug !== "free").map((plan) => (
              <div
                key={plan.slug}
                className="rounded-2xl border border-outline-variant/20 bg-surface-container px-4 py-4"
              >
                <p className="text-sm font-black text-on-surface">{plan.name}</p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  Founder now: {getPlanPrice(plan.slug, "yearly")}/year
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  New users later: {getPlanPrice(plan.slug, "yearly", "next")}/year
                </p>
                <div className="mt-3 rounded-xl bg-primary/5 px-3 py-3 text-xs font-medium text-primary">
                  Yearly saves commitment friction and keeps pricing simple during
                  the first 1,000 paid-workspace push.
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_20px_60px_rgba(25,28,30,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Billing Operations
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Plans, subscriptions, and payment records
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-on-surface-variant">
                Founder pricing only works well when admin can also inspect the
                actual plan catalog, live subscriptions, and payment records
                without leaving the control center.
              </p>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Billing admin visibility
            </div>
          </div>

          <div className="mt-5 grid gap-6 xl:grid-cols-3">
            <ReportCard
              title="Plan catalog"
              subtitle="Stored plan records from backend"
              actionLabel="Export CSV"
              onAction={exportPlansCsv}
              rows={plans.slice(0, 6).map((row) => [
                `${row.name} · ${row.billing_cycle}`,
                `${row.currency} ${row.price}`,
              ])}
              headers={["Plan", "Price"]}
              emptyText="No plan records found yet."
            />
            <ReportCard
              title="Active subscriptions"
              subtitle="Latest subscription records by company"
              actionLabel="Export CSV"
              onAction={exportSubscriptionsCsv}
              rows={subscriptions.slice(0, 6).map((row) => [
                `${row.company_name} · ${row.product_key}`,
                `${row.plan_name} · ${row.is_active ? "Active" : "Inactive"}`,
              ])}
              headers={["Company", "Subscription"]}
              emptyText="No subscription records found yet."
            />
            <ReportCard
              title="Payment records"
              subtitle="Recent platform payments and collections"
              actionLabel="Export CSV"
              onAction={exportPaymentsCsv}
              rows={payments.slice(0, 6).map((row) => [
                `${row.company_name} · ${row.payment_type}`,
                formatCurrency(row.amount),
              ])}
              headers={["Company", "Amount"]}
              emptyText="No payment records found yet."
            />
          </div>

          {billingMessage ? (
            <div
              className={`mt-5 rounded-2xl px-4 py-3 text-sm font-medium ${
                billingTone === "success"
                  ? "bg-emerald-500/10 text-emerald-700"
                  : billingTone === "error"
                    ? "bg-rose-500/10 text-rose-700"
                    : "bg-primary/10 text-primary"
              }`}
            >
              {billingMessage}
            </div>
          ) : null}

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-6">
              <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">Plan records</h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Select a plan to edit or create a new one.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={startNewPlan}
                    className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-xs font-semibold text-primary"
                  >
                    New plan
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {plans.length ? (
                    plans.map((plan) => (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => {
                          setSelectedPlanId(plan.id);
                          setPlanForm(createPlanFormState(plan));
                          setBillingMessage(null);
                        }}
                        className={`w-full rounded-2xl border px-4 py-3 text-left ${
                          selectedPlanId === plan.id
                            ? "border-primary bg-primary/10"
                            : "border-outline-variant/20 bg-surface-container-lowest"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-on-surface">
                            {plan.name}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
                            {plan.status}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-on-surface-variant">
                          {plan.key} · {plan.billing_cycle} · {plan.currency} {plan.price}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-on-surface-variant">
                      No plan records found yet.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">
                      Subscription records
                    </h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Select a subscription to edit or create a new one.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={startNewSubscription}
                    className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-xs font-semibold text-primary"
                  >
                    New subscription
                  </button>
                </div>

                <div className="mt-4 space-y-2">
                  {subscriptions.length ? (
                    subscriptions.map((subscription) => (
                      <button
                        key={subscription.id}
                        type="button"
                        onClick={() => {
                          setSelectedSubscriptionId(subscription.id);
                          setSubscriptionForm(createSubscriptionFormState(subscription));
                          setBillingMessage(null);
                        }}
                        className={`w-full rounded-2xl border px-4 py-3 text-left ${
                          selectedSubscriptionId === subscription.id
                            ? "border-primary bg-primary/10"
                            : "border-outline-variant/20 bg-surface-container-lowest"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-on-surface">
                            {subscription.company_name}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">
                            {subscription.is_active ? "active" : "inactive"}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-on-surface-variant">
                          {subscription.product_key} · {subscription.plan_name} ·{" "}
                          {formatCurrency(subscription.amount_paid)}
                        </p>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-on-surface-variant">
                      No subscription records found yet.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <form
                onSubmit={handlePlanSave}
                className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">
                      {selectedPlan ? "Edit plan" : "Create plan"}
                    </h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Manage platform pricing records used by admin billing operations.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Key
                    </span>
                    <input
                      value={planForm.key}
                      onChange={(event) => updatePlanForm("key", event.target.value)}
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Name
                    </span>
                    <input
                      value={planForm.name}
                      onChange={(event) => updatePlanForm("name", event.target.value)}
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Billing Cycle
                    </span>
                    <input
                      value={planForm.billing_cycle}
                      onChange={(event) =>
                        updatePlanForm("billing_cycle", event.target.value)
                      }
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Price
                    </span>
                    <input
                      value={planForm.price}
                      onChange={(event) => updatePlanForm("price", event.target.value)}
                      inputMode="decimal"
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Currency
                    </span>
                    <input
                      value={planForm.currency}
                      onChange={(event) =>
                        updatePlanForm("currency", event.target.value)
                      }
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Trial Days
                    </span>
                    <input
                      value={planForm.trial_days}
                      onChange={(event) =>
                        updatePlanForm("trial_days", event.target.value)
                      }
                      inputMode="numeric"
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                    Status
                  </span>
                  <select
                    value={planForm.status}
                    onChange={(event) => updatePlanForm("status", event.target.value)}
                    className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                  >
                    {PLAN_STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="submit"
                  disabled={savingPlan}
                  className="mt-5 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {savingPlan
                    ? "Saving plan..."
                    : selectedPlan
                      ? "Update plan"
                      : "Create plan"}
                </button>
              </form>

              <form
                onSubmit={handleSubscriptionSave}
                className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface">
                      {selectedSubscription ? "Edit subscription" : "Create subscription"}
                    </h3>
                    <p className="mt-1 text-sm text-on-surface-variant">
                      Assign plan access to a company for a specific product.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <label className="block md:col-span-2">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Company
                    </span>
                    <select
                      value={subscriptionForm.company_id}
                      onChange={(event) =>
                        updateSubscriptionForm("company_id", event.target.value)
                      }
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    >
                      <option value="">Select company</option>
                      {organizations.map((organization) => (
                        <option key={organization.id} value={organization.id}>
                          {organization.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Product
                    </span>
                    <select
                      value={subscriptionForm.product_key}
                      onChange={(event) =>
                        updateSubscriptionForm("product_key", event.target.value)
                      }
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    >
                      {PRODUCT_KEY_OPTIONS.map((product) => (
                        <option key={product} value={product}>
                          {product}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Plan Name
                    </span>
                    <input
                      value={subscriptionForm.plan_name}
                      onChange={(event) =>
                        updateSubscriptionForm("plan_name", event.target.value)
                      }
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Months
                    </span>
                    <input
                      value={subscriptionForm.months}
                      onChange={(event) =>
                        updateSubscriptionForm("months", event.target.value)
                      }
                      inputMode="numeric"
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Starts At
                    </span>
                    <input
                      type="date"
                      value={subscriptionForm.starts_at}
                      onChange={(event) =>
                        updateSubscriptionForm("starts_at", event.target.value)
                      }
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Expires At
                    </span>
                    <input
                      type="date"
                      value={subscriptionForm.expires_at}
                      onChange={(event) =>
                        updateSubscriptionForm("expires_at", event.target.value)
                      }
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Amount Paid
                    </span>
                    <input
                      value={subscriptionForm.amount_paid}
                      onChange={(event) =>
                        updateSubscriptionForm("amount_paid", event.target.value)
                      }
                      inputMode="decimal"
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Payment ID
                    </span>
                    <input
                      value={subscriptionForm.payment_id}
                      onChange={(event) =>
                        updateSubscriptionForm("payment_id", event.target.value)
                      }
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none"
                    />
                  </label>
                </div>

                <label className="mt-4 flex items-center gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3">
                  <input
                    type="checkbox"
                    checked={subscriptionForm.is_active}
                    onChange={(event) =>
                      updateSubscriptionForm("is_active", event.target.checked)
                    }
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-semibold text-on-surface">
                    Subscription is active
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={savingSubscription}
                  className="mt-5 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {savingSubscription
                    ? "Saving subscription..."
                    : selectedSubscription
                      ? "Update subscription"
                      : "Create subscription"}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_20px_60px_rgba(25,28,30,0.08)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Reports & Exports
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Growth, revenue, and category visibility
              </h2>
              <p className="mt-2 max-w-3xl text-sm text-on-surface-variant">
                These blocks keep founder-pricing decisions tied to real signups,
                revenue movement, business mix, and tool adoption. Each block can
                be exported to CSV for review outside the dashboard.
              </p>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-primary">
              Live admin reports
            </div>
          </div>

          <div className="mt-5 grid gap-6 xl:grid-cols-2">
            <ReportCard
              title="Recent signups"
              subtitle="Last recorded daily signup counts"
              actionLabel="Export CSV"
              onAction={exportSignupCsv}
              rows={signupReport.slice(0, 6).map((row) => [row.day, String(row.total)])}
              headers={["Day", "Users"]}
              emptyText="No signup report data found yet."
            />
            <ReportCard
              title="Revenue by month"
              subtitle="Monthly revenue from recorded payments"
              actionLabel="Export CSV"
              onAction={exportRevenueCsv}
              rows={revenueReport.slice(0, 6).map((row) => [
                row.period,
                formatCurrency(row.total),
              ])}
              headers={["Month", "Revenue"]}
              emptyText="No revenue report data found yet."
            />
            <ReportCard
              title="Business category mix"
              subtitle="Which business types are onboarding most"
              actionLabel="Export CSV"
              onAction={exportBusinessTypesCsv}
              rows={businessTypesReport.slice(0, 6).map((row) => [
                row.business_category,
                String(row.total),
              ])}
              headers={["Category", "Count"]}
              emptyText="No business category report data found yet."
            />
            <ReportCard
              title="Tool adoption"
              subtitle="Usage events and subscription mix by tool"
              actionLabel="Export CSV"
              onAction={exportToolUsageCsv}
              rows={[
                ...(toolUsageReport?.events ?? []).slice(0, 3).map((row) => [
                  `${row.tool_key} events`,
                  String(row.events),
                ]),
                ...(toolUsageReport?.subscriptions ?? []).slice(0, 3).map((row) => [
                  `${row.tool_key} subs`,
                  String(row.subscriptions),
                ]),
              ]}
              headers={["Tool", "Count"]}
              emptyText="No tool usage report data found yet."
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_20px_60px_rgba(25,28,30,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Organizations
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight">
                Founder pricing eligibility and billing state
              </h2>
            </div>
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-wrap items-center gap-2"
            >
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search organization, email, phone..."
                className="w-72 rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm outline-none"
              />
              <button
                type="submit"
                className="rounded-xl border border-outline-variant/30 bg-surface-container px-4 py-3 text-sm font-semibold"
              >
                Search
              </button>
            </form>
          </div>

          <div className="mt-5 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-outline-variant/20">
                <thead>
                  <tr className="bg-surface-container">
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                      Organization
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                      Plan
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                      Billing
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                      Founder Lock
                    </th>
                    <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                      Account State
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {organizations.length > 0 ? (
                    organizations.map((organization, index) => {
                      const isSelected =
                        selectedOrganizationId === organization.id;

                      return (
                        <tr
                          key={organization.id}
                          onClick={() => handleOrganizationSelect(organization)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-primary/10"
                              : index % 2 === 0
                                ? "bg-surface-container-lowest"
                                : "bg-surface-container"
                          }`}
                        >
                          <td className="px-4 py-4 align-top">
                            <p className="text-sm font-semibold text-on-surface">
                              {organization.name}
                            </p>
                            <p className="mt-1 text-xs text-on-surface-variant">
                              {organization.email ||
                                organization.phone ||
                                "No contact"}
                            </p>
                          </td>
                          <td className="px-4 py-4 text-sm text-on-surface">
                            {organization.plan_type || "free"}
                          </td>
                          <td className="px-4 py-4 text-sm text-on-surface">
                            {organization.billing_cycle || "free_forever"}
                          </td>
                          <td className="px-4 py-4 text-sm text-on-surface">
                            {organization.founder_pricing_locked_at
                              ? "Locked"
                              : "Open"}
                          </td>
                          <td className="px-4 py-4 text-sm text-on-surface">
                            {organization.account_state ||
                              (organization.is_active ? "active" : "inactive")}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-sm text-on-surface-variant"
                      >
                        {loadingData
                          ? "Loading organizations..."
                          : "No organizations found for the current search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Workspace Controls
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-on-surface">
                    {selectedOrganization?.name || "Select an organization"}
                  </h3>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {selectedOrganization?.email ||
                      selectedOrganization?.phone ||
                      "Choose a row to edit founder pricing and billing."}
                  </p>
                </div>
                {selectedOrganization?.founder_pricing_locked_at ? (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-primary">
                    Founder locked
                  </span>
                ) : null}
              </div>

              {statusMessage ? (
                <div
                  className={`mt-4 rounded-2xl px-4 py-3 text-sm font-medium ${
                    statusTone === "success"
                      ? "bg-emerald-500/10 text-emerald-700"
                      : statusTone === "error"
                        ? "bg-rose-500/10 text-rose-700"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  {statusMessage}
                </div>
              ) : null}

              <form onSubmit={handleSave} className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                    Plan
                  </span>
                  <select
                    value={formState.plan_type}
                    onChange={(event) =>
                      updateFormValue("plan_type", event.target.value)
                    }
                    disabled={!selectedOrganization}
                    className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none disabled:opacity-50"
                  >
                    {PLAN_OPTIONS.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Billing Cycle
                    </span>
                    <select
                      value={formState.billing_cycle}
                      onChange={(event) =>
                        updateFormValue(
                          "billing_cycle",
                          event.target.value as OrganizationFormState["billing_cycle"],
                        )
                      }
                      disabled={!selectedOrganization}
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none disabled:opacity-50"
                    >
                      {BILLING_OPTIONS.map((cycle) => (
                        <option key={cycle} value={cycle}>
                          {cycle}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Account State
                    </span>
                    <select
                      value={formState.account_state}
                      onChange={(event) =>
                        updateFormValue("account_state", event.target.value)
                      }
                      disabled={!selectedOrganization}
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none disabled:opacity-50"
                    >
                      {ACCOUNT_STATE_OPTIONS.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="flex items-center gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3">
                  <input
                    type="checkbox"
                    checked={formState.is_active}
                    onChange={(event) =>
                      updateFormValue("is_active", event.target.checked)
                    }
                    disabled={!selectedOrganization}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-semibold text-on-surface">
                    Workspace is active
                  </span>
                </label>

                <label className="flex items-center gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-4 py-3">
                  <input
                    type="checkbox"
                    checked={formState.founder_pricing_locked}
                    onChange={(event) =>
                      updateFormValue(
                        "founder_pricing_locked",
                        event.target.checked,
                      )
                    }
                    disabled={!selectedOrganization}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-semibold text-on-surface">
                    Lock founder pricing for this workspace
                  </span>
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Founder Plan
                    </span>
                    <select
                      value={formState.founder_pricing_plan_type}
                      onChange={(event) =>
                        updateFormValue(
                          "founder_pricing_plan_type",
                          event.target.value,
                        )
                      }
                      disabled={
                        !selectedOrganization || !formState.founder_pricing_locked
                      }
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none disabled:opacity-50"
                    >
                      {PLAN_OPTIONS.filter((plan) => plan !== "free").map((plan) => (
                        <option key={plan} value={plan}>
                          {plan}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                      Founder Billing
                    </span>
                    <select
                      value={formState.founder_pricing_billing_cycle}
                      onChange={(event) =>
                        updateFormValue(
                          "founder_pricing_billing_cycle",
                          event.target.value as OrganizationFormState["founder_pricing_billing_cycle"],
                        )
                      }
                      disabled={
                        !selectedOrganization || !formState.founder_pricing_locked
                      }
                      className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none disabled:opacity-50"
                    >
                      {BILLING_OPTIONS.map((cycle) => (
                        <option key={cycle} value={cycle}>
                          {cycle}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-on-surface-variant">
                    Founder Customer Cap
                  </span>
                  <input
                    value={formState.founder_pricing_customer_cap}
                    onChange={(event) =>
                      updateFormValue(
                        "founder_pricing_customer_cap",
                        event.target.value,
                      )
                    }
                    inputMode="numeric"
                    placeholder="1000"
                    disabled={
                      !selectedOrganization || !formState.founder_pricing_locked
                    }
                    className="w-full rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 py-3 text-sm outline-none disabled:opacity-50"
                  />
                </label>

                <div className="rounded-2xl bg-primary/5 px-4 py-4 text-sm text-on-surface-variant">
                  Founder lock preserves the selected plan and billing cycle for this
                  workspace even after public pricing changes.
                </div>

                <button
                  type="submit"
                  disabled={!selectedOrganization || saving}
                  className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving ? "Saving changes..." : "Save workspace settings"}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest px-5 py-4 shadow-[0_8px_30px_rgba(25,28,30,0.06)]">
      <p className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-on-surface">{value}</p>
      <p className="mt-2 text-sm text-on-surface-variant">{hint}</p>
    </div>
  );
}

function ReportCard({
  title,
  subtitle,
  headers,
  rows,
  emptyText,
  actionLabel,
  onAction,
}: {
  title: string;
  subtitle: string;
  headers: [string, string];
  rows: string[][];
  emptyText: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-on-surface">{title}</h3>
          <p className="mt-1 text-sm text-on-surface-variant">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={onAction}
          className="rounded-xl border border-outline-variant/20 bg-surface-container-lowest px-3 py-2 text-xs font-semibold text-primary"
        >
          {actionLabel}
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-outline-variant/20">
        <div className="grid grid-cols-2 bg-surface-container-lowest px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
          <span>{headers[0]}</span>
          <span>{headers[1]}</span>
        </div>
        {rows.length ? (
          rows.map((row, index) => (
            <div
              key={`${row[0]}-${index}`}
              className={`grid grid-cols-2 px-4 py-3 text-sm ${
                index % 2 === 0 ? "bg-surface-container" : "bg-surface-container-lowest"
              }`}
            >
              <span className="text-on-surface">{row[0]}</span>
              <span className="font-semibold text-on-surface">{row[1]}</span>
            </div>
          ))
        ) : (
          <div className="px-4 py-8 text-sm text-on-surface-variant">
            {emptyText}
          </div>
        )}
      </div>
    </div>
  );
}
