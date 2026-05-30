"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Footer from "../components/Footer";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // If the URL has an access token in the hash, redirect to the callback page
    // to handle the session properly.
    if (window.location.hash.includes("access_token=")) {
      router.replace(`/auth/callback${window.location.hash}`);
    }
  }, [router]);

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
    </>
  );
}
