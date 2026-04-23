'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase-browser';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    async function exchangeCode() {
      const code = searchParams.get('code');
      const tokenHash = searchParams.get('token_hash');
      const verificationType = searchParams.get('type');
      const nextPath = searchParams.get('next') || '/dashboard';

      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
          code,
        );

        if (exchangeError) {
          setError(exchangeError.message);
          return;
        }

        router.replace(nextPath.startsWith('/') ? nextPath : '/dashboard');
        return;
      }

      if (tokenHash && verificationType) {
        const { error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: verificationType as
            | 'signup'
            | 'recovery'
            | 'magiclink'
            | 'invite'
            | 'email_change'
            | 'email',
        });

        if (verifyError) {
          setError(verifyError.message);
          return;
        }

        router.replace(nextPath.startsWith('/') ? nextPath : '/dashboard');
        return;
      }

      if (typeof window !== 'undefined') {
        const hashParams = new URLSearchParams(window.location.hash.replace('#', ''));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const errorDescription = hashParams.get('error_description');

        if (errorDescription) {
          setError(errorDescription);
          return;
        }

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            setError(sessionError.message);
            return;
          }

          router.replace(nextPath.startsWith('/') ? nextPath : '/dashboard');
          return;
        }
      }

      setError('Missing authentication callback payload.');
    }

    void exchangeCode();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-background text-on-surface flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-[0_24px_80px_rgba(25,28,30,0.10)]">
        <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-3xl">
            {error ? 'error' : 'sync'}
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">
          {error ? 'Google sign-in failed' : 'Finishing your sign-in'}
        </h1>
        <p className="text-on-surface-variant leading-relaxed">
          {error
            ? error
            : 'We are securely linking your Google account to your SaaSzo workspace.'}
        </p>
        {error && (
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 mt-6 font-semibold text-primary hover:text-tertiary transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Back to sign in
          </Link>
        )}
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-on-surface flex items-center justify-center px-6">
          <div className="max-w-md w-full rounded-3xl border border-outline-variant/30 bg-surface-container-lowest p-8 shadow-[0_24px_80px_rgba(25,28,30,0.10)]">
            <h1 className="text-3xl font-bold tracking-tight mb-3">
              Finishing your sign-in
            </h1>
            <p className="text-on-surface-variant leading-relaxed">
              Preparing your secure callback session...
            </p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
