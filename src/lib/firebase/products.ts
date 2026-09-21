import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';

import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from '@/features/products/types';

import { db } from './config';

const PRODUCTS_COLLECTION = 'products';

type FirestoreProduct = {
  name: string;
  description: string;
  imageUrl: string;

  price: number;

  totalQuantity: number;
  soldQuantity: number;

  categoryId: string;

  profitPercentage?: number;

  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};

function timestampToISOString(timestamp?: Timestamp): string {
  return timestamp
    ? timestamp.toDate().toISOString()
    : new Date().toISOString();
}

export async function getProducts(): Promise<Product[]> {
  const productsQuery = query(
    collection(db, PRODUCTS_COLLECTION),
    orderBy('createdAt', 'desc'),
  );

  const snapshot = await getDocs(productsQuery);

  return snapshot.docs.map((productDoc) => {
    const data = productDoc.data() as FirestoreProduct;

    return {
      id: productDoc.id,

      name: data.name ?? '',
      description: data.description ?? '',
      imageUrl: data.imageUrl ?? '',

      price: Number(data.price ?? 0),

      totalQuantity: Number(data.totalQuantity ?? 0),

      soldQuantity: Number(data.soldQuantity ?? 0),

      categoryId: data.categoryId ?? '',

      profitPercentage: Number(data.profitPercentage ?? 0),

      createdAt: timestampToISOString(data.createdAt),

      updatedAt: timestampToISOString(data.updatedAt),
    };
  });
}

export async function addProduct(product: CreateProductInput): Promise<string> {
  if (product.soldQuantity > product.totalQuantity) {
    throw new Error('Sold quantity cannot exceed total quantity.');
  }

  const result = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return result.id;
}

export async function updateProduct(
  productId: string,
  product: UpdateProductInput,
): Promise<void> {
  if (
    product.totalQuantity !== undefined &&
    product.soldQuantity !== undefined &&
    product.soldQuantity > product.totalQuantity
  ) {
    throw new Error('Sold quantity cannot exceed total quantity.');
  }

  await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
    ...product,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
}
