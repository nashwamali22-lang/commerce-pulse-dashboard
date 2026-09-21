'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package } from 'lucide-react';

import LogoutButton from '@/components/auth/LogoutButton';

type DashboardSidebarProps = {
  email?: string | null;
};

export function DashboardSidebar({ email }: DashboardSidebarProps) {
  const pathname = usePathname();

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

  const initial = email?.charAt(0).toUpperCase() ?? 'U';

  return (
    <aside className="sticky top-0 hidden h-dvh w-[230px] shrink-0 border-r border-white/[0.06] bg-[#07101e] lg:flex lg:flex-col">
      <div className="px-5 py-5">
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
    </aside>
  );
}
