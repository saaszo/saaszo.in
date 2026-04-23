'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApiConnectionStatus from '@/components/ApiConnectionStatus';
import { supabase } from '@/lib/supabase-browser';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
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

    if (queryEmail) {
      setEmail(queryEmail);
      setNotice(
        `We sent a verification email to ${queryEmail}. Enter the 6-digit code if your inbox shows one, or open the confirmation link from the email to finish setup.`,
      );
      setResendCooldown(60);
    }
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError('');
    setNotice('');

    try {
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: token.trim(),
        type: 'signup',
      });

      if (verifyError) {
        throw verifyError;
      }

      setIsSuccess(true);
      setNotice('Email verified successfully. Redirecting to your workspace...');

      const activeSession =
        data.session ?? (await supabase.auth.getSession()).data.session;

      if (activeSession) {
        setTimeout(() => router.replace('/dashboard'), 1200);
        return;
      }

      router.replace('/auth');
    } catch (verificationError: any) {
      setError(
        verificationError?.message ||
          'Could not verify that code. Please try again.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleResend() {
    if (isLoading || !email.trim() || resendCooldown > 0) {
      return;
    }

    setIsLoading(true);
    setError('');
    setNotice('');

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        },
      });

      if (resendError) {
        throw resendError;
      }

      setNotice(
        `A fresh verification email was sent to ${email.trim()}. Use the 6-digit code if one is included, or open the confirmation link from the email.`,
      );
      setResendCooldown(60);
    } catch (resendFailure: any) {
      const resendMessage =
        resendFailure?.message || 'We could not resend your verification email right now.';

      if (/second|wait|rate limit|too many/i.test(resendMessage)) {
        setResendCooldown(60);
        setError(
          'Please wait about a minute before requesting another verification email.',
        );
        return;
      }

      setError(
        resendMessage,
      );
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
              Use the verification code from your inbox, or open the confirmation link from the email, to activate your SaaSzo account.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex gap-4 items-start group">
            <div className="p-3 rounded-2xl bg-primary-container text-on-primary-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110">
              <span className="material-symbols-outlined text-2xl">mark_email_read</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Official inbox delivery</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Your verification email is ready to work with your configured production SMTP sender.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start group">
            <div className="p-3 rounded-2xl bg-tertiary-container text-on-tertiary-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110">
              <span className="material-symbols-outlined text-2xl">password</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Code or secure link</h3>
              <p className="text-on-surface-variant leading-relaxed">
                If your email includes a 6-digit code, enter it here. If it includes a confirmation link, open that link and we will finish the verification automatically.
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
              Enter the verification code from your inbox if your email includes one, or open the confirmation link from the same email.
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

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest outline-none border border-transparent focus:border-primary transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_var(--color-primary-container)] placeholder-outline"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  disabled={isSuccess}
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">password</span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="6-digit code (if provided)"
                  maxLength={6}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest outline-none border border-transparent focus:border-primary transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_var(--color-primary-container)] placeholder-outline tracking-[0.35em]"
                  value={token}
                  onChange={(event) =>
                    setToken(event.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  required
                  disabled={isSuccess}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || token.length !== 6 || !email.trim()}
              className={`mt-4 relative w-full py-4 rounded-xl bg-primary text-on-primary font-semibold text-lg overflow-hidden group transition-all duration-300 ${
                isLoading || token.length !== 6 || !email.trim()
                  ? 'opacity-70 cursor-not-allowed'
                  : 'shadow-lg shadow-primary/20 hover:shadow-primary/40'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? 'Verifying...' : 'Verify Email'}
                {!isLoading && (
                  <span className="material-symbols-outlined">verified</span>
                )}
              </span>
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-on-surface-variant leading-relaxed">
            Seeing a &quot;Confirm your mail&quot; button in the email instead of a 6-digit code? Open that link in this browser and SaaSzo will complete the verification automatically.
          </p>

          <div className="mt-6 flex flex-col gap-3 text-center">
            <button
              type="button"
              onClick={() => {
                void handleResend();
              }}
              disabled={isLoading || !email.trim() || resendCooldown > 0}
              className="font-semibold text-primary hover:text-tertiary transition-colors disabled:opacity-60"
            >
              {resendCooldown > 0
                ? `Resend verification email in ${resendCooldown}s`
                : 'Resend verification email'}
            </button>

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
