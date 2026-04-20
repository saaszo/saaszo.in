export default async function Home() {
  let apiStatus = "Checking connection...";
  
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.saaszo.in';
    const res = await fetch(`${API_URL}/`, { cache: 'no-store' });
    if (res.ok) {
      const text = await res.text();
      apiStatus = `✅ Backend Connected: ${text}`;
    } else {
      apiStatus = `❌ Backend Error: ${res.status}`;
    }
  } catch (error) {
    apiStatus = `❌ Connection Failed. Check if Backend is running.`;
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-950 px-6 py-16 text-white ">
      <main className="flex w-full max-w-5xl flex-col gap-12 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur sm:p-12">
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300">
            Saaszo
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Home app and invoice app now share one route space.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
            The home app stays at the root and forwards every request under{" "}
            <span className="font-semibold text-white">/invoice</span> to the
            dedicated invoice app.
          </p>
        </div>

        {/* --- API Test Section --- */}
        <div className="rounded-2xl border border-blue-400/30 bg-blue-400/10 p-5 mt-2">
          <p className="text-sm font-medium text-blue-200 uppercase tracking-widest mb-1">Live API Test</p>
          <p className="font-mono text-white/90">{apiStatus}</p>
        </div>
        {/* ------------------------ */}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-black/20 p-6">
            <p className="text-sm font-medium text-zinc-400">Main app</p>
            <h2 className="mt-3 text-2xl font-semibold">Home</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              This app owns the domain and exposes the main landing experience.
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-6">
            <p className="text-sm font-medium text-emerald-200">
              Connected app
            </p>
            <h2 className="mt-3 text-2xl font-semibold">Invoice</h2>
            <p className="mt-3 text-sm leading-7 text-emerald-50/90">
              Requests to <span className="font-semibold">/invoice</span> are
              proxied to the invoice app so it feels like part of the same
              product.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            className="inline-flex h-12 items-center justify-center rounded-full bg-emerald-400 px-6 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300"
            href="/invoice"
          >
            Open invoice app
          </a>
          <p className="flex items-center text-sm text-zinc-400">
            Local invoice origin defaults to{" "}
            <code className="ml-1 rounded bg-black/30 px-2 py-1 text-zinc-200">
              http://localhost:3001
            </code>
          </p>
        </div>
      </main>
    </div>
  );
}
