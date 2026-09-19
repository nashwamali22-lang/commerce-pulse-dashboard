'use client';

import { useEffect, type ReactNode } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '@/lib/firebase/config';
import { setUser } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/store/hooks';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
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
    });

    return unsubscribe;
  }, [dispatch]);

  return children;
}
