import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toAbsoluteApiUrl } from "../lib/config";
import {
  executionPhases,
  getBillingCycleDisplayName,
  getPlanDisplayName,
  getPlanPrice,
  getPlanPriceSuffix,
  growthMilestones,
  isPlanAtLeast,
  normalizeBillingCycle,
  FOUNDER_PRICING_NOTE,
  FOUNDER_USER_TARGET,
  FREE_PLAN_NOTE,
  parsePricingCatalog,
  planCapabilityMatrix,
  publicPricingPlans,
  type PricingCatalogSnapshot,
} from "../lib/pricing-plans";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "yearly",
  );
  const [liveCatalog, setLiveCatalog] = useState<PricingCatalogSnapshot | null>(
    null,
  );
  const visiblePlans = liveCatalog?.publicPlans ?? publicPricingPlans;
  const capabilityMatrix = liveCatalog?.capabilityMatrix ?? planCapabilityMatrix;
  const founderPricingTarget =
    liveCatalog?.founderPricingTarget ?? FOUNDER_USER_TARGET;
  const yearlyPlansCount = useMemo(
    () => visiblePlans.filter((plan) => plan.slug !== "free").length,
    [visiblePlans],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadPricingMeta() {
      try {
        const response = await fetch(toAbsoluteApiUrl("/meta/pricing"), {
          method: "GET",
          cache: "no-store",
        });
        const payload = await response.json().catch(() => null);

        if (!response.ok || !payload?.success || cancelled) {
          return;
        }

        const catalog = parsePricingCatalog(payload);
        if (!catalog) {
          return;
        }

        setLiveCatalog(catalog);
      } catch {
        // Leave the banner on static founder copy if live stats are unavailable.
      }
    }

    void loadPricingMeta();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-28 relative" id="pricing">
      {/* Background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(6,182,212,0.03) 50%, transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#06b6d4" }}>
            Pricing
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight mb-4">
            Founder pricing built
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              to win early businesses.
            </span>
          </h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto">
            Start free, move to low-cost founder plans, and keep your early pricing locked while SaaSzo grows.
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full border border-outline-variant/20 bg-surface-container p-1 shadow-sm">
            {(["yearly", "monthly"] as const).map((cycle) => {
              const active = billingCycle === cycle;
              return (
                <button
                  key={cycle}
                  type="button"
                  onClick={() => setBillingCycle(cycle)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    active
                      ? "bg-primary text-white"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  {getBillingCycleDisplayName(cycle)}
                  {cycle === "yearly" ? " · Best value" : ""}
                </button>
              );
            })}
          </div>
        </div>

        <p className="mb-8 text-center text-sm text-on-surface-variant">
          {billingCycle === "yearly"
            ? `Yearly pricing is the recommended default for ${yearlyPlansCount} paid plans.`
            : "Monthly pricing is available if you want a lighter starting commitment."}
        </p>

        {/* Founder pricing banner */}
        <div
          className="max-w-4xl mx-auto mb-12 rounded-2xl px-6 py-4 flex items-center gap-4 border"
          style={{
            background: "rgba(6,182,212,0.08)",
            borderColor: "rgba(6,182,212,0.25)",
          }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "rgba(6,182,212,0.2)", color: "#06b6d4" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
            </svg>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold" style={{ color: "#06b6d4" }}>
              Founder pricing for the first {founderPricingTarget.toLocaleString()} paid users
            </p>
            <p className="text-sm font-medium" style={{ color: "#06b6d4" }}>
              {FOUNDER_PRICING_NOTE}
            </p>
            <p className="text-xs font-medium text-on-surface-variant">
              {FREE_PLAN_NOTE}
            </p>
            {liveCatalog ? (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="rounded-full bg-surface-container-lowest px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                  {liveCatalog.paidCustomers.toLocaleString()} paid workspaces
                </span>
                <span className="rounded-full bg-surface-container-lowest px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-on-surface">
                  {liveCatalog.founderSlotsRemaining.toLocaleString()} founder slots visible
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 md:grid-cols-2 gap-6 items-stretch">
          {visiblePlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 flex flex-col border transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? "border-primary/40"
                  : "border-outline-variant/20"
              } bg-surface-container-lowest`}
              style={{
                boxShadow: plan.highlighted
                  ? "0 8px 48px rgba(6,182,212,0.15)"
                  : "0 2px 12px rgba(0,0,0,0.04)",
              }}
            >
              {plan.badge && (
                <div
                  className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-xs font-bold text-white px-4 py-1.5 rounded-full whitespace-nowrap"
                  style={{
                    background: plan.highlighted
                      ? "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)"
                      : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  }}
                >
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-on-surface mb-1">{plan.name}</h3>
                <p className="text-sm text-on-surface-variant mb-4">{plan.description}</p>
                <div className="space-y-3">
                  <div className="flex items-end gap-1">
                    <span className="text-5xl font-black text-on-surface">
                      {getPlanPrice(plan.slug, normalizeBillingCycle(billingCycle, plan.slug))}
                    </span>
                    <span className="text-on-surface-variant mb-1.5 text-sm">
                      {getPlanPriceSuffix(
                        normalizeBillingCycle(billingCycle, plan.slug),
                        plan.slug,
                      )}
                    </span>
                  </div>
                  <div className="rounded-xl border border-outline-variant/20 bg-surface-container px-3 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                      Founder price
                    </p>
                    <p className="mt-1 text-sm font-semibold text-on-surface">
                      {plan.founderMonthly === "Custom"
                        ? "Custom monthly and yearly rollout"
                        : `${plan.founderMonthly}/mo or ${plan.founderYearly}/year`}
                    </p>
                    {plan.nextMonthly !== plan.founderMonthly && (
                      <p className="mt-1 text-xs text-on-surface-variant">
                        Later new-user price: {plan.nextMonthly}/mo or {plan.nextYearly}/year
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-start gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: plan.highlighted ? "rgba(6,182,212,0.15)" : "rgba(139,92,246,0.15)",
                      color: plan.highlighted ? "#06b6d4" : "#8b5cf6",
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="text-on-surface text-sm font-semibold">{plan.audience}</span>
                </li>
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: plan.highlighted ? "rgba(6,182,212,0.15)" : "rgba(139,92,246,0.15)",
                        color: plan.highlighted ? "#06b6d4" : "#8b5cf6",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-on-surface-variant text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`${plan.href}?plan=${plan.slug}&billing=${normalizeBillingCycle(
                  billingCycle,
                  plan.slug,
                )}`}
                className="w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-px active:scale-95"
                style={plan.highlighted
                  ? {
                      background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
                      color: "#fff",
                      boxShadow: "0 4px 20px rgba(6,182,212,0.3)",
                    }
                  : {
                      border: "1px solid var(--color-outline-variant)",
                      color: "var(--color-on-surface)",
                    }}
              >
                {plan.cta} →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-primary">
                Access Matrix
              </p>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-on-surface">
                See exactly what unlocks at each tier
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
                This is the operational upgrade ladder behind SaaSzo pricing.
                Every plan unlocks the previous tier plus its own added workflows.
              </p>
            </div>
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container px-4 py-3 text-sm text-on-surface-variant">
              Founder pricing stays locked for early paid users even if later public pricing moves up.
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-2xl border border-outline-variant/20">
              <thead>
                <tr className="bg-surface-container">
                  <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant">
                    Workflow
                  </th>
                  {visiblePlans.map((plan) => (
                    <th
                      key={plan.slug}
                      className="min-w-[160px] border-l border-outline-variant/10 px-4 py-4 text-left"
                    >
                      <div className="text-sm font-bold text-on-surface">
                        {plan.name}
                      </div>
                      <div className="mt-1 text-xs text-on-surface-variant">
                        {plan.founderMonthly === "Custom"
                          ? "Custom rollout"
                          : `${getPlanPrice(
                              plan.slug,
                              normalizeBillingCycle(billingCycle, plan.slug),
                            )}${getPlanPriceSuffix(
                              normalizeBillingCycle(billingCycle, plan.slug),
                              plan.slug,
                            )}`}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {capabilityMatrix.map((capability, index) => (
                  <tr
                    key={capability.key}
                    className={
                      index % 2 === 0
                        ? "bg-surface-container-lowest"
                        : "bg-surface-container"
                    }
                  >
                    <td className="px-4 py-4 align-top">
                      <div className="text-sm font-semibold text-on-surface">
                        {capability.label}
                      </div>
                      <div className="mt-1 text-xs leading-5 text-on-surface-variant">
                        {capability.description}
                      </div>
                      <div className="mt-2 inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-primary">
                        Starts in {getPlanDisplayName(capability.minimumPlan)}
                      </div>
                    </td>
                    {visiblePlans.map((plan) => {
                      const enabled = isPlanAtLeast(
                        plan.slug,
                        capability.minimumPlan,
                      );

                      return (
                        <td
                          key={`${capability.key}-${plan.slug}`}
                          className="border-l border-outline-variant/10 px-4 py-4 align-middle"
                        >
                          <div
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
                              enabled
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-surface border border-outline-variant/20 text-on-surface-variant"
                            }`}
                          >
                            <span className="material-symbols-outlined text-sm">
                              {enabled ? "check_circle" : "lock"}
                            </span>
                            {enabled ? "Included" : "Locked"}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary">
              Execution Roadmap
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-on-surface">
              Ship the right things before raising price
            </h3>
            <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
              SaaSzo pricing stays intentionally low while we finish the highest-trust workflows first.
              These are the phases guiding that rollout.
            </p>

            <div className="mt-6 space-y-4">
              {executionPhases.map((phase, index) => (
                <div
                  key={phase.key}
                  className="rounded-2xl border border-outline-variant/20 bg-surface-container px-5 py-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary">
                          {index + 1}
                        </span>
                        <p className="text-lg font-bold text-on-surface">{phase.title}</p>
                      </div>
                      <p className="mt-3 text-sm font-medium text-on-surface">
                        {phase.goal}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-primary">
                        Scope
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {phase.scope.map((item) => (
                          <span
                            key={item}
                            className="rounded-full border border-outline-variant/20 bg-surface-container-lowest px-3 py-1.5 text-xs font-medium text-on-surface-variant"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-tertiary">
                        Exit Criteria
                      </p>
                      <ul className="mt-3 space-y-2">
                        {phase.exitCriteria.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2 text-sm text-on-surface-variant"
                          >
                            <span className="mt-1 inline-block h-2 w-2 rounded-full bg-tertiary" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest p-6 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary">
              Growth Gates
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-on-surface">
              Founder pricing stays low until the business earns the increase
            </h3>
            <p className="mt-2 text-sm text-on-surface-variant">
              Pricing grows in stages, but only after retention, support quality, and operations stay healthy.
            </p>

            <div className="mt-6 space-y-4">
              {growthMilestones.map((milestone) => (
                <div
                  key={milestone.key}
                  className="rounded-2xl border border-outline-variant/20 bg-surface-container px-5 py-5"
                >
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-primary">
                    {milestone.title}
                  </p>
                  <p className="mt-2 text-base font-semibold text-on-surface">
                    {milestone.goal}
                  </p>
                  <ul className="mt-4 space-y-2">
                    {milestone.signals.map((signal) => (
                      <li
                        key={signal}
                        className="flex items-start gap-2 text-sm text-on-surface-variant"
                      >
                        <span className="mt-1 inline-block h-2 w-2 rounded-full bg-primary" />
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
