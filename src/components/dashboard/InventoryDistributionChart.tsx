'use client';

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type InventoryItem = {
  name: string;
  value: number;
};

type InventoryDistributionChartProps = {
  data: InventoryItem[];
};

const COLORS = ['#2dd4bf', '#8b5cf6'];

export function InventoryDistributionChart({
  data,
}: InventoryDistributionChartProps) {
  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1527] p-5">
      <div>
        <h2 className="font-semibold text-white">
          Inventory Distribution
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Available stock versus sold units
        </p>
      </div>

      {total === 0 ? (
        <div className="flex h-[260px] items-center justify-center text-sm text-slate-500">
          No inventory data available.
        </div>
      ) : (
        <>
          <div className="relative h-[260px]">
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
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={3}
                  stroke="none"
                >
                  {data.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={
                        COLORS[
                          index % COLORS.length
                        ]
                      }
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border:
                      '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {total.toLocaleString()}
                </p>

                <p className="text-[11px] text-slate-500">
                  Units
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6">
            {data.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center gap-2"
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[
                        index % COLORS.length
                      ],
                  }}
                />

                <div>
                  <p className="text-xs text-slate-400">
                    {item.name}
                  </p>

                  <p className="text-sm font-semibold text-white">
                    {item.value.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}