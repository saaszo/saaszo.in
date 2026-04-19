export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-linear-to-br from-emerald-50 via-white to-cyan-50 px-6 py-16 text-zinc-950">
      <main className="flex w-full max-w-5xl flex-col gap-10 rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-[0_30px_80px_rgba(15,23,42,0.12)] sm:p-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">
              /invoice
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              Invoice app mounted inside the main Saaszo experience.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
              This app is still its own Next.js project, but users can reach it
              from the same domain under the{" "}
              <span className="font-semibold text-zinc-950">/invoice</span>{" "}
              path.
            </p>
          </div>
          <a
            className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 px-5 text-sm font-semibold text-zinc-700 transition hover:border-zinc-950 hover:text-zinc-950"
            href="/"
          >
            Back to home
          </a>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-sm font-medium text-zinc-500">Path</p>
            <p className="mt-3 text-2xl font-semibold">/invoice</p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-sm font-medium text-zinc-500">Asset scope</p>
            <p className="mt-3 text-2xl font-semibold">/invoice-static</p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-sm font-medium text-zinc-500">Dev port</p>
            <p className="mt-3 text-2xl font-semibold">3002</p>
          </div>
        </div>

        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
          <p className="text-sm font-semibold text-emerald-700">
            Connection with the home app
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-emerald-950/80">
            The home app proxies invoice routes to this app, so navigation feels
            unified while the invoice codebase stays isolated and easier to
            grow.
          </p>
        </div>
      </main>
    </div>
  );
}
