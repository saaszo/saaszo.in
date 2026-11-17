import { Suspense } from "react";
import { SimpleAccountForm } from "@/components/auth/simple-account-form";
export default function RegisterPage() {
  return (
    <Suspense fallback={<p>Loading signup…</p>}>
      <SimpleAccountForm intent="signup" />
    </Suspense>
  );
}
