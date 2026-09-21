'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type RevenueChartItem = {
  name: string;
  revenue: number;
};

type RevenueOverviewChartProps = {
  data: RevenueChartItem[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function RevenueOverviewChart({
  data,
}: RevenueOverviewChartProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1527] p-5">
      <div className="mb-5">
        <h2 className="font-semibold text-white">Revenue by Product</h2>

        <p className="mt-1 text-xs text-slate-500">
          Highest revenue generating products
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-slate-500">
          No revenue data available.
        </div>
      ) : (
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 5,
                left: -10,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="rgba(148,163,184,0.08)"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fill: '#64748b',
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
                interval={0}
                tickFormatter={(value: string) =>
                  value.length > 11 ? `${value.slice(0, 11)}…` : value
                }
              />

              <YAxis
                tick={{
                  fill: '#64748b',
                  fontSize: 10,
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value: number) => formatCurrency(value)}
              />

              <Tooltip
                cursor={{
                  fill: 'rgba(255,255,255,0.03)',
                }}
                contentStyle={{
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
                formatter={(value) => [
                  formatCurrency(Number(value)),
                  'Revenue',
                ]}
              />

              <Bar
                dataKey="revenue"
                fill="#8b5cf6"
                radius={[6, 6, 0, 0]}
                maxBarSize={42}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
