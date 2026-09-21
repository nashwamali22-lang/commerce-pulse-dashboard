import type { RootState } from '@/store';

export const selectProducts = (state: RootState) => state.products.items;

export const selectProductsLoading = (state: RootState) =>
  state.products.loading;

export const selectProductsMutationLoading = (state: RootState) =>
  state.products.mutationLoading;

export const selectProductsInitialized = (state: RootState) =>
  state.products.initialized;

export const selectProductsError = (state: RootState) => state.products.error;

export const selectProductsCount = (state: RootState) =>
  state.products.items.length;
