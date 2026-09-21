'use client';

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
} from 'recharts';

type ProfitMarginChartProps = {
  margin: number;
};

export  function ProfitMarginChart({
  margin,
}: ProfitMarginChartProps) {
  const normalizedMargin = Math.min(
    Math.max(margin, 0),
    100
  );

  const data = [
    {
      name: 'Profit Margin',
      value: normalizedMargin,
    },
    {
      name: 'Remaining',
      value: 100 - normalizedMargin,
    },
  ];

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1527] p-5">
      <div>
        <h2 className="font-semibold text-white">
          Profit Margin
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Average margin across all products
        </p>
      </div>

      <div className="relative h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={67}
              outerRadius={92}
              startAngle={90}
              endAngle={-270}
              stroke="none"
            >
              <Cell fill="#8b5cf6" />
              <Cell fill="rgba(148,163,184,0.10)" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">
              {normalizedMargin.toFixed(1)}%
            </p>

            <p className="mt-1 text-[10px] text-slate-500">
              Avg. Margin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}