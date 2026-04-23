'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthSession } from '../components/AuthProvider';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import DevTestPanel from '../components/DevTestPanel';

export default function Home() {
  const { authenticated, loading } = useAuthSession();
  const router = useRouter();

  useEffect(() => {
    // If the URL has an access token in the hash, redirect to the callback page
    // to handle the session properly.
    if (window.location.hash.includes('access_token=')) {
      router.replace(`/auth/callback${window.location.hash}`);
      return;
    }

    // If already authenticated and not loading, go to dashboard
    if (!loading && authenticated) {
      router.replace('/dashboard');
    }
  }, [authenticated, loading, router]);

  // If loading or authenticated (redirecting), show a minimal loader or nothing to prevent flicker
  if (loading || authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />

      {/* ── Developer Test Panel (remove before production) ── */}
      <section className="bg-surface-container-low/50 border-t border-outline-variant/20 py-4">
        <p className="text-center text-xs font-semibold tracking-widest uppercase text-on-surface-variant mb-2">
          🛠 Dev Only — Connection Tests
        </p>
        <DevTestPanel />
      </section>
    </>
  );
}

