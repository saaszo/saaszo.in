export const FOUNDER_USER_TARGET = 1000;

export const FOUNDER_PRICING_NOTE =
  "Founder pricing stays locked for the first 1,000 paid customers. New-user pricing increases only after retention and support quality are proven.";

export const FREE_PLAN_NOTE =
  "Free remains available for solo businesses that want to start with core billing and inventory workflows.";

export type BillingCycle = "monthly" | "yearly" | "free_forever";

export type PublicPricingPlan = {
  slug: string;
  name: string;
  founderMonthly: string;
  founderYearly: string;
  nextMonthly: string;
  nextYearly: string;
  description: string;
  audience: string;
  features: string[];
  cta: string;
  href: string;
  highlighted?: boolean;
  badge?: string | null;
};

export type PlanCapability = {
  key: string;
  label: string;
  description: string;
  minimumPlan: string;
};

export type GrowthMilestone = {
  key: string;
  title: string;
  goal: string;
  signals: string[];
};

export type ExecutionPhase = {
  key: string;
  title: string;
  goal: string;
  scope: string[];
  exitCriteria: string[];
};

export type PricingCatalogSnapshot = {
  founderPricingTarget: number;
  paidCustomers: number;
  founderSlotsRemaining: number;
  publicPlans: PublicPricingPlan[];
  capabilityMatrix: PlanCapability[];
};

export const publicPricingPlans: PublicPricingPlan[] = [
  {
    slug: "free",
    name: "Free",
    founderMonthly: "₹0",
    founderYearly: "₹0",
    nextMonthly: "₹0",
    nextYearly: "₹0",
    description: "Start billing, inventory, and payments without a card.",
    audience: "Solo shop or first-time digital business",
    features: [
      "1 business, 1 user",
      "GST and non-GST invoices",
      "Basic inventory and barcode lookup",
      "WhatsApp sharing and payment reminders",
      "Basic reports with SaaSzo branding",
    ],
    cta: "Start Free",
    href: "/register",
    badge: "Best for first-time setup",
  },
  {
    slug: "starter",
    name: "Starter",
    founderMonthly: "₹99",
    founderYearly: "₹999",
    nextMonthly: "₹199",
    nextYearly: "₹1,999",
    description: "Low-cost cloud billing for small shops ready to scale.",
    audience: "Price-sensitive store owner",
    features: [
      "Remove SaaSzo branding",
      "Cloud sync and cleaner exports",
      "Category, brand, barcode setup",
      "Bulk import and export",
      "2-3 users and 2-3 businesses",
    ],
    cta: "Choose Starter",
    href: "/register",
  },
  {
    slug: "growth",
    name: "Growth",
    founderMonthly: "₹249",
    founderYearly: "₹2,499",
    nextMonthly: "₹399",
    nextYearly: "₹3,999",
    description: "Retail operations plan for shops with daily stock pressure.",
    audience: "Billing desk plus inventory team",
    features: [
      "POS billing and barcode printing",
      "Branch and warehouse stock workflows",
      "Stock tally with difference handling",
      "Fund transfer and branch controls",
      "5 users with stronger exports",
    ],
    cta: "Choose Growth",
    href: "/register",
    highlighted: true,
    badge: "Founder best value",
  },
  {
    slug: "business_pro",
    name: "Business Pro",
    founderMonthly: "₹499",
    founderYearly: "₹4,999",
    nextMonthly: "₹799",
    nextYearly: "₹7,999",
    description: "For multi-branch operators who need tighter control.",
    audience: "Owner-managed retail operations",
    features: [
      "Advanced branch accounting",
      "Approval and audit workflows",
      "Richer analytics and owner reports",
      "Team permissions and visibility",
      "Priority operational support",
    ],
    cta: "Choose Business Pro",
    href: "/register",
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    founderMonthly: "Custom",
    founderYearly: "Custom",
    nextMonthly: "Custom",
    nextYearly: "Custom",
    description: "Custom rollout for chains, managed accounts, and integrations.",
    audience: "Large retail groups and managed deployments",
    features: [
      "High user limits and rollout support",
      "API, webhooks, and custom reports",
      "Dedicated onboarding assistance",
      "Priority SLA-style support",
      "Custom security and workflow controls",
    ],
    cta: "Talk to Sales",
    href: "/register",
  },
];

export const planCapabilityMatrix: PlanCapability[] = [
  {
    key: "invoice",
    label: "Invoice & Billing",
    description: "GST invoices, collections, reminders, and basic reports",
    minimumPlan: "free",
  },
  {
    key: "inventory",
    label: "Inventory Control",
    description: "Category, brand, barcode, and better stock workflows",
    minimumPlan: "starter",
  },
  {
    key: "task",
    label: "Task Management",
    description: "Projects, team tasks, and shared delivery visibility",
    minimumPlan: "starter",
  },
  {
    key: "seller",
    label: "Seller Hub",
    description: "Marketplace orders, returns, charges, and settlements",
    minimumPlan: "growth",
  },
  {
    key: "pos",
    label: "POS + Barcode",
    description: "Fast billing desk, barcode print, and thermal support",
    minimumPlan: "growth",
  },
  {
    key: "branch_ops",
    label: "Branch Operations",
    description: "Stock tally, branch stock transfer, and fund transfer",
    minimumPlan: "growth",
  },
  {
    key: "engage",
    label: "Engage Automations",
    description: "Broadcasts, follow-ups, and customer journey workflows",
    minimumPlan: "business_pro",
  },
  {
    key: "hrms",
    label: "HRMS & Payroll",
    description: "Attendance, staff records, payroll, and admin controls",
    minimumPlan: "business_pro",
  },
  {
    key: "crm",
    label: "Custom Scale",
    description: "API, custom rollout, advanced reports, and managed support",
    minimumPlan: "enterprise",
  },
];

export const growthMilestones: GrowthMilestone[] = [
  {
    key: "milestone_a",
    title: "Milestone A",
    goal: "Reach 100 active businesses and 25 paid users with reliable daily billing and stock flows.",
    signals: [
      "Invoices, products, payments, and tally run without trust-breaking bugs",
      "First paid users keep founder pricing locked",
      "Support issues stay manageable while onboarding real stores",
    ],
  },
  {
    key: "milestone_b",
    title: "Milestone B",
    goal: "Cross 300 paid users with healthy retention and operational confidence.",
    signals: [
      "Branch accounting is used by real multi-store operators",
      "Monthly churn stays under target",
      "Reports, exports, and printer flows feel dependable",
    ],
  },
  {
    key: "milestone_c",
    title: "Milestone C",
    goal: "Reach 1,000 paid users before raising public pricing for new customers.",
    signals: [
      "Retention is validated before price increase",
      "Existing founder users keep their original pricing",
      "Enterprise and higher-control workflows become the next growth lever",
    ],
  },
];

export const executionPhases: ExecutionPhase[] = [
  {
    key: "phase_1",
    title: "Phase 1 · Foundation & Conversion",
    goal: "Make billing, inventory, and reports reliably usable so free users build habit fast.",
    scope: [
      "Invoice create, edit, print, and PDF",
      "Product create, edit, and category workflows",
      "Dashboard, collections, and customer balance correctness",
      "Barcode scan, item lookup, and stable branch sync",
    ],
    exitCriteria: [
      "No major mismatch across dashboard, invoices, products, and collections",
      "Reports and exports reflect real data instead of placeholders",
    ],
  },
  {
    key: "phase_2",
    title: "Phase 2 · Retail Operations",
    goal: "Beat lightweight billing apps in real daily shop-floor usage.",
    scope: [
      "POS-speed billing replacement",
      "Barcode printing, preview, and printer settings",
      "Stock tally with sold, missing, damaged, and adjustment states",
      "Low-stock and stock-movement workflows",
    ],
    exitCriteria: [
      "One store can run daily billing and stock work comfortably",
      "Thermal and barcode printing feels production-ready",
    ],
  },
  {
    key: "phase_3",
    title: "Phase 3 · Multi-Branch Control",
    goal: "Give owners clear branch-wise stock, sales, and money visibility.",
    scope: [
      "Branch stock transfer and acceptance",
      "Branch-to-owner fund transfer tracking",
      "Branch-level reports and exports",
      "Owner summaries for sales, stock, and cash movement",
    ],
    exitCriteria: [
      "An owner can answer what sold, what stock remains, and what cash transferred in each branch",
      "Branch operators can close daily transfer and tally loops clearly",
    ],
  },
  {
    key: "phase_4",
    title: "Phase 4 · Management & Team Workflows",
    goal: "Move from billing app to a stronger business operating system.",
    scope: [
      "Role-based permissions and approvals",
      "Audit visibility and exception handling",
      "Richer analytics and controlled team workflows",
      "Add-on staff tools only where retention proves demand",
    ],
    exitCriteria: [
      "Business Pro and Enterprise tiers feel meaningfully differentiated",
      "Operational controls justify higher pricing for new customers",
    ],
  },
];

function mapPublicPlan(plan: Record<string, unknown>): PublicPricingPlan {
  const slug = normalizePlanSlug(String(plan.slug ?? ""));
  const name = String(plan.name ?? getPlanDisplayName(slug));

  return {
    slug,
    name,
    founderMonthly: String(plan.founder_monthly ?? getPlanPrice(slug, "monthly")),
    founderYearly: String(plan.founder_yearly ?? getPlanPrice(slug, "yearly")),
    nextMonthly: String(
      plan.next_monthly ?? getPlanPrice(slug, "monthly", "next"),
    ),
    nextYearly: String(
      plan.next_yearly ?? getPlanPrice(slug, "yearly", "next"),
    ),
    description: String(plan.description ?? ""),
    audience: String(plan.audience ?? ""),
    features: Array.isArray(plan.features)
      ? plan.features.map((feature) => String(feature))
      : [],
    cta:
      slug === "free"
        ? "Start Free"
        : slug === "enterprise"
          ? "Talk to Sales"
          : `Choose ${name}`,
    href: "/register",
    highlighted: Boolean(plan.highlighted),
    badge: plan.badge ? String(plan.badge) : null,
  };
}

function mapCapability(capability: Record<string, unknown>): PlanCapability {
  return {
    key: String(capability.key ?? ""),
    label: String(capability.label ?? ""),
    description: String(capability.description ?? ""),
    minimumPlan: normalizePlanSlug(String(capability.minimum_plan ?? "free")),
  };
}

export function parsePricingCatalog(
  input: unknown,
): PricingCatalogSnapshot | null {
  if (!input || typeof input !== "object") {
    return null;
  }

  const payload = input as Record<string, unknown>;
  const data =
    payload.data && typeof payload.data === "object"
      ? (payload.data as Record<string, unknown>)
      : payload;

  return {
    founderPricingTarget: Number(
      data.founder_pricing_target ?? FOUNDER_USER_TARGET,
    ),
    paidCustomers: Number(data.paid_customers ?? 0),
    founderSlotsRemaining: Number(
      data.founder_slots_remaining ?? FOUNDER_USER_TARGET,
    ),
    publicPlans: Array.isArray(data.public_plans)
      ? data.public_plans
          .filter(
            (plan): plan is Record<string, unknown> =>
              !!plan && typeof plan === "object",
          )
          .map(mapPublicPlan)
      : publicPricingPlans,
    capabilityMatrix: Array.isArray(data.capability_matrix)
      ? data.capability_matrix
          .filter(
            (capability): capability is Record<string, unknown> =>
              !!capability && typeof capability === "object",
          )
          .map(mapCapability)
      : planCapabilityMatrix,
  };
}

const legacyPlanAliases: Record<string, string> = {
  trial: "free",
  silver: "starter",
  gold: "growth",
  business: "business_pro",
  businesspro: "business_pro",
  business_pro: "business_pro",
  pro: "business_pro",
  custom: "enterprise",
};

const planRank: Record<string, number> = {
  free: 0,
  starter: 1,
  growth: 2,
  business_pro: 3,
  enterprise: 4,
};

export function normalizePlanSlug(value: string | null | undefined) {
  const normalized = (value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (!normalized) {
    return "free";
  }

  return legacyPlanAliases[normalized] ?? normalized;
}

export function getPublicPlanBySlug(value: string | null | undefined) {
  const slug = normalizePlanSlug(value);
  return (
    publicPricingPlans.find((plan) => plan.slug === slug) ??
    publicPricingPlans[0]
  );
}

export function getPlanSeats(value: string | null | undefined) {
  const slug = normalizePlanSlug(value);

  switch (slug) {
    case "starter":
      return 3;
    case "growth":
      return 5;
    case "business_pro":
      return 15;
    case "enterprise":
      return 50;
    default:
      return 1;
  }
}

export function getPlanDisplayName(value: string | null | undefined) {
  return getPublicPlanBySlug(value).name;
}

export function getPlanBillingCycle(value: string | null | undefined) {
  const slug = normalizePlanSlug(value);
  return slug === "free" ? "free_forever" : "monthly";
}

export function getRecommendedBillingCycle(
  plan: string | null | undefined,
): BillingCycle {
  const slug = normalizePlanSlug(plan);
  return slug === "free" ? "free_forever" : "yearly";
}

export function normalizeBillingCycle(
  value: string | null | undefined,
  plan: string | null | undefined,
): BillingCycle {
  const slug = normalizePlanSlug(plan);

  if (slug === "free") {
    return "free_forever";
  }

  const normalized = (value ?? "").trim().toLowerCase();
  if (["year", "yearly", "annual", "annually"].includes(normalized)) {
    return "yearly";
  }

  return "monthly";
}

export function getPlanPrice(
  value: string | null | undefined,
  billingCycle: BillingCycle,
  stage: "founder" | "next" = "founder",
) {
  const plan = getPublicPlanBySlug(value);

  if (stage === "next") {
    return billingCycle === "yearly" ? plan.nextYearly : plan.nextMonthly;
  }

  return billingCycle === "yearly" ? plan.founderYearly : plan.founderMonthly;
}

export function getPlanPriceSuffix(
  billingCycle: BillingCycle,
  plan: string | null | undefined,
) {
  const slug = normalizePlanSlug(plan);
  if (slug === "free") {
    return "";
  }

  return billingCycle === "yearly" ? "/year" : "/mo";
}

export function getBillingCycleDisplayName(cycle: BillingCycle) {
  return cycle === "yearly"
    ? "Yearly"
    : cycle === "free_forever"
      ? "Free forever"
      : "Monthly";
}

export function getPlanFounderPriceSummary(value: string | null | undefined) {
  const plan = getPublicPlanBySlug(value);

  if (plan.founderMonthly === "Custom") {
    return "Custom pricing";
  }

  return `${plan.founderMonthly}/mo or ${plan.founderYearly}/year`;
}

export function getPlanAudience(value: string | null | undefined) {
  return getPublicPlanBySlug(value).audience;
}

export function isPlanAtLeast(
  currentPlan: string | null | undefined,
  minimumPlan: string | null | undefined,
) {
  const current = normalizePlanSlug(currentPlan);
  const minimum = normalizePlanSlug(minimumPlan);
  return (planRank[current] ?? 0) >= (planRank[minimum] ?? 0);
}

export function getNextPlanSlug(value: string | null | undefined) {
  const current = normalizePlanSlug(value);
  const currentRank = planRank[current] ?? 0;
  const nextEntry = publicPricingPlans.find(
    (plan) => (planRank[plan.slug] ?? 0) > currentRank,
  );
  return nextEntry?.slug ?? null;
}
