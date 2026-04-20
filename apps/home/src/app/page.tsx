import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';
import DevTestPanel from '../components/DevTestPanel';

export default function Home() {
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

