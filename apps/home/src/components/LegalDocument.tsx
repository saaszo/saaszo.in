import Link from "next/link";
import Footer from "./Footer";
import Navbar from "./Navbar";

type LegalSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
};

type LegalDocumentProps = {
  eyebrow: string;
  title: string;
  summary: string;
  lastUpdated: string;
  sections: readonly LegalSection[];
};

export default function LegalDocument({
  eyebrow,
  title,
  summary,
  lastUpdated,
  sections,
}: LegalDocumentProps) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface">
        <section className="border-b border-outline-variant/20 bg-[radial-gradient(circle_at_top,_rgba(70,72,212,0.16),_transparent_55%),linear-gradient(180deg,_rgba(255,255,255,0.02),_transparent)]">
          <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-primary">
                {eyebrow}
              </p>
              <h1 className="text-4xl font-black tracking-tight text-on-surface md:text-5xl">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-on-surface-variant md:text-lg">
                {summary}
              </p>
            </div>

            <div className="rounded-3xl border border-outline-variant/20 bg-surface-container px-6 py-5 shadow-[0_24px_80px_rgba(0,0,0,0.14)]">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-on-surface-variant">
                Last updated
              </p>
              <p className="mt-2 text-lg font-semibold text-on-surface">
                {lastUpdated}
              </p>
              <Link
                href="mailto:saaszo.in@gmail.com"
                className="mt-4 inline-flex text-sm font-medium text-primary transition-colors hover:text-primary/80"
              >
                Contact the team
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="top-24 h-fit rounded-3xl border border-outline-variant/20 bg-surface-container-low p-6 lg:sticky">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
              On this page
            </p>
            <nav className="mt-5 space-y-3">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  href={`#${section.id}`}
                  className="block text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
                >
                  {section.title}
                </Link>
              ))}
            </nav>
          </aside>

          <div className="space-y-8">
            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="rounded-3xl border border-outline-variant/20 bg-surface-container-low px-6 py-8 shadow-[0_18px_60px_rgba(0,0,0,0.12)]"
              >
                <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                  {section.title}
                </h2>

                <div className="mt-4 space-y-4 text-sm leading-7 text-on-surface-variant md:text-base">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>

                {section.bullets?.length ? (
                  <ul className="mt-5 space-y-3 text-sm leading-7 text-on-surface-variant md:text-base">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-2 h-2 w-2 rounded-full bg-primary" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
