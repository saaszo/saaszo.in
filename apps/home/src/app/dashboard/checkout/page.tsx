import { Suspense } from "react";
import { ProductCheckout } from "@/components/purchase/checkout-journey";
export default function Page() {
  return (
    <Suspense fallback={<p className="p-8">Loading…</p>}>
      <ProductCheckout />
    </Suspense>
  );
}
