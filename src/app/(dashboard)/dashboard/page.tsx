'use client';

import {
  Boxes,
  CircleDollarSign,
  PackageCheck,
  Percent,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';

import { useEffect, useRef } from 'react';

import { DashboardHeader, DashboardSidebar } from '@/components/dashboard';

import {
  InventoryDistributionChart,
  KpiCard,
  ProfitMarginChart,
  RevenueOverviewChart,
  SalesByProductChart,
  TopProductsTable,
} from '@/components/dashboard/DashboardAnalytics';

import {
  selectDashboardMetrics,
  selectInventoryDistribution,
  selectRevenueChartData,
  selectSalesChartData,
  selectTopProducts,
} from '@/features/products/dashboardSelectors';

import {
  selectProducts,
  selectProductsError,
  selectProductsLoading,
} from '@/features/products/productSelectors';

import { fetchProducts } from '@/features/products/productsSlice';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function DashboardPage() {
  const dispatch = useAppDispatch();

  const requested = useRef(false);

  const user = useAppSelector((state) => state.auth.user);

  const products = useAppSelector(selectProducts);

  const loading = useAppSelector(selectProductsLoading);

  const error = useAppSelector(selectProductsError);

  const metrics = useAppSelector(selectDashboardMetrics);

  const revenueData = useAppSelector(selectRevenueChartData);

  const salesData = useAppSelector(selectSalesChartData);

  const inventoryData = useAppSelector(selectInventoryDistribution);

  const topProducts = useAppSelector(selectTopProducts);

  useEffect(() => {
    if (requested.current) {
      return;
    }

    requested.current = true;

    void dispatch(fetchProducts());
  }, [dispatch]);

  const initialLoading = loading && products.length === 0;

  function handleRefresh() {
    void dispatch(fetchProducts());
  }

  return (
    <main className="min-h-dvh bg-[#07111f] text-white">
      <div className="flex min-h-dvh">
        <DashboardSidebar email={user?.email} />

        <section className="min-w-0 flex-1 px-4 pb-5 pt-20 sm:px-6 lg:px-8 lg:py-5">
          <div className="mx-auto w-full max-w-[1600px]">
            <DashboardHeader email={user?.email} />

            {error && (
              <div
                role="alert"
                className="mb-5 flex flex-col gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-red-300">
                    Unable to load dashboard data.
                  </p>

                  <p className="mt-1 text-xs text-red-300/70">{error}</p>
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="self-start rounded-lg bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-400/15 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto"
                >
                  Try Again
                </button>
              </div>
            )}

            {initialLoading ? (
              <DashboardSkeleton />
            ) : (
              <>
                <section
                  aria-label="Dashboard metrics"
                  className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6"
                >
                  <KpiCard
                    title="Total Revenue"
                    value={formatCurrency(metrics.totalRevenue)}
                    icon={<CircleDollarSign className="h-5 w-5" />}
                    accent="text-emerald-400"
                  />

                  <KpiCard
                    title="Total Profit"
                    value={formatCurrency(metrics.totalProfit)}
                    icon={<TrendingUp className="h-5 w-5" />}
                    accent="text-violet-400"
                  />

                  <KpiCard
                    title="Units Sold"
                    value={formatNumber(metrics.unitsSold)}
                    icon={<ShoppingCart className="h-5 w-5" />}
                    accent="text-sky-400"
                  />

                  <KpiCard
                    title="Available Stock"
                    value={formatNumber(metrics.availableStock)}
                    icon={<PackageCheck className="h-5 w-5" />}
                    accent="text-teal-400"
                  />

                  <KpiCard
                    title="Total Products"
                    value={formatNumber(metrics.totalProducts)}
                    icon={<Boxes className="h-5 w-5" />}
                    accent="text-fuchsia-400"
                  />

                  <KpiCard
                    title="Avg Profit Margin"
                    value={`${metrics.averageProfitMargin.toFixed(1)}%`}
                    icon={<Percent className="h-5 w-5" />}
                    accent="text-amber-400"
                  />
                </section>

                <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
                  <RevenueOverviewChart data={revenueData} />

                  <SalesByProductChart data={salesData} />
                </section>

                <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[0.85fr_1.4fr_0.85fr]">
                  <InventoryDistributionChart data={inventoryData} />

                  <TopProductsTable products={topProducts} />

                  <ProfitMarginChart
                    margin={metrics.averageProfitMargin}
                    totalRevenue={metrics.totalRevenue}
                    totalProfit={metrics.totalProfit}
                  />
                </section>

                <div className="mt-5 flex flex-col gap-2 rounded-xl border border-white/[0.05] bg-white/[0.015] px-4 py-3 text-[11px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                  <span>
                    Dashboard values are calculated from live Firestore product
                    data.
                  </span>

                  <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="self-start font-medium text-violet-400 transition hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
                  >
                    {loading ? 'Refreshing...' : 'Refresh data'}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <div aria-label="Loading dashboard" className="animate-pulse">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 2xl:grid-cols-6">
        {Array.from({
          length: 6,
        }).map((_, index) => (
          <div
            key={index}
            className="h-[105px] rounded-2xl border border-white/[0.05] bg-[#0b1527]"
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {Array.from({
          length: 2,
        }).map((_, index) => (
          <div
            key={index}
            className="h-[365px] rounded-2xl border border-white/[0.05] bg-[#0b1527]"
          />
        ))}
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[0.85fr_1.4fr_0.85fr]">
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <div
            key={index}
            className="h-[310px] rounded-2xl border border-white/[0.05] bg-[#0b1527]"
          />
        ))}
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}
