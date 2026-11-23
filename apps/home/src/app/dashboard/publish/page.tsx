"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuthSession } from "@/components/AuthProvider";

const publishOrigin = process.env.NEXT_PUBLIC_PUBLISH_ORIGIN ?? "https://publish.saaszo.in";

export default function OpenPublishPage() {
  const { loading, authenticated, getHandoffToken } = useAuthSession();
  const launched = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading || !authenticated || launched.current) return;
    launched.current = true;
    void getHandoffToken("publish").then(({ redirectUrl, error }) => {
      try {
        if (error || !redirectUrl) throw new Error(error || "Publish sign-in could not start.");
        const target = new URL(redirectUrl);
        if (target.origin !== new URL(publishOrigin).origin || target.pathname !== "/auth-bridge"
          || target.searchParams.get("tool") !== "publish" || !/^[A-Za-z0-9]{64}$/.test(target.searchParams.get("token") ?? "")) {
          throw new Error("Publish returned an invalid sign-in link.");
        }
        window.location.replace(target.href);
      } catch (failure) {
        setError(failure instanceof Error ? failure.message : "Publish sign-in could not start.");
      }
    });
  }, [authenticated, getHandoffToken, loading]);

  return <main className="mx-auto max-w-lg px-6 py-16">
    <h1 className="text-3xl font-bold">Open SaaSzo Publish</h1>
    <p className="my-4" role={error ? "alert" : "status"}>{error || "Connecting your SaaSzo account…"}</p>
    <Link className="underline" href="/dashboard">Back to SaaSzo dashboard</Link>
    {error && <button className="ml-5 underline" onClick={() => window.location.reload()}>Try again</button>}
  </main>;
}
