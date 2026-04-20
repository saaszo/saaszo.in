"use client";
import { useState } from "react";

export default function TestServices() {
  const [supabaseStatus, setSupabaseStatus] = useState<string>("");
  const [r2Status, setR2Status] = useState<string>("");

  const testFeature = async (route: string, setStatus: (val: string) => void) => {
    setStatus("Testing...");
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.saaszo.in';
      const res = await fetch(`${API_URL}/${route}`);
      const data = await res.json();
      
      if (data.status === 'success') {
        setStatus(`✅ ${data.message}`);
      } else {
        setStatus(`❌ ${data.message} ${data.details ? '(' + data.details + ')' : ''}`);
      }
    } catch (e: any) {
      setStatus(`❌ Error: Could not reach backend.`);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 border-t border-blue-400/30 pt-4">
      <div className="flex-1">
        <button 
          onClick={() => testFeature('test-supabase', setSupabaseStatus)}
          className="bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 rounded font-semibold text-sm transition-all"
        >
          Check Supabase DB
        </button>
        {supabaseStatus && <p className="mt-2 text-xs font-mono text-zinc-300">{supabaseStatus}</p>}
      </div>

      <div className="flex-1">
        <button 
          onClick={() => testFeature('test-r2', setR2Status)}
          className="bg-orange-500 hover:bg-orange-400 text-black px-4 py-2 rounded font-semibold text-sm transition-all"
        >
          Check Cloudflare R2
        </button>
        {r2Status && <p className="mt-2 text-xs font-mono text-zinc-300">{r2Status}</p>}
      </div>
    </div>
  );
}
