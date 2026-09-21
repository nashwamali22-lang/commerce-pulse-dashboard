import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';

import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/features/categories/types';

import { db } from './config';

const CATEGORIES_COLLECTION = 'categories';
const PRODUCTS_COLLECTION = 'products';

type FirestoreCategory = {
  name: string;
  slug: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

function timestampToISOString(
  timestamp?: Timestamp
): string {
  return timestamp
    ? timestamp.toDate().toISOString()
    : new Date().toISOString();
}

export async function getCategories(): Promise<Category[]> {
  const categoriesQuery = query(
    collection(db, CATEGORIES_COLLECTION),
    orderBy('name', 'asc')
  );

  const snapshot =
    await getDocs(categoriesQuery);

  return snapshot.docs.map((categoryDoc) => {
    const data =
      categoryDoc.data() as FirestoreCategory;

    return {
      id: categoryDoc.id,
      name: data.name,
      slug: data.slug,
      createdAt: timestampToISOString(
        data.createdAt
      ),
      updatedAt: timestampToISOString(
        data.updatedAt
      ),
    };
  });
}

export async function addCategory(
  category: CreateCategoryInput
): Promise<string> {
  const result = await addDoc(
    collection(db, CATEGORIES_COLLECTION),
    {
      ...category,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );

  return result.id;
}

export async function updateCategory(
  categoryId: string,
  category: UpdateCategoryInput
): Promise<void> {
  await updateDoc(
    doc(
      db,
      CATEGORIES_COLLECTION,
      categoryId
    ),
    {
      ...category,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function deleteCategory(
  categoryId: string
): Promise<void> {
  const usedCategoryQuery = query(
    collection(db, PRODUCTS_COLLECTION),
    where('categoryId', '==', categoryId),
    limit(1)
  );

  const products =
    await getDocs(usedCategoryQuery);

  if (!products.empty) {
    throw new Error(
      'This category cannot be deleted because it is currently assigned to one or more products.'
    );
  }

  await deleteDoc(
    doc(
      db,
      CATEGORIES_COLLECTION,
      categoryId
    )
  );
}
