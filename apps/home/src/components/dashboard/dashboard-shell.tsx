"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Users,
  CreditCard,
  Settings,
  ShieldAlert,
  Receipt,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { useAuthSession } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "overview";
  const [mobileOpen, setMobileOpen] = useState(false);

  const {
    auth,
    profile,
    subscription,
    workspaceUser,
    signOut,
  } = useAuthSession();

  const isSuperAdmin = workspaceUser?.role === "super_admin";
  const companyName = profile?.companyName || "SaaSzo Workspace";
  const planName = subscription?.planName || "Growth";

  // Determine active nav item
  const isOverview = pathname === "/dashboard" && currentTab === "overview";
  const isBranches = pathname === "/dashboard" && currentTab === "branches";
  const isTeam = pathname === "/dashboard" && currentTab === "team";
  const isSettings =
    (pathname === "/dashboard" && currentTab === "settings") ||
    pathname === "/dashboard/settings";
  const isBilling = pathname === "/dashboard/billing";
  const isPlatform = pathname === "/dashboard/platform";

  // Breadcrumb title
  const pageTitle = isPlatform
    ? "Platform Admin"
    : isBilling
      ? "Subscription & Billing"
      : isSettings
        ? "Workspace Settings"
        : isBranches
          ? "Branches & Outlets"
          : isTeam
            ? "Team & Permissions"
            : "Overview";

  const navItems = [
    {
      group: "Core",
      items: [
        {
          label: "Overview",
          href: "/dashboard",
          icon: LayoutDashboard,
          active: isOverview,
        },
        {
          label: "Branches & Outlets",
          href: "/dashboard?tab=branches",
          icon: Store,
          active: isBranches,
        },
        {
          label: "Team & Staff",
          href: "/dashboard?tab=team",
          icon: Users,
          active: isTeam,
        },
      ],
    },
    {
      group: "Account & Tools",
      items: [
        {
          label: "Billing & Plans",
          href: "/dashboard/billing",
          icon: CreditCard,
          active: isBilling,
          badge: planName,
        },
        {
          label: "Settings",
          href: "/dashboard?tab=settings",
          icon: Settings,
          active: isSettings,
        },
        ...(isSuperAdmin
          ? [
              {
                label: "Platform Admin",
                href: "/dashboard/platform",
                icon: ShieldAlert,
                active: isPlatform,
                badge: "Super",
              },
            ]
          : []),
      ],
    },
  ];

  function renderSidebarContent() {
    return (
      <div className="flex flex-col h-full bg-white select-none">
        {/* Brand & Workspace Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col gap-3.5 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="h-8 w-8 rounded-none bg-indigo-600 text-white flex items-center justify-center shadow-xs shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="h-4 w-4 fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold text-slate-900 tracking-tight leading-none">
                SaaSzo
              </span>
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider mt-0.5">
                Control Hub
              </span>
            </div>
          </Link>

          {/* Active Workspace Pill */}
          <div className="flex items-center justify-between p-2 rounded-none bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-6 w-6 rounded-none bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-bold text-xs">
                <Building2 className="h-3 w-3" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {companyName}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 shrink-0" />
                  <span className="text-[10px] font-medium text-slate-500 capitalize truncate">
                    {planName} Plan
                  </span>
                </div>
              </div>
            </div>
            <span className="rounded-none bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 shrink-0 shadow-2xs">
              Live
            </span>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-5">
          {navItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-2.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {group.group}
              </p>
              <div className="space-y-0.5 pt-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-2.5 py-2 rounded-none text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer active:scale-[0.98]",
                        item.active
                          ? "bg-indigo-50 text-indigo-700 font-semibold ring-1 ring-indigo-600/30 shadow-2xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={cn(
                            "h-4 w-4 shrink-0 transition-colors",
                            item.active ? "text-indigo-600" : "text-slate-400",
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] px-1.5 py-0.5 rounded-none font-bold uppercase tracking-wider shrink-0",
                            item.active
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-slate-100 text-slate-600",
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Featured Tool Launcher: Invoice & POS */}
          <div className="pt-2 px-0.5">
            <div className="rounded-none p-3.5 bg-slate-50 border border-slate-200/80 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="h-7 w-7 rounded-none bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                  <Receipt className="h-3.5 w-3.5" />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-none">
                  Main POS App
                </span>
              </div>
              <h4 className="text-xs font-bold text-slate-900">
                Invoice & Retail Billing
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                Create GST bills, handle offline sales, barcode scanner, and POS counters.
              </p>
              <a
                href="https://invoice.saaszo.in/dashboard"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-none bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 hover:shadow-sm active:scale-[0.98] transition-all duration-150 cursor-pointer"
              >
                <span>Open POS App</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer User Profile & Sign Out */}
        <div className="p-2.5 border-t border-slate-100 bg-slate-50/50 shrink-0 space-y-2">
          <div className="flex items-center justify-between gap-2 px-1.5 py-1">
            <div className="flex items-center gap-2 min-w-0">
              <div className="h-7 w-7 rounded-none bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                {profile?.fullName
                  ? profile.fullName.charAt(0).toUpperCase()
                  : "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {profile?.fullName || "User"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {auth?.email || profile?.phone || "account@saaszo.in"}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              void signOut();
            }}
            className="w-full flex items-center justify-center gap-2 px-2.5 py-1.5 rounded-none text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 bg-white shadow-2xs hover:border-rose-200 transition-all duration-150 cursor-pointer active:scale-[0.98]"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans">
      {/* ── Desktop Pinned Sidebar ───────────────────────────────────── */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 z-30 border-r border-slate-200/80">
        {renderSidebarContent()}
      </aside>

      {/* ── Mobile Off-Canvas Drawer ─────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer panel */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 flex flex-col">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-3 rounded-none p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 z-20 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* ── Main Content Area ───────────────────────────────────────── */}
      <div className="lg:pl-64 flex-1 flex flex-col min-h-screen">
        {/* Top Header / Action Bar */}
        <header className="sticky top-0 z-20 h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between shadow-2xs shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 -ml-1.5 rounded-none text-slate-600 hover:bg-slate-100 hover:text-slate-900 cursor-pointer transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb Title */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 truncate">
              <span className="hover:text-slate-700 cursor-pointer">Dashboard</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-900 font-bold truncate">
                {pageTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Live Workspace Status */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-none bg-emerald-50 border border-emerald-200/60 text-[11px] font-bold text-emerald-700 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Workspace</span>
            </div>

            {/* Open Invoice POS App Button */}
            <a
              href="https://invoice.saaszo.in/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs sm:text-sm shadow-xs active:scale-[0.98] transition-all duration-150 cursor-pointer"
            >
              <Receipt className="h-4 w-4" />
              <span className="hidden sm:inline">Open Invoice POS</span>
              <span className="sm:hidden">Invoice POS</span>
            </a>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
