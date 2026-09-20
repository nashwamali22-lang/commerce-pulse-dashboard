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

interface FirestoreProduct {
  name: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  category: string;
  price: number;
  totalQuantity: number;
  soldQuantity: number;
  profitPercentage: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
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
      name: data.name,
      description: data.description,
      imageUrl: data.imageUrl,
      productUrl: data.productUrl,
      category: data.category,
      price: data.price,
      totalQuantity: data.totalQuantity,
      soldQuantity: data.soldQuantity,
      profitPercentage: data.profitPercentage,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
    };
  });
}

export async function addProduct(product: CreateProductInput): Promise<string> {
  const document = await addDoc(collection(db, PRODUCTS_COLLECTION), {
    ...product,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return document.id;
}

export async function updateProduct(
  productId: string,
  product: UpdateProductInput,
): Promise<void> {
  await updateDoc(doc(db, PRODUCTS_COLLECTION, productId), {
    ...product,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, productId));
}
