'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import ApiConnectionStatus from '@/components/ApiConnectionStatus';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.saaszo.in';
      const response = await fetch(`${API_BASE_URL}/auth/recover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || 'Failed to send recovery link.');
      }

      setIsSent(true);
    } catch (err: any) {
      setError(err.message || 'The server is currently unreachable. Please try again later.');
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
              Secure your operations.
            </h1>
            <p className="text-xl text-on-surface-variant leading-relaxed">
              We employ military-grade encryption to ensure your workspace remains impenetrable.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          
          <div className="flex gap-4 items-start group">
            <div className="p-3 rounded-2xl bg-primary-container text-on-primary-container shrink-0 mt-1 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_var(--color-primary-container)]">
              <span className="material-symbols-outlined text-2xl">password</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-1">Advanced Verification</h3>
              <p className="text-on-surface-variant leading-relaxed">Multi-layered security protocols guarantee only authorized personnel can access your mission-critical data.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="absolute inset-0 bg-surface pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10 animate-fade-up pt-8 lg:pt-0" style={{ animationDelay: '0.3s' }}>
          
          <div className="flex lg:hidden items-center gap-2 mb-12 justify-center">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold text-xl shadow-[0_0_20px_var(--color-primary)]">
              S
            </div>
            <span className="text-2xl font-bold tracking-tight">SaaSzo</span>
          </div>

          {!isSent ? (
            <>
              <div className="mb-10 text-center lg:text-left">
                <h2 className="text-3xl font-bold mb-3 tracking-tight">Recover Identity</h2>
                <p className="text-on-surface-variant">Enter your registered email address and we'll send you a link to reset your password.</p>
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
                    {isLoading ? 'Sending...' : 'Send Recovery Link'}
                    {!isLoading && <span className={`material-symbols-outlined transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>send</span>}
                  </span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-6 animate-fade-up">
                <span className="material-symbols-outlined text-4xl">mark_email_read</span>
              </div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>Check your inbox</h2>
              <p className="text-on-surface-variant mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>
                We've sent a recovery link to <span className="font-semibold text-on-surface">{email}</span>. Click the link to reset your password.
              </p>
            </div>
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
