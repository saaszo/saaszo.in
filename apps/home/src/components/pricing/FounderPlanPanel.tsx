"use client";
import { useEffect, useState } from "react";
import { toAbsoluteApiUrl } from "@/lib/config";
import { executionPhases, getBillingCycleDisplayName, getRecommendedBillingCycle, getPlanDisplayName, getPlanPrice, getPlanPriceSuffix, growthMilestones, normalizeBillingCycle, normalizePlanSlug, parsePricingCatalog, publicPricingPlans, type PricingCatalogSnapshot } from "@/lib/pricing-plans";
const C = { rBorder: "rgba(9,9,11,0.09)", rMuted: "#64748b", rText: "#09090b", cyan: "#06b6d4", cyanMid: "#0891b2" };
type Props = {
  selectedPlan: ReturnType<typeof normalizePlanSlug>;
  selectedBillingCycle: ReturnType<typeof normalizeBillingCycle>;
  setSelectedPlan: (plan: ReturnType<typeof normalizePlanSlug>) => void;
  setSelectedBillingCycle: (cycle: ReturnType<typeof normalizeBillingCycle>) => void;
};
// Preserved for future placement; intentionally not mounted on signup.
export function FounderPlanPanel({ selectedPlan, selectedBillingCycle, setSelectedPlan, setSelectedBillingCycle }: Props) {
  const [livePricingCatalog, setLivePricingCatalog] = useState<PricingCatalogSnapshot | null>(null);
  const visiblePlans = livePricingCatalog?.publicPlans ?? publicPricingPlans;
  const founderPricingTarget = livePricingCatalog?.founderPricingTarget ?? 1000;
  useEffect(() => {
    let cancelled = false;

    async function loadPricingCatalog() {
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
        if (!cancelled && catalog) {
          setLivePricingCatalog(catalog);
        }
      } catch {
        // Static pricing copy remains as the safe fallback during signup.
      }
    }

    void loadPricingCatalog();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
          <div
            style={{
              marginBottom: "14px",
              padding: "12px",
              borderRadius: "12px",
              border: `1px solid ${C.rBorder}`,
              background: "#f8fbff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "10px",
                marginBottom: "10px",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 4px",
                    fontSize: "0.7rem",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: C.rMuted,
                    fontWeight: 700,
                  }}
                >
                  Selected founder plan
                </p>
                <h3
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 800,
                    color: C.rText,
                  }}
                >
                  {getPlanDisplayName(selectedPlan)}
                </h3>
              </div>
              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: "999px",
                  background: "rgba(6,182,212,0.1)",
                  color: C.cyanMid,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                }}
              >
                {selectedPlan === "free"
                  ? "Free forever"
                  : `${getBillingCycleDisplayName(selectedBillingCycle)} · ${getPlanPrice(selectedPlan, selectedBillingCycle)}${getPlanPriceSuffix(selectedBillingCycle, selectedPlan)}`}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "10px",
              }}
            >
              {(["yearly", "monthly"] as const).map((cycle) => {
                const active = selectedBillingCycle === cycle;
                const disabled = selectedPlan === "free" && cycle !== "yearly";

                return (
                  <button
                    key={cycle}
                    type="button"
                    disabled={selectedPlan === "free"}
                    onClick={() => setSelectedBillingCycle(normalizeBillingCycle(cycle, selectedPlan))}
                    style={{
                      flex: 1,
                      borderRadius: "10px",
                      border: active
                        ? `1px solid ${C.cyan}`
                        : `1px solid ${C.rBorder}`,
                      background: active ? "rgba(6,182,212,0.08)" : "#fff",
                      color: active ? C.cyanMid : C.rText,
                      padding: "10px 12px",
                      cursor: disabled ? "not-allowed" : "pointer",
                      opacity: disabled ? 0.6 : 1,
                    }}
                  >
                    <div style={{ fontSize: "0.78rem", fontWeight: 800 }}>
                      {getBillingCycleDisplayName(
                        normalizeBillingCycle(cycle, selectedPlan),
                      )}
                    </div>
                    <div style={{ fontSize: "0.7rem", color: C.rMuted }}>
                      {cycle === "yearly" ? "Recommended" : "Flexible"}
                    </div>
                  </button>
                );
              })}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "8px",
              }}
            >
              {visiblePlans.map((plan) => {
                const active = plan.slug === selectedPlan;

                return (
                  <button
                    key={plan.slug}
                    type="button"
                    onClick={() => {
                      setSelectedPlan(plan.slug);
                      setSelectedBillingCycle(
                        getRecommendedBillingCycle(plan.slug),
                      );
                    }}
                    style={{
                      borderRadius: "10px",
                      border: active
                        ? `1px solid ${C.cyan}`
                        : `1px solid ${C.rBorder}`,
                      background: active ? "rgba(6,182,212,0.08)" : "#fff",
                      color: active ? C.cyanMid : C.rText,
                      padding: "10px 12px",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.84rem",
                        fontWeight: 800,
                        marginBottom: "3px",
                      }}
                    >
                      {plan.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        color: active ? C.cyanMid : C.rMuted,
                      }}
                    >
                      {getPlanPrice(
                        plan.slug,
                        normalizeBillingCycle(selectedBillingCycle, plan.slug),
                      )}
                      {getPlanPriceSuffix(
                        normalizeBillingCycle(selectedBillingCycle, plan.slug),
                        plan.slug,
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            {livePricingCatalog ? (
              <div
                style={{
                  marginTop: "10px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    padding: "5px 9px",
                    borderRadius: "999px",
                    background: "rgba(6,182,212,0.08)",
                    color: C.cyanMid,
                    fontSize: "0.68rem",
                    fontWeight: 800,
                  }}
                >
                  {livePricingCatalog.founderSlotsRemaining.toLocaleString()} founder slots visible
                </span>
                <span
                  style={{
                    padding: "5px 9px",
                    borderRadius: "999px",
                    background: "rgba(15,23,42,0.05)",
                    color: C.rMuted,
                    fontSize: "0.68rem",
                    fontWeight: 800,
                  }}
                >
                  {livePricingCatalog.paidCustomers.toLocaleString()} paid workspaces
                </span>
              </div>
            ) : null}
            <div
              style={{
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: `1px solid ${C.rBorder}`,
              }}
            >
              <p
                style={{
                  margin: "0 0 8px",
                  fontSize: "0.68rem",
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: C.rMuted,
                }}
              >
                Founder roadmap
              </p>
              <div
                style={{
                  display: "grid",
                  gap: "8px",
                }}
              >
                {growthMilestones.map((milestone) => (
                  <div
                    key={milestone.key}
                    style={{
                      borderRadius: "10px",
                      border: `1px solid ${C.rBorder}`,
                      background: "#fff",
                      padding: "10px 12px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 800,
                          color: C.cyanMid,
                        }}
                      >
                        {milestone.title}
                      </span>
                      {milestone.key === "milestone_c" ? (
                        <span
                          style={{
                            fontSize: "0.66rem",
                            fontWeight: 800,
                            color: C.rMuted,
                          }}
                        >
                          Target {founderPricingTarget.toLocaleString()} paid users
                        </span>
                      ) : null}
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.72rem",
                        lineHeight: 1.5,
                        color: C.rMuted,
                      }}
                    >
                      {milestone.goal}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              {executionPhases.map((phase) => (
                <span
                  key={phase.key}
                  style={{
                    padding: "6px 9px",
                    borderRadius: "999px",
                    background: "rgba(15,23,42,0.05)",
                    color: C.rMuted,
                    fontSize: "0.68rem",
                    fontWeight: 700,
                  }}
                >
                  {phase.title}
                </span>
              ))}
            </div>
          </div>
  );
}
