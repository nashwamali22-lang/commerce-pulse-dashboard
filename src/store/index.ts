import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/features/auth/authSlice';
import categoriesReducer from '@/features/categories/categoriesSlice';
import productsReducer from '@/features/products/productsSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      products: productsReducer,
      categories: categoriesReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;

export type AppDispatch = AppStore['dispatch'];
