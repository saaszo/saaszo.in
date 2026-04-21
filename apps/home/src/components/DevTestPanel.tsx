"use client";
import { useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.saaszo.in";

type TestResult = {
  status: "idle" | "loading" | "success" | "error";
  message: string;
  data?: unknown;
};

const initialResult: TestResult = { status: "idle", message: "" };

function isSuccessfulStatus(status: unknown) {
  return status === "success" || status === "ok";
}

export default function DevTestPanel() {
  const [backend, setBackend] = useState<TestResult>(initialResult);
  const [supabase, setSupabase] = useState<TestResult>(initialResult);
  const [r2, setR2] = useState<TestResult>(initialResult);

  async function testBackend() {
    setBackend({ status: "loading", message: "Connecting..." });
    try {
      const res = await fetch(`${API_URL}/`, { cache: "no-store" });
      const text = await res.text();
      setBackend({ status: "success", message: text });
    } catch {
      setBackend({ status: "error", message: "Cannot reach backend" });
    }
  }

  async function testSupabase() {
    setSupabase({ status: "loading", message: "Testing Supabase..." });
    try {
      const res = await fetch(`${API_URL}/test-supabase`, { cache: "no-store" });
      const json = await res.json();
      if (isSuccessfulStatus(json.status)) {
        setSupabase({ status: "success", message: json.message || "Connected!", data: json });
      } else {
        setSupabase({ status: "error", message: json.message || "Connection failed", data: json });
      }
    } catch {
      setSupabase({ status: "error", message: "Request failed" });
    }
  }

  async function testR2() {
    setR2({ status: "loading", message: "Testing R2 Storage..." });
    try {
      const res = await fetch(`${API_URL}/test-r2`, { cache: "no-store" });
      const json = await res.json();
      if (isSuccessfulStatus(json.status)) {
        setR2({ status: "success", message: json.message || "Connected!", data: json });
      } else {
        setR2({ status: "error", message: json.message || "Connection failed", data: json });
      }
    } catch {
      setR2({ status: "error", message: "Request failed" });
    }
  }

  async function testAll() {
    await Promise.all([testBackend(), testSupabase(), testR2()]);
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div
        className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest overflow-hidden"
        style={{ boxShadow: "0 4px 24px rgba(25,28,30,0.06)" }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary">
              developer_mode
            </span>
            <span className="text-sm font-bold text-on-surface tracking-wide">
              Developer Test Panel
            </span>
          </div>
          <span className="text-xs text-on-surface-variant font-mono bg-surface-container px-2 py-1 rounded-md">
            {API_URL.replace("https://", "")}
          </span>
        </div>

        {/* Test rows */}
        <div className="divide-y divide-outline-variant/10">
          <TestRow
            label="Backend API"
            icon="cloud"
            result={backend}
            onTest={testBackend}
          />
          <TestRow
            label="Supabase Database"
            icon="database"
            result={supabase}
            onTest={testSupabase}
          />
          <TestRow
            label="Cloudflare R2 Storage"
            icon="folder_open"
            result={r2}
            onTest={testR2}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-outline-variant/20 bg-surface-container-low flex justify-end">
          <button
            onClick={testAll}
            className="flex items-center gap-2 text-sm font-semibold text-white px-5 py-2 rounded-lg transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #4648d4 0%, #6b38d4 100%)",
              boxShadow: "0 4px 16px rgba(70,72,212,0.3)",
            }}
          >
            <span className="material-symbols-outlined text-base">play_arrow</span>
            Test All Connections
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-component ─────────────────────────────── */
function TestRow({
  label,
  icon,
  result,
  onTest,
}: {
  label: string;
  icon: string;
  result: TestResult;
  onTest: () => void;
}) {
  const statusColors = {
    idle: "text-on-surface-variant",
    loading: "text-primary",
    success: "text-green-600",
    error: "text-red-500",
  };

  const statusIcons = {
    idle: "radio_button_unchecked",
    loading: "sync",
    success: "check_circle",
    error: "error",
  };

  return (
    <div className="px-6 py-4 flex items-center gap-4">
      {/* Service icon */}
      <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-lg text-on-surface-variant">
          {icon}
        </span>
      </div>

      {/* Label + result */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        {result.status !== "idle" && (
          <p className={`text-xs mt-0.5 truncate font-mono ${statusColors[result.status]}`}>
            {result.status === "loading" ? (
              <span className="animate-pulse">{result.message}</span>
            ) : (
              result.message
            )}
          </p>
        )}
      </div>

      {/* Status icon */}
      <span
        className={`material-symbols-outlined text-xl shrink-0 ${statusColors[result.status]} ${
          result.status === "loading" ? "animate-spin" : ""
        }`}
      >
        {statusIcons[result.status]}
      </span>

      {/* Test button */}
      <button
        onClick={onTest}
        disabled={result.status === "loading"}
        className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all duration-200 disabled:opacity-40 shrink-0"
      >
        Test
      </button>
    </div>
  );
}
