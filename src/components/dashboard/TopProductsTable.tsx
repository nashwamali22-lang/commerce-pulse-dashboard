'use client';

import Image from 'next/image';

type TopProduct = {
  id: string;
  name: string;
  unitsSold: number;
  revenue: number;
  imageUrl: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function TopProductsTable({
  products,
}: {
  products: TopProduct[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1527] p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-white">Top Performing Products</h2>

          <p className="mt-1 text-xs text-slate-500">Ranked by units sold</p>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="flex h-[260px] items-center justify-center text-sm text-slate-500">
          No product data available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] text-left">
            <thead>
              <tr className="border-b border-white/10 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="pb-3 font-medium">#</th>

                <th className="pb-3 font-medium">Product</th>

                <th className="pb-3 text-right font-medium">Units Sold</th>

                <th className="pb-3 text-right font-medium">Revenue</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className="border-b border-white/[0.06] last:border-0"
                >
                  <td className="py-3 text-sm text-slate-500">{index + 1}</td>

                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={product.imageUrl}
                        alt=""
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-lg bg-white/5 object-cover"
                      />

                      <span className="max-w-[160px] truncate text-sm font-medium text-white">
                        {product.name}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 text-right text-sm text-slate-300">
                    {product.unitsSold.toLocaleString()}
                  </td>

                  <td className="py-3 text-right text-sm font-medium text-white">
                    {formatCurrency(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
