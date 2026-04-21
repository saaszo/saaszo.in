'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ApiConnectionStatus from '@/components/ApiConnectionStatus';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.saaszo.in';
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'Registration failed. Please try again.');
      }

      // Success: Redirect to login or auto-login
      router.push('/auth?registered=true');
    } catch (err: any) {
      setError(err.message || 'The registration server is currently unreachable.');
    } finally {
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
              <span className="material-symbols-outlined text-2xl">sync</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Real-time Synchronization</h3>
              <p className="text-on-surface-variant leading-relaxed">Keep your teams aligned with lightning-fast data propagation globally.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Right Panel - Register Form */}
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
            <p className="text-on-surface-variant">Get started with your free 14-day trial.</p>
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
                  placeholder="Create a password"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-surface-container hover:bg-surface-container-high focus:bg-surface-container-lowest outline-none border border-transparent focus:border-primary transition-all duration-300 shadow-sm focus:shadow-[0_0_0_4px_var(--color-primary-container)] placeholder-outline"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`mt-6 relative w-full py-4 rounded-xl bg-primary text-on-primary font-semibold text-lg overflow-hidden group transition-all duration-300 ${isLoading ? 'opacity-80 cursor-not-allowed' : 'shadow-lg shadow-primary/20 hover:shadow-primary/40'}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {!isLoading && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? 'Creating Account...' : 'Create Account'}
                {!isLoading && <span className={`material-symbols-outlined transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>arrow_forward</span>}
              </span>
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-4">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-sm text-outline font-medium">Or continue with</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors font-medium">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-outline-variant hover:bg-surface-container transition-colors font-medium">
              <svg className="w-5 h-5 text-[#181717] dark:text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
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
              By registering, you agree to SaaSzo's <Link href="/terms" className="underline hover:text-on-surface transition-colors">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-on-surface transition-colors">Privacy Policy</Link>.
            </p>
          </div>

        </div>
      </div>
      <ApiConnectionStatus />
    </div>
  );
}
