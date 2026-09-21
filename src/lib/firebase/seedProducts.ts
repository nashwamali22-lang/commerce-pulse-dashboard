import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';

import { PRODUCT_SEED_DATA } from '@/lib/products/seedData';

import { auth, db } from './config';

export async function seedProducts() {
  if (!auth.currentUser) {
    throw new Error('You must be logged in before seeding products.');
  }

  const productsRef = collection(db, 'products');

  const existingProducts = await getDocs(productsRef);

  if (!existingProducts.empty) {
    return {
      inserted: 0,
      skipped: true,
    };
  }

  const categoriesSnapshot = await getDocs(collection(db, 'categories'));

  const categoryMap = new Map<string, string>();

  categoriesSnapshot.docs.forEach((categoryDoc) => {
    const data = categoryDoc.data() as {
      slug?: string;
    };

    if (data.slug) {
      categoryMap.set(data.slug, categoryDoc.id);
    }
  });

  for (const slug of ['mobile', 'laptop', 'tablet']) {
    if (!categoryMap.has(slug)) {
      throw new Error(`Missing required category: ${slug}`);
    }
  }

  const batch = writeBatch(db);

  for (const seed of PRODUCT_SEED_DATA) {
    const categoryId = categoryMap.get(seed.categorySlug);

    if (!categoryId) {
      throw new Error(`Category not found: ${seed.categorySlug}`);
    }

    batch.set(doc(productsRef), {
      name: seed.name,

      description: seed.description,

      imageUrl: seed.imageUrl,

      price: seed.price,

      totalQuantity: seed.totalQuantity,

      soldQuantity: seed.soldQuantity,

      categoryId,

      profitPercentage: seed.profitPercentage,

      source: 'demo',

      createdAt: serverTimestamp(),

      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();

  return {
    inserted: PRODUCT_SEED_DATA.length,

    skipped: false,
  };
}
