import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getProducts } from '@/lib/firebase/products';

import type { Product, ProductsState } from './types';

const initialState: ProductsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<Product[]>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      return await getProducts();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to load products.';

      return rejectWithValue(message);
    }
  },
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Failed to load products.';
      });
  },
});

export const { clearProductsError } = productsSlice.actions;

export default productsSlice.reducer;
