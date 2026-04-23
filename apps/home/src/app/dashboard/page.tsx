'use client';

import { startTransition, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '@/components/AuthProvider';

export default function DashboardPage() {
  const router = useRouter();
  const {
    auth,
    authenticated,
    error,
    loading,
    profile,
    signOut,
    subscription,
    updatePassword,
    updateProfile,
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

  useEffect(() => {
    if (!loading && !authenticated) {
      startTransition(() => {
        router.replace('/auth');
      });
    }
  }, [authenticated, loading, router]);

  useEffect(() => {
    if (!profile) {
      return;
    }

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

  async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSavingProfile(true);
    setProfileNotice('');

    const result = await updateProfile(formValues);

    setProfileNotice(
      result.error ? result.error : 'Profile saved successfully.',
    );
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
    setPasswordNotice(
      result.error ? result.error : 'Password updated successfully.',
    );

    if (!result.error) {
      setPasswordValues({
        newPassword: '',
        confirmPassword: '',
      });
    }

    setIsSavingPassword(false);
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <div className="relative overflow-hidden border-b border-outline-variant/20 bg-surface-container-lowest">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-8rem] left-[-5rem] h-80 w-80 rounded-full bg-primary/15 blur-[110px]" />
          <div className="absolute right-[-4rem] top-8 h-72 w-72 rounded-full bg-tertiary/15 blur-[110px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-10 lg:py-14 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
              Workspace Dashboard
            </p>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Welcome back{profile.fullName ? `, ${profile.fullName}` : ''}.
            </h1>
            <p className="mt-4 max-w-2xl text-on-surface-variant text-lg leading-relaxed">
              Your account, login methods, password controls, and subscription
              details now live here in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/billing"
              className="px-5 py-3 rounded-xl border border-outline-variant/40 bg-surface-container hover:bg-surface-container-high transition-colors font-semibold"
            >
              View Billing
            </Link>
            <button
              onClick={() => {
                void signOut();
              }}
              className="px-5 py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90"
              style={{
                background:
                  'linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-8">
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
              hint={profile.profileCompleted ? 'Ready to use' : 'Add a few fields below'}
              icon="badge"
            />
            <StatCard
              label="Subscription"
              value={subscription.planName}
              hint={`${subscription.status} • ${subscription.billingCycle}`}
              icon="workspace_premium"
            />
          </div>

          <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8 shadow-[0_16px_48px_rgba(25,28,30,0.08)]">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
              Workspace Apps
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              Your ready-to-use modules
            </h2>
            <p className="text-on-surface-variant mt-2">
              Every newly authenticated account lands on a trial workspace with these active sections.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <WorkspaceAppCard
                href="#account-details"
                icon="badge"
                title="Account Center"
                description="Manage your profile, contact details, and account identity."
              />
              <WorkspaceAppCard
                href="#security-controls"
                icon="shield_lock"
                title="Security"
                description="Review your sign-in method, password controls, and recovery status."
              />
              <WorkspaceAppCard
                href="/dashboard/billing"
                icon="credit_card"
                title="Billing"
                description="Open your Free Trial plan details and billing snapshot."
              />
            </div>
          </div>

          <div
            id="account-details"
            className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8 shadow-[0_16px_48px_rgba(25,28,30,0.08)]"
          >
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
                  Profile
                </p>
                <h2 className="text-2xl font-bold tracking-tight">
                  Account details
                </h2>
                <p className="text-on-surface-variant mt-2">
                  Save the data you want attached to this user profile.
                </p>
              </div>
              <div className="rounded-2xl bg-primary-container/40 px-4 py-3 text-sm font-medium text-on-primary-container">
                {profile.email || profile.phone || 'No contact attached'}
              </div>
            </div>

            <form className="grid gap-5 md:grid-cols-2" onSubmit={handleProfileSubmit}>
              <Field
                label="Full name"
                value={formValues.fullName}
                onChange={(value) =>
                  setFormValues((current) => ({ ...current, fullName: value }))
                }
                placeholder="Your full name"
              />
              <Field
                label="Company name"
                value={formValues.companyName}
                onChange={(value) =>
                  setFormValues((current) => ({
                    ...current,
                    companyName: value,
                  }))
                }
                placeholder="Your company"
              />
              <Field
                label="Phone"
                value={formValues.phone}
                onChange={(value) =>
                  setFormValues((current) => ({ ...current, phone: value }))
                }
                placeholder="+91 98765 43210"
              />
              <Field
                label="Avatar URL"
                value={formValues.avatarUrl}
                onChange={(value) =>
                  setFormValues((current) => ({ ...current, avatarUrl: value }))
                }
                placeholder="https://..."
              />

              <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                <ReadOnlyCard label="Email" value={profile.email || 'Not connected'} />
                <ReadOnlyCard
                  label="Primary login"
                  value={`${auth.primaryProvider}${auth.canChangePassword ? ' • password enabled' : ''}`}
                />
              </div>

              {profileNotice && (
                <p className="md:col-span-2 text-sm font-medium text-primary">
                  {profileNotice}
                </p>
              )}

              <div className="md:col-span-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-6 py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-70"
                  style={{
                    background:
                      'linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)',
                  }}
                >
                  {isSavingProfile ? 'Saving...' : 'Save profile'}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="space-y-8">
          <div
            id="security-controls"
            className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8 shadow-[0_16px_48px_rgba(25,28,30,0.08)]"
          >
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
              Password
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              Security controls
            </h2>
            <p className="text-on-surface-variant mt-2 mb-6">
              {auth.canChangePassword
                ? 'Update the password for your email-based account here.'
                : 'This account is using phone or social sign-in. Password changes are not required for this login method.'}
            </p>

            {auth.canChangePassword ? (
              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <Field
                  label="New password"
                  type="password"
                  value={passwordValues.newPassword}
                  onChange={(value) =>
                    setPasswordValues((current) => ({
                      ...current,
                      newPassword: value,
                    }))
                  }
                  placeholder="Minimum 8 characters"
                />
                <Field
                  label="Confirm password"
                  type="password"
                  value={passwordValues.confirmPassword}
                  onChange={(value) =>
                    setPasswordValues((current) => ({
                      ...current,
                      confirmPassword: value,
                    }))
                  }
                  placeholder="Repeat your new password"
                />
                {passwordNotice && (
                  <p className="text-sm font-medium text-primary">
                    {passwordNotice}
                  </p>
                )}
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
                <p className="font-semibold text-on-surface">
                  Password changes not required
                </p>
                <p className="text-sm text-on-surface-variant mt-2">
                  Use your {auth.primaryProvider} sign-in flow, or the reset
                  link from the login page if you later add email access.
                </p>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-outline-variant/20 bg-surface-container-lowest p-6 md:p-8 shadow-[0_16px_48px_rgba(25,28,30,0.08)]">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-2">
              Subscription
            </p>
            <h2 className="text-2xl font-bold tracking-tight">
              Billing snapshot
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <ReadOnlyCard label="Plan" value={subscription.planName} />
              <ReadOnlyCard label="Status" value={subscription.status} />
              <ReadOnlyCard label="Billing cycle" value={subscription.billingCycle} />
              <ReadOnlyCard label="Seats" value={`${subscription.seats}`} />
            </div>
            <p className="text-sm text-on-surface-variant mt-6">
              {subscription.currentPeriodEnd
                ? `Current period ends on ${new Date(subscription.currentPeriodEnd).toLocaleDateString()}.`
                : 'No renewal date has been attached yet. This is expected for a new trial profile.'}
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-error/20 bg-error-container/70 px-5 py-4 text-on-error-container">
              {error}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  hint,
  label,
  value,
}: {
  icon: string;
  hint: string;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-[0_12px_32px_rgba(25,28,30,0.06)]">
      <div className="w-11 h-11 rounded-2xl bg-primary-container/40 text-on-primary-container flex items-center justify-center mb-4">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-2">
        {label}
      </p>
      <p className="text-xl font-bold text-on-surface">{value}</p>
      <p className="text-sm text-on-surface-variant mt-2">{hint}</p>
    </div>
  );
}

function Field({
  label,
  onChange,
  placeholder,
  type = 'text',
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
      <p className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-2">
        {label}
      </p>
      <p className="font-semibold text-on-surface">{value}</p>
    </div>
  );
}

function WorkspaceAppCard({
  description,
  href,
  icon,
  title,
}: {
  description: string;
  href: string;
  icon: string;
  title: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-outline-variant/20 bg-surface-container px-5 py-5 transition-all hover:border-primary/30 hover:bg-surface-container-high hover:-translate-y-0.5"
    >
      <div className="w-11 h-11 rounded-2xl bg-primary-container/40 text-on-primary-container flex items-center justify-center mb-4">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <p className="text-lg font-bold text-on-surface">{title}</p>
      <p className="text-sm text-on-surface-variant mt-2">{description}</p>
    </Link>
  );
}
