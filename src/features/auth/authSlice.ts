import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { AuthState, AuthUser } from './types';

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.loading = false;
      state.initialized = true;
      state.error = null;
    },

    setAuthInitialized(state) {
      state.initialized = true;
      state.loading = false;
    },

    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
      state.loading = false;
    },

    clearAuthError(state) {
      state.error = null;
    },

    resetAuth(state) {
      state.user = null;
      state.loading = false;
      state.initialized = true;
      state.error = null;
    },
  },
});

export const {
  setAuthLoading,
  setUser,
  setAuthInitialized,
  setAuthError,
  clearAuthError,
  resetAuth,
} = authSlice.actions;

export default authSlice.reducer;
