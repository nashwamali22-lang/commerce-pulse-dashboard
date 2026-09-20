'use client';

import { useEffect, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/lib/firebase/config';
import {
  setAuthError,
  setAuthInitialized,
  setAuthLoading,
  setUser,
} from '@/features/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setAuthLoading(true));

    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        if (!firebaseUser) {
          dispatch(setUser(null));
          return;
        }

        dispatch(
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          }),
        );
      },
      () => {
        dispatch(
          setAuthError('Unable to restore your session. Please sign in again.'),
        );
        dispatch(setAuthInitialized());
      },
    );

    return unsubscribe;
  }, [dispatch]);

  return children;
}
