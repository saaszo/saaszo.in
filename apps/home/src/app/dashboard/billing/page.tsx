'use client';

import Link from 'next/link';
import { useAuthSession } from '@/components/AuthProvider';

export default function BillingPage() {
  const { authenticated, loading, subscription } = useAuthSession();

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center px-6">
        <p className="text-lg font-semibold">Loading billing...</p>
      </div>
    );
  }

  if (!authenticated || !subscription) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-primary font-semibold hover:text-tertiary transition-colors"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to dashboard
        </Link>

        <div className="mt-6 rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-8 shadow-[0_20px_60px_rgba(25,28,30,0.08)]">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
            Billing
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Subscription details
          </h1>
          <p className="text-on-surface-variant mt-3">
            Your current plan is saved in the database and shown below.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <BillingCard label="Plan" value={subscription.planName} />
            <BillingCard label="Status" value={subscription.status} />
            <BillingCard label="Billing cycle" value={subscription.billingCycle} />
            <BillingCard label="Seats" value={`${subscription.seats}`} />
          </div>

          <div className="mt-6 rounded-2xl bg-surface-container p-5 border border-outline-variant/20">
            <p className="text-sm text-on-surface-variant">
              {subscription.currentPeriodEnd
                ? `Your renewal date is ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}.`
                : 'This account is currently on a default trial subscription without a renewal date.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container px-5 py-4">
      <p className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-2">
        {label}
      </p>
      <p className="text-lg font-bold text-on-surface">{value}</p>
    </div>
  );
}
