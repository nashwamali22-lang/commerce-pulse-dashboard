import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store';
import {
  getAvailableQuantity,
  getProductProfit,
  getProductRevenue,
} from '@/lib/products/calculations';

const selectProducts = (state: RootState) =>
  state.products.items;

export const selectDashboardMetrics = createSelector(
  [selectProducts],
  (products) => {
    const totalProducts = products.length;

    const totalRevenue = products.reduce(
      (sum, product) =>
        sum + getProductRevenue(product),
      0
    );

    const totalProfit = products.reduce(
      (sum, product) =>
        sum + getProductProfit(product),
      0
    );

    const unitsSold = products.reduce(
      (sum, product) =>
        sum + product.soldQuantity,
      0
    );

    const availableStock = products.reduce(
      (sum, product) =>
        sum + getAvailableQuantity(product),
      0
    );

    const totalInventory = products.reduce(
      (sum, product) =>
        sum + product.totalQuantity,
      0
    );

    const averageProfitMargin =
      totalProducts === 0
        ? 0
        : products.reduce(
            (sum, product) =>
              sum + product.profitPercentage,
            0
          ) / totalProducts;

    return {
      totalProducts,
      totalRevenue,
      totalProfit,
      unitsSold,
      availableStock,
      totalInventory,
      averageProfitMargin,
    };
  }
);

export const selectRevenueChartData = createSelector(
  [selectProducts],
  (products) =>
    [...products]
      .sort(
        (a, b) =>
          getProductRevenue(b) -
          getProductRevenue(a)
      )
      .slice(0, 8)
      .map((product) => ({
        id: product.id,
        name: product.name,
        revenue: getProductRevenue(product),
      }))
);

export const selectSalesChartData = createSelector(
  [selectProducts],
  (products) =>
    [...products]
      .sort(
        (a, b) =>
          b.soldQuantity - a.soldQuantity
      )
      .slice(0, 6)
      .map((product) => ({
        id: product.id,
        name: product.name,
        sold: product.soldQuantity,
      }))
);

export const selectInventoryDistribution =
  createSelector(
    [selectProducts],
    (products) => {
      const available = products.reduce(
        (sum, product) =>
          sum +
          getAvailableQuantity(product),
        0
      );

      const sold = products.reduce(
        (sum, product) =>
          sum + product.soldQuantity,
        0
      );

      return [
        {
          name: 'Available',
          value: available,
        },
        {
          name: 'Sold',
          value: sold,
        },
      ];
    }
  );

export const selectTopProducts = createSelector(
  [selectProducts],
  (products) =>
    [...products]
      .sort(
        (a, b) =>
          b.soldQuantity - a.soldQuantity
      )
      .slice(0, 5)
      .map((product) => ({
        id: product.id,
        name: product.name,
        unitsSold: product.soldQuantity,
        revenue: getProductRevenue(product),
      }))
);