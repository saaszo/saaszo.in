import Link from "next/link";
import { OnboardingWorkspace } from "@/components/onboarding-workspace";
export default function SettingsPage() {
  return (
    <section>
      <header className="p-6">
        <h1 className="text-2xl font-bold">Profile & Company Settings</h1>
        <p>Complete or update business details when you need them.</p>
        <Link href="/dashboard?tab=settings" className="underline">
          Edit account profile
        </Link>
      </header>
      <OnboardingWorkspace settingsMode />
    </section>
  );
}
