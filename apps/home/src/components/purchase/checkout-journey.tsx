"use client";
import { savePurchaseReturn, clearPurchaseReturn } from "@/lib/purchase-intent";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuthSession } from "@/components/AuthProvider";
import { appConfig } from "@/lib/config";
import {
  fetchPlatformContext,
  fetchCatalogue,
  fetchWorkspaceSubscriptions,
  createCheckoutQuote,
  createCheckoutOrder,
  fetchCheckoutOrder,
  fetchPendingCheckout,
  type PlatformContext,
  type PlatformCatalogueProduct,
  type PlatformQuote,
  type PlatformOrder,
} from "@/lib/platform-client";
import { openPlatformCheckout } from "@/lib/platform-checkout";

const money = (n: number, currency: string) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency }).format(
    n / 100,
  );
export function SubscribeEntry() {
  const q = useSearchParams();
  const { authenticated, loading } = useAuthSession();
  useEffect(() => {
    if (loading) return;
    const target = new URL("/dashboard/checkout", appConfig.appUrl);
    const product = q.get("product");
    if (product && /^[a-z][a-z0-9_-]{0,40}$/.test(product))
      target.searchParams.set("product", product);
    const plan = q.get("plan_version_id");
    if (plan && /^[1-9][0-9]*$/.test(plan))
      target.searchParams.set("plan_version_id", plan);
    savePurchaseReturn(target.pathname + target.search);
    if (authenticated) window.location.replace(target.toString());
    else {
      const signup = new URL("/register", appConfig.appUrl);
      signup.searchParams.set("redirect", target.pathname + target.search);
      window.location.replace(signup.toString());
    }
  }, [authenticated, loading, q]);
  return (
    <p className="p-8" role="status">
      Opening your product subscription…
    </p>
  );
}
export function ProductCheckout() {
  const q = useSearchParams();
  const productKey = q.get("product") || "";
  const requestedVersion = Number(q.get("plan_version_id"));
  const { authenticated, workspaceUser, getHandoffToken } = useAuthSession();
  const [context, setContext] = useState<PlatformContext | null>(null);
  const [product, setProduct] = useState<PlatformCatalogueProduct | null>(null);
  const [workspace, setWorkspace] = useState<number | undefined>();
  const [version, setVersion] = useState(0);
  const [quote, setQuote] = useState<PlatformQuote | null>(null);
  const [order, setOrder] = useState<PlatformOrder | null>(null);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const epoch = useRef(0);
  const mutation = useRef(false);
  const key = useRef<string | null>(null);
  const session = useRef({ authenticated, id: workspaceUser?.id });
  session.current = { authenticated, id: workspaceUser?.id };
  useEffect(() => {
    const generation = ++epoch.current;
    let cancelled = false;
    setLoaded(false);
    setError("");
    setQuote(null);
    setOrder(null);
    setActive(false);
    setBusy(false);
    mutation.current = false;
    key.current = null;
    if (!authenticated) return;
    Promise.all([fetchPlatformContext(workspace), fetchCatalogue(productKey)])
      .then(async ([c, p]) => {
        if (cancelled || generation !== epoch.current) return;
        if (!c.ok || !c.data.success || !p.ok || !p.data.success)
          throw new Error("Could not load your workspace or product.");
        const selected = p.data.data.find(
          (item) => item.product_key === productKey,
        );
        if (!selected)
          throw new Error(
            "Choose an available product from the SaaSzo dashboard.",
          );
        setContext(c.data.data);
        setProduct(selected);
        const plans = selected.plans;
        setVersion(
          plans.some((plan) => plan.version_id === requestedVersion)
            ? requestedVersion
            : plans[0]?.version_id || 0,
        );
        const id = c.data.data.active_workspace?.id;
        if (id && c.data.data.capabilities.can_manage_billing) {
          const subscriptions = await fetchWorkspaceSubscriptions(id);
          if (cancelled || generation !== epoch.current) return;
          if (!subscriptions.ok || !subscriptions.data.success)
            throw new Error("Subscription status could not be verified.");
          setActive(
            subscriptions.data.data.some(
              (s) => s.product_key === productKey && s.is_active,
            ),
          );
          const pending = await fetchPendingCheckout(id, productKey);
          if (cancelled || generation !== epoch.current) return;
          if (!pending.ok || !pending.data.success)
            throw new Error("Could not verify pending payments.");
          if (pending.data.data) {
            setOrder(pending.data.data);
            if (pending.data.data.plan_version_id)
              setVersion(pending.data.data.plan_version_id);
          }
        }

        clearPurchaseReturn();
        setLoaded(true);
      })
      .catch((e) => {
        if (!cancelled && generation === epoch.current) {
          setError(e instanceof Error ? e.message : "Could not load checkout.");
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
      epoch.current++;
    };
  }, [
    authenticated,
    workspaceUser?.id,
    workspace,
    productKey,
    requestedVersion,
  ]);
  useEffect(() => {
    if (
      !order ||
      !context?.active_workspace ||
      !["created", "authorized", "processing", "unknown"].includes(order.status)
    )
      return;
    const generation = epoch.current;
    let attempts = 0;
    const id = context.active_workspace.id;
    const timer = setInterval(() => {
      if (++attempts > 60) {
        clearInterval(timer);
        return;
      }
      if (document.visibilityState === "visible")
        void refresh(id, order.order_id, generation);
    }, 5000);
    return () => clearInterval(timer);
  }, [order?.order_id, order?.status, context?.active_workspace?.id]);
  async function refresh(
    id: number,
    orderId: string,
    generation = epoch.current,
  ) {
    try {
      const response = await fetchCheckoutOrder(id, orderId);
      if (generation !== epoch.current || !session.current.authenticated)
        return;
      if (!response.ok || !response.data.success)
        throw new Error("Could not verify payment status.");
      setOrder(response.data.data);
      if (
        ["paid", "captured", "completed"].includes(response.data.data.status)
      ) {
        const [subs, access] = await Promise.all([
          fetchWorkspaceSubscriptions(id),
          fetchPlatformContext(id),
        ]);
        if (generation !== epoch.current) return;
        if (subs.ok && subs.data.success)
          setActive(
            subs.data.data.some(
              (s) => s.product_key === productKey && s.is_active,
            ),
          );
        if (access.ok && access.data.success) setContext(access.data.data);
      }
    } catch (e) {
      if (generation === epoch.current)
        setError(
          e instanceof Error ? e.message : "Please refresh payment status.",
        );
    }
  }
  async function review() {
    if (mutation.current || !context?.active_workspace) return;
    mutation.current = true;
    setBusy(true);
    setError("");
    const generation = epoch.current;
    try {
      const res = await createCheckoutQuote(context.active_workspace.id, {
        product_key: productKey,
        plan_version_id: version,
      });
      if (generation !== epoch.current) return;
      if (!res.ok || !res.data.success)
        throw new Error(res.data.message || "Could not prepare this plan.");
      setQuote(res.data.data);
      key.current = crypto.randomUUID();
    } catch (e) {
      if (generation === epoch.current)
        setError(e instanceof Error ? e.message : "Please retry.");
    } finally {
      if (generation === epoch.current) {
        mutation.current = false;
        setBusy(false);
      }
    }
  }
  async function pay() {
    if (mutation.current || !quote || !context?.active_workspace) return;
    mutation.current = true;
    setBusy(true);
    setError("");
    const generation = epoch.current;
    const id = context.active_workspace.id;
    try {
      const result = order
        ? { ok: true, data: { success: true, data: order } }
        : await createCheckoutOrder(id, {
            quote_id: quote.quote_id,
            idempotency_key: key.current || (key.current = crypto.randomUUID()),
          });
      if (generation !== epoch.current) return;
      if (!result.ok || !result.data.success) {
        const pending = await fetchPendingCheckout(id, productKey);
        if (
          generation === epoch.current &&
          pending.ok &&
          pending.data.success &&
          pending.data.data
        )
          setOrder(pending.data.data);
        throw new Error(
          "message" in result.data
            ? String(result.data.message)
            : "Payment is not ready.",
        );
      }
      const next = result.data.data;
      setOrder(next);
      sessionStorage.setItem(
        `saaszo.checkout:${workspaceUser?.id}:${id}:${productKey}`,
        next.order_id,
      );
      await openPlatformCheckout(
        next,
        () => {
          void refresh(id, next.order_id, generation);
        },
        () => generation === epoch.current && session.current.authenticated,
      );
    } catch (e) {
      if (generation === epoch.current)
        setError(e instanceof Error ? e.message : "Payment could not start.");
    } finally {
      if (generation === epoch.current) {
        mutation.current = false;
        setBusy(false);
      }
    }
  }
  async function open() {
    setBusy(true);
    setError("");
    const generation = epoch.current;
    const result = await getHandoffToken(productKey);
    if (generation !== epoch.current) return;
    if (result.redirectUrl) window.location.assign(result.redirectUrl);
    else {
      setError(result.error || "Could not open the app.");
      setBusy(false);
    }
  }
  const plan = product?.plans.find((p) => p.version_id === version);
  const selected = context?.products.find((p) => p.key === productKey);
  const development = Boolean(
    (context as (PlatformContext & { development_access?: boolean }) | null)
      ?.development_access,
  );
  return (
    <section className="mx-auto max-w-3xl space-y-6 p-4 sm:p-8">
      <Link href="/dashboard">← All SaaSzo products</Link>
      <h1 className="text-3xl font-bold">
        {product?.name || "Product subscription"}
      </h1>
      <p>One SaaSzo account. Confirm the workspace and plan before payment.</p>
      {error && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-800">
          {error}
        </p>
      )}
      {!loaded ? (
        <p role="status">Checking your workspace and subscription…</p>
      ) : (
        context &&
        product && (
          <>
            <label className="block">
              Workspace
              <select
                className="mt-2 block w-full rounded-lg border p-3"
                value={context.active_workspace?.id || ""}
                disabled={busy}
                onChange={(e) => setWorkspace(Number(e.target.value))}
              >
                {context.workspaces.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-sm">
              Role: {context.active_workspace?.role}. The subscription belongs
              to this workspace.
            </p>
            {!context.capabilities.can_manage_billing ? (
              <p>
                Your workspace owner or billing administrator can purchase this
                product.
              </p>
            ) : active ? (
              <div className="space-y-3 rounded-xl border p-5">
                <h2 className="font-bold">
                  You already have an active subscription
                </h2>
                <p>
                  No second purchase is needed. Review renewal or plan changes
                  in Billing.
                </p>
                <Link href="/dashboard/platform-products?tab=billing">
                  Manage subscription
                </Link>
                {selected?.access.allowed && (
                  <button
                    className="ml-4 rounded-lg bg-teal-700 px-4 py-2 text-white"
                    onClick={open}
                    disabled={busy}
                  >
                    Open app
                  </button>
                )}
              </div>
            ) : development && selected?.access.allowed ? (
              <div className="rounded-xl border p-5">
                <h2 className="font-bold">Development access is available</h2>
                <p>
                  You can explore this product without a payment during
                  development.
                </p>
                <button
                  className="mt-4 rounded-lg bg-teal-700 px-4 py-2 text-white"
                  onClick={open}
                  disabled={busy}
                >
                  Open app
                </button>
              </div>
            ) : !product.available ||
              !["business", "operations", "capability"].includes(
                product.kind,
              ) ? (
              <p>
                This product is not available for a workspace subscription.{" "}
                <a href={`https://${productKey}.saaszo.in/`}>
                  View product details
                </a>
                .
              </p>
            ) : !product.plans.length ? (
              <p>
                Pricing has not been published.{" "}
                <Link
                  href={`/contact?product=${encodeURIComponent(productKey)}`}
                >
                  Contact sales
                </Link>
                ; no payment has been taken.
              </p>
            ) : (
              <>
                <label className="block">
                  Plan
                  <select
                    className="mt-2 block w-full rounded-lg border p-3"
                    disabled={busy || Boolean(order)}
                    value={version}
                    onChange={(e) => {
                      setVersion(Number(e.target.value));
                      setQuote(null);
                      key.current = null;
                    }}
                  >
                    {product.plans.map((p) => (
                      <option key={p.version_id} value={p.version_id}>
                        {p.name} · {money(p.price_minor_units, p.currency)} /{" "}
                        {p.billing_cycle}
                      </option>
                    ))}
                  </select>
                </label>
                {plan && (
                  <div className="rounded-xl border p-5">
                    <h2 className="font-bold">{plan.name}</h2>
                    <p>{plan.billing_cycle} subscription</p>
                    <ul className="list-inside list-disc">
                      {plan.features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    {Object.entries(plan.limits).map(([name, limit]) => (
                      <p key={name}>
                        {name.replaceAll("_", " ")}:{" "}
                        {typeof limit === "object"
                          ? JSON.stringify(limit)
                          : String(limit)}
                      </p>
                    ))}
                  </div>
                )}
                {!quote && !order && (
                  <button
                    className="rounded-lg bg-teal-700 px-5 py-3 text-white"
                    disabled={busy || !version}
                    onClick={review}
                  >
                    Review total
                  </button>
                )}
                {quote && (
                  <div className="space-y-2 rounded-xl border p-5">
                    <p>
                      Subtotal: {money(quote.subtotal_minor, quote.currency)}
                    </p>
                    <p>Tax: {money(quote.tax_minor, quote.currency)}</p>
                    <p className="font-bold">
                      Total: {money(quote.total_minor, quote.currency)}
                    </p>
                    <p>Term: {quote.billing_cycle}</p>
                    <p className="text-sm">
                      Review the{" "}
                      <Link className="underline" href="/terms">
                        terms
                      </Link>{" "}
                      and{" "}
                      <Link className="underline" href="/refund">
                        cancellation/refund policy
                      </Link>
                      . Access activates after server verification.
                    </p>
                    {!order && (
                      <button
                        className="rounded-lg bg-teal-700 px-5 py-3 text-white"
                        disabled={
                          busy || Date.parse(quote.expires_at) <= Date.now()
                        }
                        onClick={pay}
                      >
                        Confirm & pay
                      </button>
                    )}
                  </div>
                )}
                {quote && !order && (
                  <button
                    disabled={busy}
                    className="underline"
                    onClick={review}
                  >
                    Review an updated total
                  </button>
                )}
                {order && (
                  <div
                    className="space-y-3 rounded-xl border p-5"
                    role="status"
                  >
                    <p>
                      Existing payment: {order.plan_name || product.name} ·{" "}
                      {money(order.amount_minor, order.currency)}
                      {order.billing_cycle ? ` / ${order.billing_cycle}` : ""}
                    </p>
                    <p>Payment status: {order.status}</p>
                    <button
                      disabled={busy}
                      onClick={() => {
                        if (context.active_workspace)
                          void refresh(
                            context.active_workspace.id,
                            order.order_id,
                          );
                      }}
                    >
                      Refresh payment status
                    </button>
                    {order.checkout_allowed && order.status === "created" && (
                      <button
                        className="ml-4"
                        disabled={busy}
                        onClick={async () => {
                          const generation = epoch.current;
                          try {
                            await openPlatformCheckout(
                              order,
                              () => {
                                if (context.active_workspace)
                                  void refresh(
                                    context.active_workspace.id,
                                    order.order_id,
                                    generation,
                                  );
                              },
                              () =>
                                generation === epoch.current &&
                                session.current.authenticated,
                            );
                          } catch (e) {
                            setError(
                              e instanceof Error
                                ? e.message
                                : "Could not reopen checkout.",
                            );
                          }
                        }}
                      >
                        Continue existing payment
                      </button>
                    )}
                    {!order.checkout_allowed && (
                      <p>
                        {order.checkout_reason}{" "}
                        <Link href="/contact" className="underline">
                          Contact support
                        </Link>{" "}
                        if the payment remains unresolved.
                      </p>
                    )}
                    <p>
                      Pending or interrupted payments reuse the existing order.
                    </p>
                  </div>
                )}
              </>
            )}
          </>
        )
      )}
    </section>
  );
}
