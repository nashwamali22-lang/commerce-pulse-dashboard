import type { Product } from '@/features/products/types';

export function getAvailableQuantity(product: Product): number {
  return Math.max(product.totalQuantity - product.soldQuantity, 0);
}

export function getProfitPerUnit(product: Product): number {
  return product.price * (product.profitPercentage / 100);
}

export function getProductRevenue(product: Product): number {
  return product.price * product.soldQuantity;
}

export function getProductProfit(product: Product): number {
  return getProfitPerUnit(product) * product.soldQuantity;
}

export function getInventoryValue(product: Product): number {
  return product.price * getAvailableQuantity(product);
}
