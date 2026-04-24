'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');

  useEffect(() => {
    const mode = searchParams.get('mode');
    const actionCode = searchParams.get('oobCode');
    const continueUrl = searchParams.get('continueUrl');
    const nextPath = searchParams.get('next') || '/dashboard';

    if (mode === 'resetPassword' && actionCode) {
      const resetUrl = new URL('/reset-password', window.location.origin);
      resetUrl.searchParams.set('mode', mode);
      resetUrl.searchParams.set('oobCode', actionCode);
      if (continueUrl) {
        resetUrl.searchParams.set('continueUrl', continueUrl);
      }
      router.replace(`${resetUrl.pathname}${resetUrl.search}`);
      return;
    }

    if (mode === 'verifyEmail' && actionCode) {
      const verifyUrl = new URL('/auth/verify-email', window.location.origin);
      verifyUrl.searchParams.set('mode', mode);
      verifyUrl.searchParams.set('oobCode', actionCode);
      if (continueUrl) {
        verifyUrl.searchParams.set('continueUrl', continueUrl);
      }
      router.replace(`${verifyUrl.pathname}${verifyUrl.search}`);
      return;
    }

    if (auth?.currentUser) {
      router.replace(nextPath.startsWith('/') ? nextPath : '/dashboard');
      return;
    }

    setError('Missing or unsupported authentication callback payload.');
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
