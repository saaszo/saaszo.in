import TestServices from './TestServices';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Pricing from '../components/Pricing';
import Footer from '../components/Footer';

export default async function Home() {
  let apiStatus = "Checking connection...";
  
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.saaszo.in';
    const res = await fetch(`${API_URL}/`, { cache: 'no-store' });
    if (res.ok) {
      const text = await res.text();
      apiStatus = `✅ Backend Connected: ${text}`;
    } else {
      apiStatus = `❌ Backend Error: ${res.status}`;
    }
  } catch (error) {
    apiStatus = `❌ Connection Failed. Check if Backend is running.`;
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Testimonials />
        <Pricing />
      </main>
      <Footer />
      
      {/* --- Developer Support / API Test Section --- */}
      <div className="max-w-7xl mx-auto px-8 pb-12 opacity-50 hover:opacity-100 transition-opacity">
        <div className="rounded-2xl border border-blue-400/30 bg-blue-400/5 p-5">
          <div className="flex justify-between items-center mb-4">
             <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">Developer Connection Test</p>
             <p className="font-mono text-xs text-slate-400">{apiStatus}</p>
          </div>
          <TestServices />
        </div>
      </div>
      {/* ------------------------------------------ */}
    </>
  );
}
