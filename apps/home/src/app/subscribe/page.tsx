import { Suspense } from "react";
import { SubscribeEntry } from "@/components/purchase/checkout-journey";
export default function Page() {
  return (
    <Suspense fallback={<p className="p-8">Loading…</p>}>
      <SubscribeEntry />
    </Suspense>
  );
}
