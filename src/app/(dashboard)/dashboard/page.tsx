'use client';

import LogoutButton from '@/components/auth/LogoutButton';
import { useAppSelector } from '@/store/hooks';

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">CommercePulse Dashboard</h1>

            <p className="mt-2 text-slate-400">Logged in as {user?.email}</p>
          </div>

          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
