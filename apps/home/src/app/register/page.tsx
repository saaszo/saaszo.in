'use client';
import React, { useEffect, useMemo, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuthSession } from '@/components/AuthProvider';
import { API_BASE_URL } from '@/lib/app-config';

function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return null;
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function passwordMeetsRequirements(password: string) {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function isTooManyAttemptsMessage(message: string) {
  return /too many|wait \d+ seconds|attempts/i.test(message);
}

async function fetchWithCsrf(path: string, init: RequestInit = {}) {
  const method = init.method?.toUpperCase() || 'GET';
  const isMutation = !['GET', 'HEAD', 'OPTIONS'].includes(method);

  if (isMutation && !getCookie('XSRF-TOKEN')) {
    await fetch(`${API_BASE_URL.replace('/api', '')}/sanctum/csrf-cookie`, {
      method: 'GET',
      credentials: 'include',
    }).catch(() => null);
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> ?? {}),
  };

  const xsrfToken = getCookie('XSRF-TOKEN');
  if (xsrfToken && isMutation) {
    headers['X-XSRF-TOKEN'] = xsrfToken;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok && payload?.message) {
    throw Object.assign(new Error(payload.message), {
      status: response.status,
      payload,
    });
  }

  return payload;
}

function RegisterForm() {
  const searchParams = useSearchParams();
  const { signInWithGoogle, signUpWithEmail } = useAuthSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpNotice, setOtpNotice] = useState('');
  const [acceptedLegal, setAcceptedLegal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpLockSeconds, setOtpLockSeconds] = useState(0);
  const [resendTimer, setResendTimer] = useState(0);

  const normalizedEmail = useMemo(() => normalizeEmail(email), [email]);

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  useEffect(() => {
    if (otpLockSeconds <= 0 && resendTimer <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setOtpLockSeconds((current) => Math.max(current - 1, 0));
      setResendTimer((current) => Math.max(current - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [otpLockSeconds, resendTimer]);

  useEffect(() => {
    if (otpLockSeconds === 0 && isTooManyAttemptsMessage(otpError)) {
      setOtpError('');
    }
  }, [otpError, otpLockSeconds]);

  useEffect(() => {
    setOtp('');
    setOtpSent(false);
    setEmailVerified(false);
    setOtpError('');
    setOtpNotice('');
    setOtpLockSeconds(0);
    setResendTimer(0);
  }, [normalizedEmail]);

  const handleSendOtp = async () => {
    if (otpLoading || verifyLoading) return;
    setOtpLoading(true);
    setOtpError('');
    setOtpNotice('');

    try {
      if (!normalizedEmail) {
        throw new Error('Enter your email address first.');
      }

      const result = await fetchWithCsrf('/auth/signup/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!result?.success) {
        throw new Error(result?.message || 'We could not send the verification code.');
      }

      setOtpSent(true);
      setEmailVerified(false);
      setOtp('');
      setOtpLockSeconds(0);
      setResendTimer(60);
      setOtpNotice(result.message || `A verification code has been sent to ${normalizedEmail}.`);
    } catch (err: any) {
      const payload = err?.payload;
      const seconds = Number(payload?.seconds_remaining ?? 0);
      if (err?.status === 423 && seconds > 0) {
        setOtpLockSeconds(seconds);
        setResendTimer(seconds);
      }
      setOtpError(err?.message || 'We could not send the verification code.');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (verifyLoading || otpLockSeconds > 0) return;
    setVerifyLoading(true);
    setOtpError('');
    setOtpNotice('');

    try {
      if (!otpSent) {
        throw new Error('Send the verification code first.');
      }

      if (otp.trim().length !== 4) {
        throw new Error('Enter the 4-digit email verification code.');
      }

      const result = await fetchWithCsrf('/auth/signup/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email: normalizedEmail, otp: otp.trim() }),
      });

      if (!result?.success) {
        throw new Error(result?.message || 'Verification failed.');
      }

      setEmailVerified(true);
      setOtpError('');
      setOtpNotice('Email verified. You can now create your account.');
      setOtpLockSeconds(0);
      setResendTimer(0);
    } catch (err: any) {
      const payload = err?.payload;
      const seconds = Number(payload?.seconds_remaining ?? 0);
      if (err?.status === 423 && seconds > 0) {
        setOtpLockSeconds(seconds);
        setResendTimer(seconds);
      }
      setOtpError(err?.message || 'Verification failed.');
      setEmailVerified(false);
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      if (!acceptedLegal) {
        throw new Error('Please accept the Terms of Service and Privacy Policy to create your account.');
      }

      if (!emailVerified) {
        throw new Error('Verify your email address before creating your account.');
      }

      if (!passwordMeetsRequirements(password)) {
        throw new Error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      }

      await signUpWithEmail(normalizedEmail, password, name);
    } catch (err: any) {
      setError(err?.message || 'The registration server is currently unreachable.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google sign-in is not available right now.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-on-background overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-surface-container-lowest">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-secondary rounded-full mix-blend-overlay filter blur-[100px] opacity-40 animate-float" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_10%,transparent_100%)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
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
              Start your journey today.
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              Join thousands of enterprises transforming their operational architecture with SaaSzo.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex gap-4 items-start group">
            <div className="p-3 rounded-2xl bg-primary-container text-on-primary-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_var(--color-primary-container)]">
              <span className="material-symbols-outlined text-2xl">rocket_launch</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Instant Deployment</h3>
              <p className="text-on-surface-variant leading-relaxed">Get your environment up and running in minutes, not months.</p>
            </div>
          </div>

          <div className="flex gap-4 items-start group">
            <div className="p-3 rounded-2xl bg-tertiary-container text-on-tertiary-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_var(--color-tertiary-container)]">
              <span className="material-symbols-outlined text-2xl">verified_user</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Verification-first Signup</h3>
              <p className="text-on-surface-variant leading-relaxed">Your account is created only after at least one verified identity method is confirmed.</p>
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
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Create an account</h2>
            <p className="text-on-surface-variant">Verify your email, then create your workspace securely.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container border border-error/20 flex gap-3 items-center animate-fade-up">
              <span className="material-symbols-outlined text-error">error</span>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">person</span>
                </div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest outline-none border border-transparent focus:border-primary transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_var(--color-primary-container)] placeholder-outline"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3 rounded-2xl border border-outline-variant/70 bg-surface-container-lowest p-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">mail</span>
                  </div>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest outline-none border border-transparent focus:border-primary transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_var(--color-primary-container)] placeholder-outline"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void handleSendOtp()}
                    disabled={otpLoading || !normalizedEmail || resendTimer > 0}
                    className={`flex-1 rounded-xl px-4 py-3 font-semibold transition-all ${otpLoading || !normalizedEmail || resendTimer > 0 ? 'cursor-not-allowed bg-primary/50 text-on-primary' : 'bg-primary text-on-primary hover:opacity-90 shadow-lg shadow-primary/20'}`}
                  >
                    {otpLoading ? 'Sending...' : resendTimer > 0 ? `Resend in ${resendTimer}s` : otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>

                  <div className={`flex items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold ${emailVerified ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-surface-container text-on-surface-variant border border-outline-variant/60'}`}>
                    {emailVerified ? 'Email Verified' : 'Verification Required'}
                  </div>
                </div>

                {otpSent && (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      placeholder="4-digit OTP"
                      className="flex-1 rounded-xl border border-outline-variant/70 bg-surface px-4 py-3 outline-none transition-all focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-container)]"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          void handleVerifyOtp();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => void handleVerifyOtp()}
                      disabled={verifyLoading || otpLockSeconds > 0}
                      className={`rounded-xl px-5 py-3 font-semibold transition-all ${verifyLoading || otpLockSeconds > 0 ? 'cursor-not-allowed bg-primary/50 text-on-primary' : 'bg-primary text-on-primary hover:opacity-90 shadow-lg shadow-primary/20'}`}
                    >
                      {verifyLoading ? 'Verifying...' : otpLockSeconds > 0 ? `Retry in ${otpLockSeconds}s` : 'Verify'}
                    </button>
                  </div>
                )}

                {otpNotice && (
                  <p className="text-sm font-medium text-emerald-600">{otpNotice}</p>
                )}

                {otpError && (
                  <p className="text-sm font-medium text-error">{otpError}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Create a password"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest outline-none border border-transparent focus:border-primary transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_var(--color-primary-container)] placeholder-outline"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-on-surface-variant">
                  Use at least 8 characters with uppercase, lowercase, a number, and a special character.
                </p>
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-outline-variant/70 bg-surface-container-lowest p-4 text-sm leading-6 text-on-surface-variant">
              <input
                type="checkbox"
                checked={acceptedLegal}
                onChange={(event) => setAcceptedLegal(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-outline accent-primary"
              />
              <span>
                I agree to SaaSzo&apos;s{' '}
                <Link href="/terms" className="font-semibold text-primary hover:text-tertiary">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="font-semibold text-primary hover:text-tertiary">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading || !emailVerified}
              className={`mt-6 relative w-full py-4 rounded-xl bg-primary text-on-primary font-semibold text-lg overflow-hidden group transition-all duration-300 ${isLoading || !emailVerified ? 'opacity-80 cursor-not-allowed' : 'shadow-lg shadow-primary/20 hover:shadow-primary/40'}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {!isLoading && emailVerified && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && emailVerified && <span className={`material-symbols-outlined transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>arrow_forward</span>}
              </span>
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-sm text-outline font-medium">Or continue with</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors font-medium"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <Link
              href="/auth/phone?intent=signup"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-primary/30 bg-primary-container/30 hover:bg-primary-container/60 transition-colors font-medium text-primary"
            >
              <span className="material-symbols-outlined text-xl">smartphone</span>
              Mobile OTP
            </Link>
          </div>

          <div className="mt-10 text-center">
            <p className="text-on-surface-variant text-sm">
              Already have an account?{' '}
              <Link href="/auth" className="font-semibold text-primary hover:text-tertiary transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-outline max-w-xs mx-auto">
              By registering, you agree to SaaSzo&apos;s <Link href="/terms" className="underline hover:text-on-surface transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-on-surface transition-colors">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
