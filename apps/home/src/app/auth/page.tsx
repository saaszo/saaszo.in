'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import ApiConnectionStatus from '@/components/ApiConnectionStatus';
import { useAuthSession } from '@/components/AuthProvider';
import { supabase } from '@/lib/supabase-browser';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authenticated, signInWithGoogle } = useAuthSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMsg('Account created! Please sign in.');
    }
  }, [searchParams]);

  useEffect(() => {
    if (authenticated) {
      router.replace('/dashboard');
    }
  }, [authenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (/email.*confirm/i.test(signInError.message)) {
          router.push(
            `/auth/verify-email?email=${encodeURIComponent(email)}`,
          );
          return;
        }

        throw new Error(signInError.message || 'Invalid email or password. Please try again.');
      }
      
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'The authentication server is currently unreachable.');
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
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-on-background overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Left Panel - Brand & Vision (Ethereal Workspace design) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-surface-container-lowest">
        {/* Dynamic Abstract Background (Glassmorphism & Orbs) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-tertiary rounded-full mix-blend-multiply filter blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-secondary rounded-full mix-blend-overlay filter blur-[100px] opacity-40 animate-float" />
          
          {/* subtle grid overlay for technical feel */}
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
              Elevate your operational architecture.
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              The ethereal workspace designed for clarity, precision, and uncompromised scale.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          
          {/* Feature 1 */}
          <div className="flex gap-4 items-start group">
            <div className="p-3 rounded-2xl bg-primary-container text-on-primary-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_var(--color-primary-container)]">
              <span className="material-symbols-outlined text-2xl">grid_view</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">All-in-one Business Toolkit</h3>
              <p className="text-on-surface-variant leading-relaxed">Seamlessly integrate your disparate workflows into a singular, unified sanctuary.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex gap-4 items-start group">
            <div className="p-3 rounded-2xl bg-tertiary-container text-on-tertiary-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_var(--color-tertiary-container)]">
              <span className="material-symbols-outlined text-2xl">shield_lock</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Enterprise-grade Security</h3>
              <p className="text-on-surface-variant leading-relaxed">Uncompromising data protection built into the foundation of your digital environment.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex gap-4 items-start group">
            <div className="p-3 rounded-2xl bg-secondary-container text-on-secondary-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_var(--color-secondary-container)]">
              <span className="material-symbols-outlined text-2xl">insights</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">AI-powered Analytics</h3>
              <p className="text-on-surface-variant leading-relaxed">Transform raw data into actionable architectural insights in real-time.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Right Panel - Auth Form */}
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

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Welcome back</h2>
            <p className="text-on-surface-variant">Enter your details to access your workspace.</p>
          </div>

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex gap-3 items-center animate-fade-up">
              <span className="material-symbols-outlined">check_circle</span>
              <p className="text-sm font-medium">{successMsg}</p>
            </div>
          )}

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

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest outline-none border border-transparent focus:border-primary transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_var(--color-primary-container)] placeholder-outline"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 rounded border border-outline group-hover:border-primary transition-colors">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="absolute inset-0 rounded bg-primary scale-0 peer-checked:scale-100 transition-transform duration-200" />
                  <span className="material-symbols-outlined text-on-primary text-sm opacity-0 peer-checked:opacity-100 z-10">check</span>
                </div>
                <span className="text-sm font-medium select-none group-hover:text-primary transition-colors">Remember me</span>
              </label>
              
              <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:text-tertiary transition-colors">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-4 relative w-full py-4 rounded-xl bg-primary text-on-primary font-semibold text-lg overflow-hidden group transition-all duration-300 ${isLoading ? 'opacity-80 cursor-not-allowed' : 'shadow-lg shadow-primary/20 hover:shadow-primary/40'}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {!isLoading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? 'Signing In...' : 'Sign In'}
                {!isLoading && <span className={`material-symbols-outlined transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>arrow_forward</span>}
              </span>
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-sm text-outline font-medium">Or continue with</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {/* Google */}
            <button
              onClick={handleGoogleSignIn}
              type="button"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors font-medium"
              title="Sign in with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="hidden sm:inline text-sm">Google</span>
            </button>

            {/* Mobile OTP — links to Firebase phone auth page */}
            <Link
              href="/auth/phone?intent=signin"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-primary/40 bg-primary-container/30 hover:bg-primary-container/60 text-primary transition-all duration-200 font-medium group"
              title="Sign in with Mobile OTP"
            >
              <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">smartphone</span>
              <span className="hidden sm:inline text-sm">Mobile OTP</span>
            </Link>
          </div>


          <div className="mt-10 text-center">
            <p className="text-on-surface-variant text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold text-primary hover:text-tertiary transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-12 text-center">
            <p className="text-xs text-outline max-w-xs mx-auto">
              By continuing, you agree to SaaSzo's <Link href="/terms" className="underline hover:text-on-surface transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-on-surface transition-colors">Privacy Policy</Link>.
            </p>
          </div>

        </div>
      </div>
      <ApiConnectionStatus />
    </div>
  );
}

export default function UnifiedAuthHub() {
  return (
    <Suspense>
      <AuthForm />
    </Suspense>
  );
}
