'use client';

import type { ReactNode } from 'react';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type KpiCardProps = {
  title: string;
  value: string;
  icon: ReactNode;
  accent?: string;
};

export function KpiCard({
  title,
  value,
  icon,
  accent = 'text-violet-400',
}: KpiCardProps) {
  return (
    <article className="rounded-2xl border border-white/[0.07] bg-[#0b1527] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 truncate text-[22px] font-bold tracking-[-0.03em] text-white">
            {value}
          </p>
        </div>

        <div
          className={`rounded-lg bg-white/[0.04] p-2 ${accent}`}
        >
          {icon}
        </div>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Revenue Chart                                 */
/* -------------------------------------------------------------------------- */

type RevenuePoint = {
  id: string;
  name: string;
  revenue: number;
};

export function RevenueOverviewChart({
  data,
}: {
  data: RevenuePoint[];
}) {
  return (
    <article className="rounded-2xl border border-white/[0.07] bg-[#0b1527] p-4 sm:p-5">
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-white">
          Revenue Overview
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Revenue by top-performing products
        </p>
      </div>

      {data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <div className="h-[270px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 8,
                left: -15,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.45}
                  />

                  <stop
                    offset="100%"
                    stopColor="#8b5cf6"
                    stopOpacity={0.02}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="rgba(148,163,184,0.08)"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#64748b',
                  fontSize: 10,
                }}
                tickFormatter={shortName}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#64748b',
                  fontSize: 10,
                }}
                tickFormatter={compactNumber}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f1b2f',
                  border:
                    '1px solid rgba(255,255,255,.08)',
                  borderRadius: '12px',
                  color: '#ffffff',
                }}
              />

              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                                Sales Chart                                 */
/* -------------------------------------------------------------------------- */

type SalesPoint = {
  id: string;
  name: string;
  sold: number;
};

const BAR_COLORS = [
  '#8b5cf6',
  '#38bdf8',
  '#a855f7',
  '#fb7185',
  '#2dd4bf',
  '#fbbf24',
];

export function SalesByProductChart({
  data,
}: {
  data: SalesPoint[];
}) {
  return (
    <article className="rounded-2xl border border-white/[0.07] bg-[#0b1527] p-4 sm:p-5">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Sales by Product
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Top 6 products
          </p>
        </div>

        <span className="rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-400">
          Units Sold
        </span>
      </div>

      {data.length === 0 ? (
        <ChartEmptyState />
      ) : (
        <div className="h-[270px] w-full">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 5,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid
                vertical={false}
                stroke="rgba(148,163,184,0.08)"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#64748b',
                  fontSize: 9,
                }}
                tickFormatter={shortName}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#64748b',
                  fontSize: 10,
                }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f1b2f',
                  border:
                    '1px solid rgba(255,255,255,.08)',
                  borderRadius: '12px',
                  color: '#ffffff',
                }}
              />

              <Bar
                dataKey="sold"
                name="Units Sold"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              >
                {data.map((product, index) => (
                  <Cell
                    key={product.id}
                    fill={
                      BAR_COLORS[
                        index % BAR_COLORS.length
                      ]
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Inventory Distribution                             */
/* -------------------------------------------------------------------------- */

type InventoryPoint = {
  name: string;
  value: number;
};

const INVENTORY_COLORS: Record<
  string,
  string
> = {
  Available: '#2dd4bf',
  Sold: '#8b5cf6',
};

export function InventoryDistributionChart({
  data,
}: {
  data: InventoryPoint[];
}) {
  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <article className="rounded-2xl border border-white/[0.07] bg-[#0b1527] p-4">
      <h2 className="text-sm font-semibold text-white">
        Inventory Distribution
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        Available vs sold units
      </p>

      {total === 0 ? (
        <ChartEmptyState compact />
      ) : (
        <>
          <div className="relative h-[200px]">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={54}
                  outerRadius={76}
                  paddingAngle={3}
                  stroke="none"
                >
                  {data.map((item) => (
                    <Cell
                      key={item.name}
                      fill={
                        INVENTORY_COLORS[
                          item.name
                        ] ?? '#64748b'
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f1b2f',
                    border:
                      '1px solid rgba(255,255,255,.08)',
                    borderRadius: '12px',
                    color: '#ffffff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-bold text-white">
                  {total.toLocaleString()}
                </p>

                <p className="text-[10px] text-slate-500">
                  Total Units
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {data.map((item) => {
              const percentage =
                total === 0
                  ? 0
                  : (item.value / total) * 100;

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-400">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{
                        backgroundColor:
                          INVENTORY_COLORS[
                            item.name
                          ],
                      }}
                    />

                    {item.name}
                  </div>

                  <div className="flex gap-3">
                    <span className="font-medium text-white">
                      {item.value.toLocaleString()}
                    </span>

                    <span className="w-10 text-right text-slate-500">
                      {percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Top Products                                   */
/* -------------------------------------------------------------------------- */

type TopProduct = {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
};

export function TopProductsTable({
  products,
}: {
  products: TopProduct[];
}) {
  return (
    <article className="rounded-2xl border border-white/[0.07] bg-[#0b1527] p-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-white">
            Top Performing Products
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Ranked by units sold
          </p>
        </div>

        <a
          href="/products"
          className="text-[11px] font-medium text-violet-400 hover:text-violet-300"
        >
          View All
        </a>
      </div>

      {products.length === 0 ? (
        <ChartEmptyState compact />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[430px]">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-[10px] uppercase tracking-wider text-slate-600">
                <th className="pb-2 font-medium">
                  #
                </th>

                <th className="pb-2 font-medium">
                  Product
                </th>

                <th className="pb-2 text-right font-medium">
                  Sold
                </th>

                <th className="pb-2 text-right font-medium">
                  Revenue
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map(
                (product, index) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/[0.045] last:border-0"
                  >
                    <td className="py-2.5 text-xs text-slate-600">
                      {index + 1}
                    </td>

                    <td className="py-2.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-400/10 text-xs font-bold text-violet-300">
                          {product.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <span className="max-w-[160px] truncate text-xs font-medium text-slate-200">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="py-2.5 text-right text-xs text-slate-300">
                      {product.unitsSold.toLocaleString()}
                    </td>

                    <td className="py-2.5 text-right text-xs font-medium text-white">
                      {formatCurrency(
                        product.revenue
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Profit Margin                                 */
/* -------------------------------------------------------------------------- */

export function ProfitMarginChart({
  margin,
  totalRevenue,
  totalProfit,
}: {
  margin: number;
  totalRevenue: number;
  totalProfit: number;
}) {
  const normalized = Math.min(
    Math.max(margin, 0),
    100
  );

  const data = [
    {
      name: 'Margin',
      value: normalized,
    },
    {
      name: 'Remaining',
      value: 100 - normalized,
    },
  ];

  return (
    <article className="rounded-2xl border border-white/[0.07] bg-[#0b1527] p-4">
      <h2 className="text-sm font-semibold text-white">
        Profit Margin
      </h2>

      <p className="mt-1 text-xs text-slate-500">
        Average across products
      </p>

      <div className="relative h-[190px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={53}
              outerRadius={74}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill="#8b5cf6" />
              <Cell fill="#fb7185" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-xl font-bold text-white">
              {normalized.toFixed(1)}%
            </p>

            <p className="text-[9px] text-slate-500">
              Avg. Margin
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        <MetricLine
          label="Revenue"
          value={formatCurrency(
            totalRevenue
          )}
          color="#2dd4bf"
        />

        <MetricLine
          label="Profit"
          value={formatCurrency(
            totalProfit
          )}
          color="#8b5cf6"
        />
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Helpers                                    */
/* -------------------------------------------------------------------------- */

function MetricLine({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-400">
        <span
          className="h-2 w-2 rounded-full"
          style={{
            backgroundColor: color,
          }}
        />

        {label}
      </div>

      <span className="font-medium text-white">
        {value}
      </span>
    </div>
  );
}

function ChartEmptyState({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center text-center text-xs text-slate-500 ${
        compact
          ? 'h-[190px]'
          : 'h-[270px]'
      }`}
    >
      No product data available.
    </div>
  );
}

function shortName(value: string) {
  if (value.length <= 10) {
    return value;
  }

  return `${value.slice(0, 9)}…`;
}

function compactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}