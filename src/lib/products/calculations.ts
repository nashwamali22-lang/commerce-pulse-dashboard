import type { Product } from '@/features/products/types';

export function getAvailableQuantity(
  product: Pick<Product, 'totalQuantity' | 'soldQuantity'>,
): number {
  return Math.max(product.totalQuantity - product.soldQuantity, 0);
}

export function getProductRevenue(
  product: Pick<Product, 'price' | 'soldQuantity'>,
): number {
  return product.price * product.soldQuantity;
}

export function getProfitPerUnit(
  product: Pick<Product, 'price' | 'profitPercentage'>,
): number {
  return product.price * (product.profitPercentage / 100);
}

export function getProductProfit(
  product: Pick<Product, 'price' | 'soldQuantity' | 'profitPercentage'>,
): number {
  return getProfitPerUnit(product) * product.soldQuantity;
}
