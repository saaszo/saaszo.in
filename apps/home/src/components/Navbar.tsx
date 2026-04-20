export default function Navbar() {
  return (
    <nav className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl font-sans text-sm font-medium tracking-tight fixed top-0 w-full z-50 shadow-sm dark:shadow-none transition-colors duration-200">
      <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">
          SaaSzo
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a className="text-indigo-600 dark:text-indigo-400 font-bold border-b-2 border-indigo-600 pb-1" href="#">Platform</a>
          <a className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:text-indigo-500 transition-colors duration-200 pb-1" href="#solutions">Solutions</a>
          <a className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:text-indigo-500 transition-colors duration-200 pb-1" href="#resources">Resources</a>
          <a className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 hover:text-indigo-500 transition-colors duration-200 pb-1" href="#pricing">Pricing</a>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <a className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors duration-200 font-medium" href="/invoice">Log In</a>
          <a className="signature-pulse text-white px-5 py-2.5 rounded-lg font-medium hover:opacity-90 scale-95 active:scale-90 transition-transform shadow-[0_12px_32px_rgba(25,28,30,0.06)]" href="/invoice">Get Started</a>
        </div>
        <button className="md:hidden text-slate-600">
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
      </div>
    </nav>
  );
}
