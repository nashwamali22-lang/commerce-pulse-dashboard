import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { getCategories } from '@/lib/firebase/categories';

import type { Category } from './types';

interface CategoriesState {
  items: Category[];
  loading: boolean;
  initialized: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  loading: false,
  initialized: false,
  error: null,
};

export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  {
    rejectValue: string;
  }
>('categories/fetchCategories', async (_, { rejectWithValue }) => {
  try {
    return await getCategories();
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : 'Failed to load categories.',
    );
  }
});

const categoriesSlice = createSlice({
  name: 'categories',

  initialState,

  reducers: {
    clearCategoriesError(state) {
      state.error = null;
    },

    setCategories(state, action: PayloadAction<Category[]>) {
      state.items = action.payload;
      state.initialized = true;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.items = action.payload;
      })

      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload ?? 'Failed to load categories.';
      });
  },
});

export const { clearCategoriesError, setCategories } = categoriesSlice.actions;

export default categoriesSlice.reducer;
