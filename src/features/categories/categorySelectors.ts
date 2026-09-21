import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '@/store';

export const selectCategories = (
  state: RootState
) => state.categories.items;

export const selectCategoriesLoading = (
  state: RootState
) => state.categories.loading;

export const selectCategoriesInitialized = (
  state: RootState
) => state.categories.initialized;

export const selectCategoriesError = (
  state: RootState
) => state.categories.error;

export const selectCategoryMap =
  createSelector(
    [selectCategories],
    (categories) =>
      Object.fromEntries(
        categories.map((category) => [
          category.id,
          category,
        ])
      )
  );
