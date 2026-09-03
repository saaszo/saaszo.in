"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  useAuthSession,
  type BillingCatalogInfo,
} from "@/components/AuthProvider";
import {
  executionPhases,
  getBillingCycleDisplayName,
  getRecommendedBillingCycle,
  FOUNDER_PRICING_NOTE,
  FOUNDER_USER_TARGET,
  getNextPlanSlug,
  getPlanDisplayName,
  getPlanPrice,
  getPlanPriceSuffix,
  isPlanAtLeast,
  normalizeBillingCycle,
  normalizePlanSlug,
  planCapabilityMatrix,
  publicPricingPlans,
  growthMilestones,
} from "@/lib/pricing-plans";

export default function BillingPage() {
  const router = useRouter();
  const {
    authenticated,
    getBillingCatalog,
    loading,
    onboarding,
    subscription,
    workspaceUser,
    saveBillingPlan,
  } =
    useAuthSession();
  const currentPlanKey = useMemo(
    () => normalizePlanSlug(subscription?.planKey ?? subscription?.planName),
    [subscription?.planKey, subscription?.planName],
  );
  const currentBillingCycle = useMemo(
    () => normalizeBillingCycle(subscription?.billingCycle, currentPlanKey),
    [currentPlanKey, subscription?.billingCycle],
  );
  const [selectedPlan, setSelectedPlan] = useState(currentPlanKey);
  const [selectedBillingCycle, setSelectedBillingCycle] =
    useState(currentBillingCycle);
  const [billingCatalog, setBillingCatalog] =
    useState<BillingCatalogInfo | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);
  const nextPlanKey = useMemo(
    () => getNextPlanSlug(currentPlanKey),
    [currentPlanKey],
  );
  const capabilityMatrix = billingCatalog?.capabilityMatrix ?? planCapabilityMatrix;
  const nextPlanLockedCapabilities = useMemo(() => {
    if (!nextPlanKey) {
      return [];
    }

    return capabilityMatrix.filter(
      (capability) =>
        !isPlanAtLeast(currentPlanKey, capability.minimumPlan) &&
        isPlanAtLeast(nextPlanKey, capability.minimumPlan),
    );
  }, [capabilityMatrix, currentPlanKey, nextPlanKey]);
  const visiblePlans = billingCatalog?.publicPlans ?? publicPricingPlans;
  const founderPricingTarget =
    billingCatalog?.founderPricingTarget ??
    subscription?.founderPricingCustomerCap ??
    FOUNDER_USER_TARGET;

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
    setSelectedPlan(currentPlanKey);
    setSelectedBillingCycle(currentBillingCycle);
  }, [currentBillingCycle, currentPlanKey]);

  useEffect(() => {
    let cancelled = false;

    async function loadBillingCatalog() {
      const catalog = await getBillingCatalog();

      if (!cancelled && catalog) {
        setBillingCatalog(catalog);
      }
    }

    if (authenticated) {
      void loadBillingCatalog();
    }

    return () => {
      cancelled = true;
    };
  }, [authenticated]);

  useEffect(() => {
    setSelectedBillingCycle((current) =>
      normalizeBillingCycle(current, selectedPlan),
    );
  }, [selectedPlan]);

  useEffect(() => {
    if (!loading && authenticated && requiresSetupCompletion) {
      startTransition(() => {
        router.replace("/dashboard/setup");
      });
    }
  }, [authenticated, loading, requiresSetupCompletion, router]);

  if (loading || (authenticated && requiresSetupCompletion)) {
    return (
      <div className="min-h-screen bg-background text-slate-900 flex items-center justify-center px-6">
        <p className="text-lg font-semibold">Loading billing...</p>
      </div>
    );
  }

  if (!authenticated || !subscription) {
    return null;
  }

  const founderPricingStatus = subscription.founderPricingLocked
    ? `Locked on ${subscription.founderPricingLockedAt ? new Date(subscription.founderPricingLockedAt).toLocaleDateString() : "your signup date"}`
    : "Not locked yet";

  const hasPlanChanged =
    selectedPlan !== currentPlanKey ||
    selectedBillingCycle !== currentBillingCycle;

  async function handleSavePlan() {
    if (!hasPlanChanged || saving) {
      return;
    }

    setSaving(true);
    setSaveMessage("");
    setSaveError("");

    const result = await saveBillingPlan(selectedPlan, selectedBillingCycle);

    if (result.success) {
      setSaveMessage(result.message || "Billing plan updated successfully.");
      const refreshedCatalog = await getBillingCatalog();
      if (refreshedCatalog) {
        setBillingCatalog(refreshedCatalog);
      }
    } else {
      setSaveError(result.message || "Could not update billing plan.");
    }

    setSaving(false);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="rounded-none border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">
                Subscription & Plans
              </span>
              <span className="rounded-none bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase">
                {subscription.status}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {subscription.planName} Plan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              Manage your workspace plan, active seats, and locked founder pricing benefits.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-none border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Public Pricing</span>
              <span className="material-symbols-outlined text-xs">north_east</span>
            </Link>
          </div>
        </div>

        {/* Founder Pricing Progress Bar */}
        <div className="mt-6 p-5 rounded-none bg-indigo-50/50 border border-indigo-100/80">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-none bg-indigo-600" />
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-900">
                Founder Pricing Target Progress
              </p>
            </div>
            <span className="text-xs font-bold text-indigo-700">
              {subscription.currentPaidCustomers ?? 0} / {founderPricingTarget.toLocaleString()} Slots Claimed
            </span>
          </div>

          <div className="h-2.5 w-full overflow-hidden rounded-none bg-indigo-100">
            <div
              className="h-full rounded-none bg-indigo-600 transition-all duration-500"
              style={{
                width: `${Math.max(
                  Math.min(
                    (((subscription.currentPaidCustomers ?? 0) / founderPricingTarget) * 100),
                    100,
                  ),
                  3,
                )}%`,
              }}
            />
          </div>

          <p className="mt-2.5 text-xs text-indigo-800/80 leading-relaxed">
            {subscription.founderPricingLocked
              ? `Founder pricing is locked on this account for the ${subscription.founderPricingPlanKey ? normalizePlanSlug(subscription.founderPricingPlanKey).replace(/_/g, " ") : currentPlanKey} plan.`
              : `${subscription.founderSlotsRemaining ?? 0} founder slots remaining before standard commercial pricing applies.`}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <BillingCard label="Current Plan" value={subscription.planName} />
          <BillingCard label="Account Status" value={subscription.status} />
          <BillingCard
            label="Billing Cycle"
            value={getBillingCycleDisplayName(currentBillingCycle)}
          />
          <BillingCard label="Seats Included" value={`${subscription.seats} Active`} />
          <BillingCard
            label="Founder Pricing"
            value={founderPricingStatus}
          />
          <BillingCard
            label="Renewal Status"
            value={
              subscription.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : "Active Trial"
            }
          />
        </div>

        <div className="mt-6 rounded-none bg-slate-50 p-4 border border-slate-200/70">
          <p className="text-xs text-slate-600 font-medium">
            {subscription.currentPeriodEnd
              ? `Your renewal date is ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}.`
              : "This account is currently on a default trial subscription without a renewal date."}
          </p>
        </div>
      </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {growthMilestones.map((milestone) => (
              <div
                key={milestone.key}
                className="rounded-none border border-slate-200/80 bg-slate-50 px-5 py-5"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                  {milestone.title}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {milestone.goal}
                </p>
                <ul className="mt-4 space-y-2">
                  {milestone.signals.map((signal) => (
                    <li
                      key={signal}
                      className="flex items-start gap-2 text-xs text-slate-500"
                    >
                      <span className="mt-1 inline-block h-2 w-2 rounded-none bg-primary" />
                      <span>{signal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-none border border-slate-200/80 bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Included in this plan
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-900">
              {subscription.headline ?? "Workspace access summary"}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(subscription.includedFeatures ?? []).map((feature) => (
                <span
                  key={feature}
                  className="rounded-none border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-6 rounded-none border border-slate-200/80 bg-slate-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Next unlocks
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {nextPlanKey
                    ? `Upgrade to ${getPlanDisplayName(nextPlanKey)} to open the next operational layer.`
                    : "You are already on the top visible plan tier."}
                </p>
              </div>
              {nextPlanKey ? (
                <span className="rounded-none bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  Next: {getPlanDisplayName(nextPlanKey)}
                </span>
              ) : null}
            </div>

            {nextPlanLockedCapabilities.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {nextPlanLockedCapabilities.map((capability) => (
                  <span
                    key={capability.key}
                    className="rounded-none border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600"
                  >
                    {capability.label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-slate-500">
                No extra unlocks are pending above this plan inside the current public ladder.
              </p>
            )}
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-primary">
                  Plan ladder
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Upgrade path for growing teams
                </h2>
              </div>
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 rounded-none border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold hover:border-primary/40 hover:text-primary transition-colors"
              >
                View public pricing
                <span className="material-symbols-outlined text-sm">
                  north_east
                </span>
              </Link>
            </div>

            <div className="mt-5 rounded-none border border-slate-200/80 bg-slate-50 px-5 py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Workspace plan selection
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose the plan you want this company to operate on. This
                    saves your current billing intent for future upgrades and
                    founder pricing tracking.
                  </p>
                </div>
                <div className="rounded-none bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  Current: {subscription.planName}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {visiblePlans.map((plan) => {
                  const active = plan.slug === selectedPlan;
                  const current = plan.slug === currentPlanKey;

                  return (
                    <button
                      key={plan.slug}
                      type="button"
                      onClick={() => {
                        setSelectedPlan(plan.slug);
                        setSelectedBillingCycle(
                          getRecommendedBillingCycle(plan.slug),
                        );
                        setSaveMessage("");
                        setSaveError("");
                      }}
                      className={`rounded-none border px-4 py-3 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-slate-200/80 bg-white text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{plan.name}</span>
                        {current ? (
                          <span className="rounded-none bg-emerald-50 border border-emerald-200/60 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                            Saved
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {plan.founderMonthly === "Custom"
                          ? "Custom pricing"
                          : `${getPlanPrice(plan.slug, normalizeBillingCycle(selectedBillingCycle, plan.slug))}${getPlanPriceSuffix(normalizeBillingCycle(selectedBillingCycle, plan.slug), plan.slug)}`}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(["yearly", "monthly"] as const).map((cycle) => {
                  const normalizedCycle = normalizeBillingCycle(cycle, selectedPlan);
                  const active = normalizedCycle === selectedBillingCycle;
                  const disabled = selectedPlan === "free" && cycle !== "yearly";

                  return (
                    <button
                      key={cycle}
                      type="button"
                      disabled={selectedPlan === "free"}
                      onClick={() => {
                        setSelectedBillingCycle(normalizedCycle);
                        setSaveMessage("");
                        setSaveError("");
                      }}
                      className={`rounded-none border px-4 py-3 text-left transition-colors ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-slate-200/80 bg-white text-slate-900"
                      } ${disabled ? "opacity-60" : ""}`}
                    >
                      <div className="text-sm font-bold">
                        {getBillingCycleDisplayName(normalizedCycle)}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {cycle === "yearly"
                          ? "Recommended for founder pricing"
                          : "Pay month to month"}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleSavePlan}
                  disabled={!hasPlanChanged || saving}
                  className="inline-flex items-center justify-center rounded-none bg-primary px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save workspace plan"}
                </button>
                {hasPlanChanged ? (
                  <p className="text-xs text-slate-500">
                    Selected plan will replace the currently saved plan after
                    you confirm.
                  </p>
                ) : (
                  <p className="text-xs text-slate-500">
                    This workspace is already saved on the selected plan.
                  </p>
                )}
              </div>

              {saveMessage ? (
                <p className="mt-3 text-sm font-medium text-emerald-600">
                  {saveMessage}
                </p>
              ) : null}
              {saveError ? (
                <p className="mt-3 text-sm font-medium text-red-600">
                  {saveError}
                </p>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {visiblePlans.map((plan) => (
                <div
                  key={plan.name}
                  className={`rounded-none border px-5 py-5 ${
                    plan.highlighted
                      ? "border-primary/30 bg-primary/5"
                      : "border-slate-200/80 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-bold">{plan.name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {plan.description}
                      </p>
                    </div>
                    {plan.badge ? (
                      <span className="rounded-none bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white">
                        {plan.badge}
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <div className="rounded-none border border-slate-200/80 bg-white px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                        Founder price
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {plan.founderMonthly === "Custom"
                          ? "Custom plan"
                          : `${plan.founderMonthly}/mo`}
                      </p>
                      <p className="text-xs text-slate-500">
                        {plan.founderYearly === "Custom"
                          ? "Custom yearly rollout"
                          : `${plan.founderYearly}/year`}
                      </p>
                    </div>
                    <div className="rounded-none border border-slate-200/80 bg-white px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-tertiary">
                        Later new-user price
                      </p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        {plan.nextMonthly === "Custom"
                          ? "Custom plan"
                          : `${plan.nextMonthly}/mo`}
                      </p>
                      <p className="text-xs text-slate-500">
                        {plan.nextYearly === "Custom"
                          ? "Custom yearly rollout"
                          : `${plan.nextYearly}/year`}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-none border border-slate-200/80 bg-slate-50 px-5 py-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Shipping roadmap
              </p>
              <p className="mt-2 text-sm text-slate-500">
                These phases explain why founder pricing stays low now and where operational depth keeps growing next.
              </p>
              <div className="mt-5 grid gap-4 xl:grid-cols-2">
                {executionPhases.map((phase) => (
                  <div
                    key={phase.key}
                    className="rounded-none border border-slate-200/80 bg-white px-4 py-4"
                  >
                    <p className="text-sm font-bold text-slate-900">{phase.title}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {phase.goal}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {phase.scope.slice(0, 3).map((item) => (
                        <span
                          key={item}
                          className="rounded-none bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 text-[10px] font-semibold text-primary"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    );
}

function BillingCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-none border border-slate-200/80 bg-slate-50/70 p-4 transition-all">
      <p className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mb-1.5">
        {label}
      </p>
      <p className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}
