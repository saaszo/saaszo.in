import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-on-surface">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16">
        <div className="w-full overflow-hidden rounded-[32px] border border-outline-variant/70 bg-surface shadow-[0_30px_90px_rgba(0,0,0,0.08)]">
          <div className="grid gap-10 px-8 py-12 md:grid-cols-[1.15fr_0.85fr] md:px-12">
            <div className="space-y-5">
              <span className="inline-flex rounded-full bg-primary-container px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-on-primary-container">
                404 • SaaSzo Platform
              </span>
              <h1 className="text-4xl font-semibold tracking-[-0.04em] text-on-surface md:text-6xl">
                This SaaSzo page could not be found.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-on-surface-variant">
                The link may be outdated, the page may have moved, or the
                requested product route may belong to a different SaaSzo app.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-semibold text-on-primary transition hover:opacity-90"
                >
                  Go to homepage
                </Link>
                <Link
                  href="/auth"
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-outline-variant bg-surface-container-low px-5 text-sm font-semibold text-on-surface transition hover:bg-surface-container"
                >
                  Open login
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] bg-surface-container-low p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Quick destinations
              </p>
              <div className="mt-5 grid gap-3 text-sm text-on-surface-variant">
                <Link href="/dashboard" className="rounded-2xl bg-surface px-4 py-3 hover:text-on-surface">
                  SaaSzo dashboard
                </Link>
                <a
                  href="https://invoice.saaszo.in/dashboard"
                  className="rounded-2xl bg-surface px-4 py-3 hover:text-on-surface"
                >
                  Invoice product
                </a>
                <a
                  href="https://task.saaszo.in/task-manager"
                  className="rounded-2xl bg-surface px-4 py-3 hover:text-on-surface"
                >
                  Task workspace
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
