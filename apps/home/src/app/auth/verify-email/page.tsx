'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiConnectionStatus from '@/components/ApiConnectionStatus';
import { useAuthSession } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { applyActionCode, sendEmailVerification } from 'firebase/auth';

function buildVerificationActionSettings() {
  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://saaszo.in';

  return {
    url: `${origin}/auth/verify-email`,
    handleCodeInApp: false,
  };
}

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, reloadUser } = useAuthSession();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const queryEmail = params.get('email');
    const mode = params.get('mode');
    const actionCode = params.get('oobCode');

    if (mode === 'verifyEmail' && actionCode && auth) {
      void applyActionCode(auth, actionCode)
        .then(async () => {
          await reloadUser();
          setIsSuccess(true);
          setNotice('Your email has been verified. Redirecting to dashboard...');
          setTimeout(() => router.replace('/dashboard'), 1500);
        })
        .catch(() => {
          setError(
            'This verification link is invalid or has expired. Please request a new one.',
          );
        });
      return;
    }

    if (queryEmail) {
      setEmail(queryEmail);
      setNotice(
        `We sent a verification link to ${queryEmail}. Please check your inbox (and spam folder) to activate your account.`,
      );
      setResendCooldown(60);
    } else if (auth?.currentUser?.email) {
      setEmail(auth.currentUser.email);
    } else if (user?.email) {
      setEmail(user.email);
    }
  }, [reloadUser, router, user]);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  // Periodically check verification status if user is logged in
  useEffect(() => {
    if (!auth?.currentUser || auth.currentUser.emailVerified) return;

    const interval = setInterval(async () => {
      await auth?.currentUser?.reload();
      if (auth?.currentUser?.emailVerified) {
        setIsSuccess(true);
        setNotice('Email verified! Redirecting to dashboard...');
        setTimeout(() => router.replace('/dashboard'), 2000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  async function handleCheckVerification() {
    setIsLoading(true);
    setError('');
    
    try {
      await reloadUser();
      if (auth?.currentUser?.emailVerified) {
        setIsSuccess(true);
        setNotice('Email verified! Redirecting to dashboard...');
        setTimeout(() => router.replace('/dashboard'), 1500);
      } else {
        setError('Email is not verified yet. Please check your inbox and click the link.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check verification status.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (isLoading || !auth?.currentUser || resendCooldown > 0) {
      return;
    }

    setIsLoading(true);
    setError('');
    setNotice('');

    try {
      await sendEmailVerification(
        auth.currentUser,
        buildVerificationActionSettings(),
      );
      setNotice(
        `A fresh verification link was sent to ${auth.currentUser.email}. Please check your inbox.`,
      );
      setResendCooldown(60);
    } catch (resendFailure: any) {
      setError(resendFailure?.message || 'We could not resend your verification email right now.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-background text-on-background overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-secondary rounded-full mix-blend-overlay filter blur-[100px] opacity-40 animate-float" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_10%,transparent_100%)]" />
        </div>

        <div className="relative z-10 animate-fade-up">
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-[0_0_20px_var(--color-primary)]">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight">SaaSzo</span>
          </div>

          <div className="max-w-xl">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-tertiary to-secondary">
              Confirm your workspace email.
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              Open the confirmation link we sent to your email to activate your SaaSzo account and start building.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex gap-4 items-start group">
            <div className="p-3 rounded-2xl bg-primary-container text-on-primary-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110">
              <span className="material-symbols-outlined text-2xl">mark_email_read</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Secure Link Verification</h3>
              <p className="text-on-surface-variant leading-relaxed">
                We use secure, single-use links to verify your identity and protect your workspace.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start group">
            <div className="p-3 rounded-2xl bg-tertiary-container text-on-tertiary-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110">
              <span className="material-symbols-outlined text-2xl">auto_mode</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Automatic Detection</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Once you click the link in your email, this page will automatically update and take you to your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute inset-0 bg-surface pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-fade-up pt-8 lg:pt-0" style={{ animationDelay: '0.3s' }}>
          <div className="flex lg:hidden items-center gap-2 mb-12 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-[0_0_20px_var(--color-primary)]">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight">SaaSzo</span>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">
              Verify your email
            </h2>
            <p className="text-on-surface-variant">
              We&apos;ve sent a verification link to <strong>{email || 'your email'}</strong>. Click it to continue.
            </p>
          </div>

          {notice && (
            <div className="mb-6 p-4 rounded-xl bg-primary-container/40 text-on-primary-container border border-primary/15 flex gap-3 items-start animate-fade-up">
              <span className="material-symbols-outlined text-primary shrink-0 mt-0.5">info</span>
              <p className="text-sm font-medium">{notice}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container border border-error/20 flex gap-3 items-start animate-fade-up">
              <span className="material-symbols-outlined text-error shrink-0 mt-0.5">error</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <button
              onClick={handleCheckVerification}
              disabled={isLoading || isSuccess}
              className={`relative w-full py-4 rounded-xl bg-primary text-on-primary font-semibold text-lg overflow-hidden group transition-all duration-300 ${
                isLoading || isSuccess
                  ? 'opacity-70 cursor-not-allowed'
                  : 'shadow-lg shadow-primary/20 hover:shadow-primary/40'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? 'Checking...' : 'I&apos;ve verified my email'}
                {!isLoading && (
                  <span className="material-symbols-outlined">verified</span>
                )}
              </span>
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={isLoading || isSuccess || resendCooldown > 0}
              className="w-full py-4 rounded-xl border border-outline-variant hover:bg-surface-container transition-all duration-300 font-semibold text-on-surface flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined">send</span>
              {resendCooldown > 0
                ? `Resend link in ${resendCooldown}s`
                : 'Resend verification link'}
            </button>
          </div>

          <div className="mt-8 flex flex-col gap-3 text-center">
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-2 font-semibold text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
      <ApiConnectionStatus />
    </div>
  );
}
