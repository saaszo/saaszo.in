'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ApiConnectionStatus from '@/components/ApiConnectionStatus';
import { useAuthSession } from '@/components/AuthProvider';
import { auth } from '@/lib/firebase';
import { verifyPasswordResetCode } from 'firebase/auth';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { confirmPasswordReset } = useAuthSession();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [actionCode, setActionCode] = useState('');
  const [accountEmail, setAccountEmail] = useState('');

  useEffect(() => {
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');

    if (!auth) {
      setError('Firebase is not initialized.');
      return;
    }

    if (!oobCode || (mode && mode !== 'resetPassword')) {
      setError(
        'Invalid or missing reset link. Please request a new password recovery email.',
      );
      return;
    }

    void verifyPasswordResetCode(auth, oobCode)
      .then((email) => {
        setActionCode(oobCode);
        setAccountEmail(email);
      })
      .catch(() => {
        setError(
          'This reset link is invalid or has expired. Please request a new one.',
        );
      });
  }, [searchParams]);

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return { level: 0, label: '', color: '' };
    if (pwd.length < 6) return { level: 1, label: 'Too short', color: 'bg-error' };
    if (pwd.length < 10) return { level: 2, label: 'Weak', color: 'bg-orange-400' };
    if (!/[A-Z]/.test(pwd) || !/[0-9]/.test(pwd)) return { level: 3, label: 'Fair', color: 'bg-yellow-400' };
    return { level: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (!actionCode) {
      setError(
        'Reset token is missing. Please request a new password recovery email.',
      );
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await confirmPasswordReset(actionCode, password);

      if (result.error) {
        throw new Error(result.error);
      }

      setIsSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => router.push('/auth'), 3000);
    } catch (err: any) {
      setError(err.message || 'The server is currently unreachable. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-on-background overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Left Panel */}
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
              New password, new chapter.
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              Create a strong, unique password to protect your workspace and keep your operations secure.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          {/* Tips */}
          {[
            { icon: 'lock', color: 'primary', title: 'Use a passphrase', desc: 'Combine 3–4 random words for a strong, memorable password.' },
            { icon: 'device_unknown', color: 'tertiary', title: 'Avoid reuse', desc: 'Never reuse a password from another service to keep your account safe.' },
          ].map(({ icon, color, title, desc }) => (
            <div key={title} className="flex gap-4 items-start group">
              <div className={`p-3 rounded-2xl bg-${color}-container text-on-${color}-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110`}>
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

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute inset-0 bg-surface pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-fade-up pt-8 lg:pt-0" style={{ animationDelay: '0.3s' }}>
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-2 mb-12 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-[0_0_20px_var(--color-primary)]">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight">SaaSzo</span>
          </div>

          {isSuccess ? (
            /* ── Success State ── */
            <div className="text-center animate-fade-up">
              <div className="w-24 h-24 mx-auto bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-5xl text-emerald-500">check_circle</span>
              </div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">Password Updated!</h2>
              <p className="text-on-surface-variant mb-8">
                Your password has been changed successfully. You'll be redirected to the sign-in page in a moment.
              </p>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold hover:opacity-90 transition-opacity"
              >
                <span className="material-symbols-outlined text-sm">login</span>
                Sign In Now
              </Link>
            </div>
          ) : (
            /* ── Form State ── */
            <>
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-bold mb-3 tracking-tight">Set New Password</h2>
                <p className="text-on-surface-variant">
                  {accountEmail
                    ? `Choose a strong password for ${accountEmail}.`
                    : 'Choose a strong password for your SaaSzo workspace.'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container border border-error/20 flex gap-3 items-start animate-fade-up">
                  <span className="material-symbols-outlined text-error shrink-0 mt-0.5">error</span>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* New Password */}
                  <div className="space-y-2">
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                        <span className="material-symbols-outlined text-xl">lock_reset</span>
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New password"
                        className="w-full pl-12 pr-12 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest outline-none border border-transparent focus:border-primary transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_var(--color-primary-container)] placeholder-outline"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        disabled={!actionCode || isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-4 text-on-surface-variant hover:text-primary transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>

                    {/* Password strength bar */}
                    {password.length > 0 && (
                      <div className="space-y-1.5 animate-fade-up">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                i <= strength.level ? strength.color : 'bg-outline-variant'
                              }`}
                            />
                          ))}
                        </div>
                        <p className={`text-xs font-medium ${
                          strength.level <= 1 ? 'text-error' :
                          strength.level === 2 ? 'text-orange-400' :
                          strength.level === 3 ? 'text-yellow-500' : 'text-emerald-500'
                        }`}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                      <span className="material-symbols-outlined text-xl">lock_check</span>
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      className={`w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest outline-none border transition-all duration-300 shadow-sm placeholder-outline ${
                        confirmPassword.length > 0 && confirmPassword !== password
                          ? 'border-error focus:border-error focus:shadow-[0_0_0_4px_var(--color-error-container)]'
                          : 'border-transparent focus:border-primary focus:shadow-[0_0_0_4px_var(--color-primary-container)]'
                      }`}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={!actionCode || isLoading}
                    />
                    {confirmPassword.length > 0 && (
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className={`material-symbols-outlined text-xl ${
                          confirmPassword === password ? 'text-emerald-500' : 'text-error'
                        }`}>
                          {confirmPassword === password ? 'check_circle' : 'cancel'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !actionCode || password !== confirmPassword}
                  className={`mt-4 relative w-full py-4 rounded-xl bg-primary text-on-primary font-semibold text-lg overflow-hidden group transition-all duration-300 ${
                    isLoading || !actionCode || password !== confirmPassword
                      ? 'opacity-50 cursor-not-allowed'
                      : 'shadow-lg shadow-primary/20 hover:shadow-primary/40'
                  }`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {!isLoading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? 'Updating Password...' : 'Update Password'}
                    {!isLoading && (
                      <span className={`material-symbols-outlined transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>
                        arrow_forward
                      </span>
                    )}
                  </span>
                </button>
              </form>
            </>
          )}

          <div className="mt-10 text-center">
            <Link href="/auth" className="inline-flex items-center gap-2 font-semibold text-primary hover:text-tertiary transition-colors">
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

// Wrap in Suspense because useSearchParams needs it
export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
