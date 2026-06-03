"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Products from "../components/Products";
import HowItWorks from "../components/HowItWorks";
import WhySaaSzo from "../components/WhySaaSzo";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (window.location.hash.includes("access_token=")) {
      router.replace(`/auth/callback${window.location.hash}`);
    }
  }, [router]);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Products />
        <HowItWorks />
        <WhySaaSzo />
        <Testimonials />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
