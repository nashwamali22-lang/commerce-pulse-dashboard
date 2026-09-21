import {
  browserLocalPersistence,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';

import { auth } from './config';

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<User> {
  await setPersistence(auth, browserLocalPersistence);

  const credential = await signInWithEmailAndPassword(auth, email, password);

  return credential.user;
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}
