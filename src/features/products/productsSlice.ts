import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  addProduct as addProductToFirestore,
  deleteProduct as deleteProductFromFirestore,
  getProducts,
  updateProduct as updateProductInFirestore,
} from '@/lib/firebase/products';

import type {
  CreateProductInput,
  Product,
  ProductsState,
  UpdateProductInput,
} from './types';

type ProductsSliceState = ProductsState & {
  initialized: boolean;
  mutationLoading: boolean;
};

const initialState: ProductsSliceState = {
  items: [],
  loading: false,
  initialized: false,
  mutationLoading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchProducts', async (_, { rejectWithValue }) => {
  try {
    return await getProducts();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to load products.',
    );
  }
});

export const createProduct = createAsyncThunk<
  Product[],
  CreateProductInput,
  { rejectValue: string }
>('products/createProduct', async (input, { rejectWithValue }) => {
  try {
    await addProductToFirestore(input);

    return await getProducts();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to create product.',
    );
  }
});

export const editProduct = createAsyncThunk<
  Product[],
  {
    id: string;
    changes: UpdateProductInput;
  },
  { rejectValue: string }
>('products/editProduct', async ({ id, changes }, { rejectWithValue }) => {
  try {
    await updateProductInFirestore(id, changes);

    return await getProducts();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to update product.',
    );
  }
});

export const removeProduct = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>('products/removeProduct', async (productId, { rejectWithValue }) => {
  try {
    await deleteProductFromFirestore(productId);

    return await getProducts();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to delete product.',
    );
  }
});

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
        state.initialized = true;
        state.items = action.payload;
      })

      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;

        state.error = action.payload ?? 'Failed to load products.';
      })

      .addCase(createProduct.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.items = action.payload;
      })

      .addCase(createProduct.rejected, (state, action) => {
        state.mutationLoading = false;

        state.error = action.payload ?? 'Failed to create product.';
      })

      .addCase(editProduct.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })

      .addCase(editProduct.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.items = action.payload;
      })

      .addCase(editProduct.rejected, (state, action) => {
        state.mutationLoading = false;

        state.error = action.payload ?? 'Failed to update product.';
      })

      .addCase(removeProduct.pending, (state) => {
        state.mutationLoading = true;
        state.error = null;
      })

      .addCase(removeProduct.fulfilled, (state, action) => {
        state.mutationLoading = false;
        state.items = action.payload;
      })

      .addCase(removeProduct.rejected, (state, action) => {
        state.mutationLoading = false;

        state.error = action.payload ?? 'Failed to delete product.';
      });
  },
});

export const { clearProductsError } = productsSlice.actions;

export default productsSlice.reducer;
