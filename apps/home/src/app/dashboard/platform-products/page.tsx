import { Metadata } from "next";
import { PlatformConsole } from "@/components/platform/PlatformConsole";

export const metadata: Metadata = {
  title: "Platform Console — SaaSzo",
  description: "Unified SaaSzo master platform management for workspaces, products, billing and integrations.",
};

export default function PlatformProductsPage() {
  return (
    <div className="min-w-0 min-h-screen bg-slate-50 py-4">
      <PlatformConsole />
    </div>
  );
}
