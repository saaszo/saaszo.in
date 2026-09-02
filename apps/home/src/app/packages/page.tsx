import Link from "next/link";
import {
  DigitalMarketingShell,
  PageHero,
} from "@/components/digital/DigitalMarketingShell";

const packages = [
  {
    name: "Starter Growth",
    price: "Custom",
    items: ["Website audit", "Local SEO basics", "Monthly reporting"],
  },
  {
    name: "Lead Engine",
    price: "Custom",
    items: ["Paid campaigns", "Landing page support", "Lead tracking"],
  },
  {
    name: "Scale Partner",
    price: "Custom",
    items: ["SEO and PPC", "Content planning", "Weekly optimization"],
  },
];

export const metadata = {
  title: "Digital Marketing Packages",
  description:
    "SaaSzo Digital marketing packages for lead generation, SEO and growth.",
};

export default function PackagesPage() {
  return (
    <DigitalMarketingShell>
      <PageHero
        eyebrow="Packages"
        title="Packages shaped around your lead target."
        description="Keep pricing flexible while the public site gives prospects a clear path to request the right plan."
      />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {packages.map((item) => (
          <div className="digital-card" key={item.name}>
            <h2 className="text-2xl font-semibold text-slate-950">
              {item.name}
            </h2>
            <p className="mt-2 text-sm font-semibold text-cyan-700">
              {item.price}
            </p>
            <ul className="mt-6 grid gap-3 text-sm text-slate-700">
              {item.items.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Link
              className="digital-primary mt-8 w-full justify-center"
              href="/contact"
            >
              Request Plan
            </Link>
          </div>
        ))}
      </section>
    </DigitalMarketingShell>
  );
}
