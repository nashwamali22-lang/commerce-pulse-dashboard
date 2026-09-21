'use client';

import Link from 'next/link';
import { LayoutDashboard, Package } from 'lucide-react';

type DashboardHeaderProps = {
  email?: string | null;
  displayName?: string | null;
};

export function DashboardHeader({ email, displayName }: DashboardHeaderProps) {
  const fallbackName = email?.split('@')[0]?.replace(/[._-]/g, ' ') ?? 'User';

  const name = displayName?.trim() || fallbackName;

  return (
    <header className="mb-5">
      <div className="mb-4 flex items-center justify-between lg:hidden">
        <p className="text-lg font-bold text-white">
          Stock
          <span className="text-violet-400">Pro</span>
        </p>

        <nav className="flex gap-2">
          <Link
            href="/dashboard"
            aria-label="Overview"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-[#0b1527] text-slate-300"
          >
            <LayoutDashboard className="h-4 w-4" />
          </Link>

          <Link
            href="/products"
            aria-label="Products"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-[#0b1527] text-slate-300"
          >
            <Package className="h-4 w-4" />
          </Link>
        </nav>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-white">
            Welcome back, <span className="capitalize">{name}</span> 👋
          </h1>

          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Here&apos;s what&apos;s happening with your products today.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.05] px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />

              <span className="text-[11px] font-medium text-emerald-300">
                Live Firestore Data
              </span>
            </div>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-violet-500/15 text-xs font-bold text-violet-300">
            {name.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}
