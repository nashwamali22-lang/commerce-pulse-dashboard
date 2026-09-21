import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import { auth, db } from './config';

const DEFAULT_CATEGORIES = [
  {
    name: 'Mobile',
    slug: 'mobile',
  },
  {
    name: 'Laptop',
    slug: 'laptop',
  },
  {
    name: 'Tablet',
    slug: 'tablet',
  },
] as const;

export async function seedCategories() {
  if (!auth.currentUser) {
    throw new Error(
      'You must be logged in before initializing categories.'
    );
  }

  const categoriesRef =
    collection(db, 'categories');

  const snapshot =
    await getDocs(categoriesRef);

  const existingSlugs =
    new Set(
      snapshot.docs
        .map((categoryDoc) => {
          const data =
            categoryDoc.data() as {
              slug?: string;
            };

          return data.slug;
        })
        .filter(
          (
            slug
          ): slug is string =>
            Boolean(slug)
        )
    );

  const missing =
    DEFAULT_CATEGORIES.filter(
      (category) =>
        !existingSlugs.has(
          category.slug
        )
    );

  if (missing.length === 0) {
    return {
      inserted: 0,
      skipped: true,
    };
  }

  const batch =
    writeBatch(db);

  for (const category of missing) {
    const categoryRef =
      doc(categoriesRef);

    batch.set(
      categoryRef,
      {
        ...category,

        createdAt:
          serverTimestamp(),

        updatedAt:
          serverTimestamp(),
      }
    );
  }

  await batch.commit();

  return {
    inserted: missing.length,
    skipped: false,
  };
}
