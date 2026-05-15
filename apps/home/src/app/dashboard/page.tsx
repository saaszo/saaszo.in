'use client';

import { startTransition, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/components/AuthProvider';

// ─── Product definitions ───────────────────────────────────────────────────
type ProductStatus = 'active' | 'coming_soon';

type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  tool: string;           // matches backend "tool" slug
  status: ProductStatus;
  color: string;          // CSS gradient
  badge?: string;
};

const PRODUCTS: Product[] = [
  {
    id: 'invoice',
    name: 'Invoice & Billing',
    tagline: 'GST Invoices · POS · Collections',
    description:
      'Create GST invoices, manage your POS, track receivables, run reports, and manage your full inventory from one place.',
    icon: 'receipt_long',
    tool: 'invoice',
    status: 'active',
    color: 'linear-gradient(135deg, #4648d4 0%, #7c3aed 100%)',
  },
  {
    id: 'accounting',
    name: 'Accounting',
    tagline: 'Ledgers · P&L · Balance Sheet',
    description:
      'Double-entry accounting with GST reports, bank reconciliation, opening balances, and full audit trail.',
    icon: 'account_balance',
    tool: 'accounting',
    status: 'coming_soon',
    badge: 'Coming Soon',
    color: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
  },
  {
    id: 'crm',
    name: 'CRM',
    tagline: 'Leads · Pipeline · Follow-ups',
    description:
      'Track your sales pipeline, manage leads, automate follow-ups, and close more deals faster.',
    icon: 'contacts',
    tool: 'crm',
    status: 'coming_soon',
    badge: 'Coming Soon',
    color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  {
    id: 'hrms',
    name: 'HRMS & Payroll',
    tagline: 'Attendance · Payroll · Staff',
    description:
      'Manage your team — mark attendance, run payroll, track leaves, and generate payslips.',
    icon: 'badge',
    tool: 'hrms',
    status: 'coming_soon',
    badge: 'Coming Soon',
    color: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
];

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
    signOut,
    subscription,
    updatePassword,
    updateProfile,
    getHandoffToken,
  } = useAuthSession();

  const [formValues, setFormValues] = useState({
    fullName: '',
    companyName: '',
    phone: '',
    avatarUrl: '',
  });
  const [profileNotice, setProfileNotice] = useState('');
  const [passwordNotice, setPasswordNotice] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordValues, setPasswordValues] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [launchingTool, setLaunchingTool] = useState<string | null>(null);
  const [launchError, setLaunchError] = useState('');

  useEffect(() => {
    if (!loading && !authenticated) {
      startTransition(() => {
        router.replace('/auth');
      });
    }
  }, [authenticated, loading, router]);

  useEffect(() => {
    if (!loading && authenticated && postAuthRedirect?.includes('/dashboard/setup')) {
      startTransition(() => {
        router.replace('/dashboard/setup');
      });
    }
  }, [authenticated, loading, onboarding, postAuthRedirect, router]);

  useEffect(() => {
    if (!profile) return;
    setFormValues({
      fullName: profile.fullName ?? '',
      companyName: profile.companyName ?? '',
      phone: profile.phone ?? '',
      avatarUrl: profile.avatarUrl ?? '',
    });
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-on-surface flex items-center justify-center px-6">
        <div className="rounded-3xl border border-outline-variant/30 bg-surface-container-lowest px-8 py-6 shadow-[0_24px_80px_rgba(25,28,30,0.10)]">
          <p className="text-lg font-semibold">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!authenticated || !profile || !auth || !subscription) {
    return null;
  }

  async function handleLaunchProduct(product: Product) {
    if (product.status !== 'active') return;
    setLaunchingTool(product.tool);
    setLaunchError('');

    const { redirectUrl, error: handoffError } = await getHandoffToken(product.tool);

    if (handoffError || !redirectUrl) {
      setLaunchError(handoffError ?? 'Could not launch product. Please try again.');
      setLaunchingTool(null);
      return;
    }

    const newWin = window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    if (!newWin) {
      setLaunchError('Popup blocked. Please allow popups for SaaSzo and try again.');
      setLaunchingTool(null);
    }
  }

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProfile(true);
    setProfileNotice('');
    const result = await updateProfile(formValues);
    setProfileNotice(result.error ? result.error : 'Profile saved successfully.');
    setIsSavingProfile(false);
  }

  async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPasswordNotice('');
    if (passwordValues.newPassword.length < 8) {
      setPasswordNotice('Password must be at least 8 characters.');
      return;
    }
    if (passwordValues.newPassword !== passwordValues.confirmPassword) {
      setPasswordNotice('Passwords do not match.');
      return;
    }
    setIsSavingPassword(true);
    const result = await updatePassword(passwordValues.newPassword);
    setPasswordNotice(result.error ? result.error : 'Password updated successfully.');
    if (!result.error) {
      setPasswordValues({ newPassword: '', confirmPassword: '' });
    }
    setIsSavingPassword(false);
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-outline-variant/20 bg-surface-container-lowest">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-8rem] left-[-5rem] h-80 w-80 rounded-full bg-primary/15 blur-[110px]" />
          <div className="absolute right-[-4rem] top-8 h-72 w-72 rounded-full bg-tertiary/15 blur-[110px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-10 lg:py-14 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              SaaSzo Platform
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Welcome back{profile.fullName ? `, ${profile.fullName.split(' ')[0]}` : ''}.
            </h1>
            <p className="mt-4 max-w-2xl text-on-surface-variant text-lg leading-relaxed">
              Your business suite — one account, every product, all your data in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/billing"
              className="px-5 py-3 rounded-xl border border-outline-variant/40 bg-surface-container hover:bg-surface-container-high transition-colors font-semibold"
            >
              Billing
            </Link>
            <button
              onClick={() => { void signOut(); }}
              className="px-5 py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)' }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* ── Stat Row ─────────────────────────────────────────────────── */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            label="Sign-in Method"
            value={auth.primaryProvider}
            hint={auth.providers.join(', ')}
            icon="verified_user"
          />
          <StatCard
            label="Profile Status"
            value={profile.profileCompleted ? 'Complete' : 'Needs details'}
            hint={profile.profileCompleted ? 'Ready to use' : 'Add details below'}
            icon="badge"
          />
          <StatCard
            label="Subscription"
            value={subscription.planName}
            hint={`${subscription.status} • ${subscription.billingCycle}`}
            icon="workspace_premium"
          />
        </div>

        {/* ── Product Hub ──────────────────────────────────────────────── */}
        <section>
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-1">
              Your Products
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              Open a product to get started
            </h2>
            <p className="text-on-surface-variant mt-1 text-sm">
              All products share your account, data, and subscription. No separate signup needed.
            </p>
          </div>

          {launchError && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-error/20 bg-error-container/60 px-5 py-4 text-sm text-on-error-container">
              <span className="material-symbols-outlined text-error">error</span>
              <span>{launchError}</span>
              <button
                className="ml-auto text-xs underline"
                onClick={() => setLaunchError('')}
              >
                Dismiss
              </button>
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isLaunching={launchingTool === product.tool}
                onLaunch={handleLaunchProduct}
              />
            ))}
          </div>
        </section>

        {/* ── Account + Security grid ──────────────────────────────────── */}
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">

          {/* Left — profile edit */}
          <section className="space-y-8">
            <div
              id="account-details"
              className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8 shadow-[0_16px_48px_rgba(25,28,30,0.08)]"
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <div>
                  <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Profile</p>
                  <h2 className="text-2xl font-bold tracking-tight">Account details</h2>
                  <p className="text-on-surface-variant mt-2">Save the data attached to your profile.</p>
                </div>
                <div className="rounded-2xl bg-primary-container/40 px-4 py-3 text-sm font-medium text-on-primary-container">
                  {profile.email || profile.phone || 'No contact attached'}
                </div>
              </div>

              <form className="grid gap-5 md:grid-cols-2" onSubmit={handleProfileSubmit}>
                <Field label="Full name" value={formValues.fullName} onChange={(v) => setFormValues((c) => ({ ...c, fullName: v }))} placeholder="Your full name" />
                <Field label="Company name" value={formValues.companyName} onChange={(v) => setFormValues((c) => ({ ...c, companyName: v }))} placeholder="Your company" />
                <Field label="Phone" value={formValues.phone} onChange={(v) => setFormValues((c) => ({ ...c, phone: v }))} placeholder="+91 98765 43210" />
                <Field label="Avatar URL" value={formValues.avatarUrl} onChange={(v) => setFormValues((c) => ({ ...c, avatarUrl: v }))} placeholder="https://..." />

                <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                  <ReadOnlyCard label="Email" value={profile.email || 'Not connected'} />
                  <ReadOnlyCard label="Primary login" value={`${auth.primaryProvider}${auth.canChangePassword ? ' • password enabled' : ''}`} />
                </div>

                {profileNotice && (
                  <p className="md:col-span-2 text-sm font-medium text-primary">{profileNotice}</p>
                )}

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-70"
                    style={{ background: 'linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)' }}
                  >
                    {isSavingProfile ? 'Saving...' : 'Save profile'}
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Right — security + billing */}
          <section className="space-y-8">
            <div
              id="security-controls"
              className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8 shadow-[0_16px_48px_rgba(25,28,30,0.08)]"
            >
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Password</p>
              <h2 className="text-2xl font-bold tracking-tight">Security controls</h2>
              <p className="text-on-surface-variant mt-2 mb-6">
                {auth.canChangePassword
                  ? 'Update the password for your email-based account here.'
                  : 'This account uses phone or social sign-in. Password changes are not required.'}
              </p>

              {auth.canChangePassword ? (
                <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                  <Field label="New password" type="password" value={passwordValues.newPassword} onChange={(v) => setPasswordValues((c) => ({ ...c, newPassword: v }))} placeholder="Minimum 8 characters" />
                  <Field label="Confirm password" type="password" value={passwordValues.confirmPassword} onChange={(v) => setPasswordValues((c) => ({ ...c, confirmPassword: v }))} placeholder="Repeat your new password" />
                  {passwordNotice && <p className="text-sm font-medium text-primary">{passwordNotice}</p>}
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="w-full px-6 py-3 rounded-xl border border-outline-variant/40 bg-surface-container hover:bg-surface-container-high transition-colors font-semibold disabled:opacity-70"
                  >
                    {isSavingPassword ? 'Updating...' : 'Update password'}
                  </button>
                </form>
              ) : (
                <div className="rounded-2xl bg-surface-container p-5 border border-outline-variant/20">
                  <p className="font-semibold text-on-surface">Password changes not required</p>
                  <p className="text-sm text-on-surface-variant mt-2">
                    Use your {auth.primaryProvider} sign-in flow, or the reset link from the login page.
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8 shadow-[0_16px_48px_rgba(25,28,30,0.08)]">
              <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">Subscription</p>
              <h2 className="text-2xl font-bold tracking-tight">Billing snapshot</h2>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ReadOnlyCard label="Plan" value={subscription.planName} />
                <ReadOnlyCard label="Status" value={subscription.status} />
                <ReadOnlyCard label="Billing cycle" value={subscription.billingCycle} />
                <ReadOnlyCard label="Seats" value={`${subscription.seats}`} />
              </div>
              <p className="text-sm text-on-surface-variant mt-6">
                {subscription.currentPeriodEnd
                  ? `Current period ends on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}.`
                  : 'No renewal date attached yet — expected for new trial accounts.'}
              </p>
              <div className="mt-4">
                <Link
                  href="/dashboard/billing"
                  className="text-sm font-semibold text-primary hover:text-tertiary transition-colors"
                >
                  View full billing details →
                </Link>
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-error/20 bg-error-container/70 px-5 py-4 text-on-error-container">
                {error}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function ProductCard({
  product,
  isLaunching,
  onLaunch,
}: {
  product: Product;
  isLaunching: boolean;
  onLaunch: (p: Product) => void;
}) {
  const isActive = product.status === 'active';

  return (
    <div
      className={`relative flex flex-col rounded-3xl border bg-surface-container-lowest p-6 shadow-[0_12px_32px_rgba(25,28,30,0.07)] transition-all duration-200 ${
        isActive
          ? 'border-outline-variant/20 hover:border-primary/30 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(25,28,30,0.12)]'
          : 'border-outline-variant/10 opacity-70'
      }`}
    >
      {/* Badge */}
      {product.badge && (
        <span className="absolute top-4 right-4 rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface-variant border border-outline-variant/30">
          {product.badge}
        </span>
      )}

      {/* Icon */}
      <div
        className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg"
        style={{ background: product.color }}
      >
        <span className="material-symbols-outlined text-3xl">{product.icon}</span>
      </div>

      {/* Info */}
      <p className="text-lg font-bold text-on-surface">{product.name}</p>
      <p className="mt-1 text-xs font-semibold text-primary tracking-wide">{product.tagline}</p>
      <p className="mt-3 text-sm text-on-surface-variant leading-relaxed flex-1">
        {product.description}
      </p>

      {/* Action */}
      <div className="mt-6">
        {isActive ? (
          <button
            id={`launch-${product.id}`}
            onClick={() => onLaunch(product)}
            disabled={isLaunching}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-opacity hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: product.color }}
          >
            {isLaunching ? (
              <>
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Opening…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">open_in_new</span>
                Open App
              </>
            )}
          </button>
        ) : (
          <div className="w-full py-3 rounded-xl text-center text-sm font-semibold text-on-surface-variant bg-surface-container border border-outline-variant/20">
            Coming Soon
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, hint, label, value }: { icon: string; hint: string; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-[0_12px_32px_rgba(25,28,30,0.06)]">
      <div className="w-11 h-11 rounded-2xl bg-primary-container/40 text-on-primary-container flex items-center justify-center mb-4">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-2">{label}</p>
      <p className="text-xl font-bold text-on-surface">{value}</p>
      <p className="text-sm text-on-surface-variant mt-2">{hint}</p>
    </div>
  );
}

function Field({
  label, onChange, placeholder, type = 'text', value,
}: {
  label: string; onChange: (value: string) => void; placeholder: string; type?: string; value: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-on-surface">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-outline-variant/30 bg-surface px-4 py-3 outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-container)] transition-all"
      />
    </label>
  );
}

function ReadOnlyCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container px-4 py-3">
      <p className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-2">{label}</p>
      <p className="font-semibold text-on-surface">{value}</p>
    </div>
  );
}
