import { Suspense } from "react";
import { SimpleAccountForm } from "@/components/auth/simple-account-form";
export default function EmailLoginPage() {
  return (
    <Suspense fallback={<p>Loading login…</p>}>
      <SimpleAccountForm intent="login" />
    </Suspense>
  );
}
