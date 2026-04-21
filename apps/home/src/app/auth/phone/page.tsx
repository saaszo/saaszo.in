'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { API_BASE_URL } from '@/lib/app-config';

/* ─── Types ─────────────────────────────────────────────────── */
type Step = 'phone' | 'otp' | 'success';

/* ─── Country codes list ─────────────────────────────────────── */
const COUNTRY_CODES = [
  { flag: '🇮🇳', code: '+91', name: 'India' },
  { flag: '🇺🇸', code: '+1', name: 'USA' },
  { flag: '🇬🇧', code: '+44', name: 'UK' },
  { flag: '🇦🇪', code: '+971', name: 'UAE' },
  { flag: '🇸🇬', code: '+65', name: 'Singapore' },
  { flag: '🇦🇺', code: '+61', name: 'Australia' },
  { flag: '🇨🇦', code: '+1', name: 'Canada' },
  { flag: '🇩🇪', code: '+49', name: 'Germany' },
];

export default function PhoneOtpAuth() {
  const router = useRouter();

  /* ── State ── */
  const [step, setStep] = useState<Step>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [confirmationResult, setConfirmationResult] =
    useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  /* ── Refs ── */
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ── Set up invisible reCAPTCHA once ── */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          { size: 'invisible' },
        );
      }
    } catch {
      // Will retry on send
    }
  }, []);

  /* ── Countdown timer for resend ── */
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  /* ── Send OTP ── */
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (phone.trim().length < 6) {
      setError('Please enter a valid phone number.');
      return;
    }
    const fullPhone = `${countryCode}${phone.replace(/\D/g, '')}`;

    setIsLoading(true);
    try {
      // Ensure verifier exists
      if (!recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current = new RecaptchaVerifier(
          auth,
          'recaptcha-container',
          { size: 'invisible' },
        );
      }
      const result = await signInWithPhoneNumber(
        auth,
        fullPhone,
        recaptchaVerifierRef.current,
      );
      setConfirmationResult(result);
      setStep('otp');
      setResendTimer(30);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to send OTP. Please try again.');
      // Reset reCAPTCHA so it can retry
      recaptchaVerifierRef.current?.clear();
      recaptchaVerifierRef.current = null;
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Verify OTP ── */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }
    if (!confirmationResult) return;

    setIsLoading(true);
    try {
      const userCredential = await confirmationResult.confirm(code);
      const idToken = await userCredential.user.getIdToken();

      // Verify on backend → upsert user in Supabase
      const res = await fetch(
        `${API_BASE_URL}/auth/verify-phone-otp`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.message || 'Verification failed on server.');
      }

      setStep('success');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err: any) {
      setError(err?.message ?? 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ── OTP digit input handler ── */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // only digits
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length) {
      const next = [...otp];
      pasted.split('').forEach((ch, i) => { next[i] = ch; });
      setOtp(next);
      otpInputRefs.current[Math.min(pasted.length, 5)]?.focus();
      e.preventDefault();
    }
  };

  /* ── Resend ── */
  const handleResend = async () => {
    if (resendTimer > 0) return;
    setOtp(['', '', '', '', '', '']);
    setConfirmationResult(null);
    setStep('phone');
  };

  /* ─── Shared left-panel orb background ─── */
  const LeftPanel = () => (
    <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-surface-container-lowest">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-secondary rounded-full mix-blend-overlay filter blur-[100px] opacity-40 animate-float" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
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
            One tap.<br />Full access.
          </h1>
          <p className="text-xl text-on-surface-variant leading-relaxed">
            Verify your identity in seconds with a one-time password sent directly to your mobile.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        {[
          {
            icon: 'smartphone',
            color: 'primary',
            title: 'Passwordless & Secure',
            desc: 'No password to remember or compromise — just your phone.',
          },
          {
            icon: 'bolt',
            color: 'tertiary',
            title: 'Lightning Fast',
            desc: 'OTP delivered in under 10 seconds via SMS, powered by Firebase.',
          },
          {
            icon: 'verified_user',
            color: 'secondary',
            title: 'Military-grade Verification',
            desc: 'Each OTP is single-use and expires in 60 seconds.',
          },
        ].map(({ icon, color, title, desc }) => (
          <div key={title} className="flex gap-4 items-start group">
            <div
              className={`p-3 rounded-2xl bg-${color}-container text-on-${color}-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110`}
            >
              <span className="material-symbols-outlined text-2xl">{icon}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">{title}</h3>
              <p className="text-on-surface-variant leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ─── Main render ─── */
  return (
    <div className="min-h-screen w-full flex bg-background text-on-background overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* invisible reCAPTCHA anchor */}
      <div id="recaptcha-container" ref={recaptchaContainerRef} />

      <LeftPanel />

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute inset-0 bg-surface pointer-events-none" />

        <div
          className="w-full max-w-md relative z-10 animate-fade-up pt-8 lg:pt-0"
          style={{ animationDelay: '0.3s' }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-12 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-[0_0_20px_var(--color-primary)]">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight">SaaSzo</span>
          </div>

          {/* ═══ STEP 1 — Phone entry ═══ */}
          {step === 'phone' && (
            <>
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-bold mb-3 tracking-tight">
                  Sign in with Mobile
                </h2>
                <p className="text-on-surface-variant">
                  We'll send a 6-digit OTP to verify your number.
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container border border-error/20 flex gap-3 items-center animate-fade-up">
                  <span className="material-symbols-outlined text-error">error</span>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form className="flex flex-col gap-5" onSubmit={handleSendOtp}>
                {/* Country + phone row */}
                <div className="flex gap-2">
                  {/* Country code selector */}
                  <div className="relative">
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="h-full pl-3 pr-8 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high outline-none border border-transparent focus:border-primary transition-all duration-300 appearance-none cursor-pointer text-sm font-medium"
                      aria-label="Country code"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={`${c.code}-${c.name}`} value={c.code}>
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm pointer-events-none text-on-surface-variant">
                      expand_more
                    </span>
                  </div>

                  {/* Phone number input */}
                  <div className="relative flex-1 group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">phone</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest outline-none border border-transparent focus:border-primary transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_var(--color-primary-container)]"
                      required
                      inputMode="tel"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`mt-2 relative w-full py-4 rounded-xl bg-primary text-on-primary font-semibold text-lg overflow-hidden group transition-all duration-300 ${
                    isLoading
                      ? 'opacity-80 cursor-not-allowed'
                      : 'shadow-lg shadow-primary/20 hover:shadow-primary/40'
                  }`}
                >
                  {!isLoading && (
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        Send OTP
                        <span className="material-symbols-outlined">send</span>
                      </>
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-8 flex items-center justify-center gap-4">
                <div className="flex-1 h-px bg-outline-variant" />
                <span className="text-sm text-outline font-medium">Or</span>
                <div className="flex-1 h-px bg-outline-variant" />
              </div>

              <div className="mt-8 text-center">
                <Link
                  href="/auth"
                  className="inline-flex items-center gap-2 font-semibold text-primary hover:text-tertiary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                  Sign in with Email instead
                </Link>
              </div>
            </>
          )}

          {/* ═══ STEP 2 — OTP Entry ═══ */}
          {step === 'otp' && (
            <>
              <div className="mb-10 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center animate-fade-up">
                  <span className="material-symbols-outlined text-3xl">sms</span>
                </div>
                <h2 className="text-3xl font-bold mb-3 tracking-tight">Check your messages</h2>
                <p className="text-on-surface-variant">
                  We sent a 6-digit code to{' '}
                  <span className="font-semibold text-on-surface">
                    {countryCode} {phone}
                  </span>
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container border border-error/20 flex gap-3 items-center animate-fade-up">
                  <span className="material-symbols-outlined text-error">error</span>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
                {/* 6 OTP boxes */}
                <div className="flex gap-2 sm:gap-3 justify-center" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { otpInputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className={`w-11 h-14 sm:w-13 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-surface-container focus:bg-surface-container-lowest ${
                        digit
                          ? 'border-primary text-on-surface shadow-[0_0_0_4px_var(--color-primary-container)]'
                          : 'border-outline-variant focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-container)]'
                      }`}
                      aria-label={`OTP digit ${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length < 6}
                  className={`relative w-full py-4 rounded-xl bg-primary text-on-primary font-semibold text-lg overflow-hidden group transition-all duration-300 ${
                    isLoading || otp.join('').length < 6
                      ? 'opacity-75 cursor-not-allowed'
                      : 'shadow-lg shadow-primary/20 hover:shadow-primary/40'
                  }`}
                >
                  {!isLoading && otp.join('').length === 6 && (
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Sign In
                        <span className="material-symbols-outlined">verified</span>
                      </>
                    )}
                  </span>
                </button>
              </form>

              <div className="mt-8 text-center flex flex-col gap-3">
                <p className="text-sm text-on-surface-variant">
                  Didn't receive the code?{' '}
                  {resendTimer > 0 ? (
                    <span className="text-outline">
                      Resend in{' '}
                      <span className="font-semibold text-primary tabular-nums">
                        {resendTimer}s
                      </span>
                    </span>
                  ) : (
                    <button
                      onClick={handleResend}
                      className="font-semibold text-primary hover:text-tertiary transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </p>
                <button
                  onClick={() => { setStep('phone'); setError(''); setOtp(['', '', '', '', '', '']); }}
                  className="inline-flex items-center justify-center gap-1 text-sm text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">arrow_back</span>
                  Change phone number
                </button>
              </div>
            </>
          )}

          {/* ═══ STEP 3 — Success ═══ */}
          {step === 'success' && (
            <div className="text-center animate-fade-up">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl">check_circle</span>
              </div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Verified!</h2>
              <p className="text-on-surface-variant">
                Welcome to SaaSzo. Redirecting you to your workspace…
              </p>
              <div className="mt-6 flex justify-center">
                <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              </div>
            </div>
          )}

          {/* Footer legal */}
          {step === 'phone' && (
            <div className="mt-12 text-center">
              <p className="text-xs text-outline max-w-xs mx-auto">
                By continuing, you agree to SaaSzo's{' '}
                <Link href="/terms" className="underline hover:text-on-surface transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="underline hover:text-on-surface transition-colors">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
