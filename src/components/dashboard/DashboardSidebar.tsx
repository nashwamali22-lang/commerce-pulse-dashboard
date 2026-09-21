'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';

import { LayoutDashboard, Menu, Package, X } from 'lucide-react';

import { usePathname } from 'next/navigation';

import LogoutButton from '@/components/auth/LogoutButton';

type DashboardSidebarProps = {
  email?: string | null;
};

const navigation = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Products',
    href: '/products',
    icon: Package,
  },
];

export function DashboardSidebar({ email }: DashboardSidebarProps) {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);

  const initial = email?.charAt(0).toUpperCase() ?? 'U';

  /*
   * Prevent background scrolling
   * while the mobile drawer is open.
   */
  useEffect(() => {
    if (!mobileOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    }

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener('keydown', handleEscape);
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Mobile top navigation */}

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#07101e]/95 px-4 backdrop-blur-xl lg:hidden">
        <Logo />

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile overlay */}

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile drawer */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col border-r border-white/[0.07] bg-[#07101e] shadow-2xl shadow-black/50 transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer header */}

        <div className="flex h-16 items-center justify-between border-b border-white/[0.06] px-4">
          <Logo />

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile navigation */}

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
            Navigation
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${
                    active
                      ? 'bg-violet-600 text-white shadow-[0_10px_30px_rgba(124,58,237,.22)]'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />

                  {item.label}

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile user */}

        <UserSection email={email} initial={initial} />
      </aside>

      {/* Desktop sidebar */}

      <aside className="sticky top-0 hidden h-dvh w-[230px] shrink-0 border-r border-white/[0.06] bg-[#07101e] lg:flex lg:flex-col">
        <div className="px-5 py-5">
          <Logo />
        </div>

        <nav className="flex-1 px-3 py-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex h-10 items-center gap-3 rounded-lg px-3 text-sm transition ${
                    active
                      ? 'bg-violet-600 text-white shadow-[0_8px_20px_rgba(124,58,237,.22)]'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4" />

                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        <UserSection email={email} initial={initial} />
      </aside>
    </>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div aria-hidden="true" className="relative h-9 w-9">
        <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 -rotate-[28deg] rounded-lg bg-gradient-to-br from-violet-400 to-violet-700" />

        <div className="absolute bottom-0 left-0 h-3.5 w-6 rotate-[8deg] rounded-md bg-fuchsia-500" />
      </div>

      <p className="text-lg font-bold tracking-tight text-white">
        Stock
        <span className="text-violet-400">Pro</span>
      </p>
    </div>
  );
}

function UserSection({
  email,
  initial,
}: {
  email?: string | null;
  initial: string;
}) {
  return (
    <div className="border-t border-white/[0.06] p-3">
      <div className="mb-3 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] p-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-600/20 text-xs font-bold text-violet-300">
          {initial}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] text-slate-500">Signed in as</p>

          <p className="truncate text-xs font-medium text-slate-200">
            {email ?? 'User'}
          </p>
        </div>
      </div>

      <LogoutButton />
    </div>
  );
}
