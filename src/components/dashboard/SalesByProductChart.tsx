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

type SalesItem = {
  name: string;
  sold: number;
};

type SalesByProductChartProps = {
  data: SalesItem[];
};

export function SalesByProductChart({
  data,
}: SalesByProductChartProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1527] p-5">
      <div className="mb-5">
        <h2 className="font-semibold text-white">
          Sales by Product
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Top products by units sold
        </p>
      </div>

      {data.length === 0 ? (
        <div className="flex h-[280px] items-center justify-center text-sm text-slate-500">
          No sales data available.
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
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: '#64748b',
                  fontSize: 10,
                }}
                tickFormatter={(value: string) =>
                  value.length > 9
                    ? `${value.slice(0, 9)}…`
                    : value
                }
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
                cursor={{
                  fill: 'rgba(255,255,255,0.03)',
                }}
                contentStyle={{
                  background: '#0f172a',
                  border:
                    '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  color: '#fff',
                }}
              />

              <Bar
                dataKey="sold"
                fill="#38bdf8"
                radius={[6, 6, 0, 0]}
                maxBarSize={38}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
