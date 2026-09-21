export type ProductSeed = {
  name: string;
  description: string;
  imageUrl: string;

  price: number;

  totalQuantity: number;
  soldQuantity: number;

  categorySlug:
    | 'mobile'
    | 'laptop'
    | 'tablet';

  profitPercentage: number;
};

export const PRODUCT_SEED_DATA: ProductSeed[] = [
  // =========================
  // Mobile - 8 products
  // =========================

  {
    name: 'Nova X Pro',
    description:
      'Flagship smartphone with premium performance and an advanced camera system.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 1099,
    totalQuantity: 80,
    soldQuantity: 52,
    categorySlug: 'mobile',
    profitPercentage: 26,
  },
  {
    name: 'Nova X',
    description:
      'Balanced smartphone with excellent performance for everyday use.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 799,
    totalQuantity: 120,
    soldQuantity: 84,
    categorySlug: 'mobile',
    profitPercentage: 23,
  },
  {
    name: 'PixelEdge Mini',
    description:
      'Compact smartphone with a bright display and dependable battery life.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 599,
    totalQuantity: 100,
    soldQuantity: 67,
    categorySlug: 'mobile',
    profitPercentage: 21,
  },
  {
    name: 'Nova Lite',
    description:
      'Affordable smartphone designed for daily communication and entertainment.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 449,
    totalQuantity: 150,
    soldQuantity: 116,
    categorySlug: 'mobile',
    profitPercentage: 18,
  },
  {
    name: 'Nova Ultra',
    description:
      'Premium large-screen smartphone for photography and productivity.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 1299,
    totalQuantity: 65,
    soldQuantity: 43,
    categorySlug: 'mobile',
    profitPercentage: 29,
  },
  {
    name: 'PixelEdge Max',
    description:
      'Large smartphone with high-end display and long-lasting battery.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 899,
    totalQuantity: 90,
    soldQuantity: 79,
    categorySlug: 'mobile',
    profitPercentage: 24,
  },
  {
    name: 'Nova SE',
    description:
      'Mid-range smartphone with smooth performance and a modern design.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 649,
    totalQuantity: 110,
    soldQuantity: 73,
    categorySlug: 'mobile',
    profitPercentage: 20,
  },
  {
    name: 'PixelEdge Pro',
    description:
      'High-end smartphone built for photography, gaming and productivity.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 1199,
    totalQuantity: 70,
    soldQuantity: 61,
    categorySlug: 'mobile',
    profitPercentage: 28,
  },

  // =========================
  // Laptop - 8 products
  // =========================

  {
    name: 'AeroBook Pro 14',
    description:
      'Professional laptop for software development and creative workflows.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 1499,
    totalQuantity: 60,
    soldQuantity: 34,
    categorySlug: 'laptop',
    profitPercentage: 27,
  },
  {
    name: 'AeroBook Air',
    description:
      'Lightweight laptop with long battery life for mobile professionals.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 1099,
    totalQuantity: 85,
    soldQuantity: 58,
    categorySlug: 'laptop',
    profitPercentage: 22,
  },
  {
    name: 'TitanBook Gaming',
    description:
      'High-performance gaming laptop with dedicated graphics.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 1899,
    totalQuantity: 45,
    soldQuantity: 36,
    categorySlug: 'laptop',
    profitPercentage: 31,
  },
  {
    name: 'WorkMate 15',
    description:
      'Reliable business laptop for office and remote work.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 899,
    totalQuantity: 110,
    soldQuantity: 64,
    categorySlug: 'laptop',
    profitPercentage: 20,
  },
  {
    name: 'CreatorBook 16',
    description:
      'Performance laptop designed for video editing and content creation.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 1699,
    totalQuantity: 50,
    soldQuantity: 21,
    categorySlug: 'laptop',
    profitPercentage: 28,
  },
  {
    name: 'AeroBook Mini',
    description:
      'Compact laptop for students, browsing and everyday productivity.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 699,
    totalQuantity: 130,
    soldQuantity: 124,
    categorySlug: 'laptop',
    profitPercentage: 17,
  },
  {
    name: 'WorkMate Pro',
    description:
      'Business-focused laptop with enhanced multitasking performance.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 1199,
    totalQuantity: 75,
    soldQuantity: 48,
    categorySlug: 'laptop',
    profitPercentage: 23,
  },
  {
    name: 'TitanBook X',
    description:
      'Premium gaming laptop with high refresh-rate display and powerful graphics.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 2199,
    totalQuantity: 35,
    soldQuantity: 27,
    categorySlug: 'laptop',
    profitPercentage: 33,
  },

  // =========================
  // Tablet - 8 products
  // =========================

  {
    name: 'TabVision Pro 12',
    description:
      'Premium tablet with large display for productivity and entertainment.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 899,
    totalQuantity: 75,
    soldQuantity: 49,
    categorySlug: 'tablet',
    profitPercentage: 25,
  },
  {
    name: 'TabVision Air',
    description:
      'Slim lightweight tablet for browsing, media and daily productivity.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 649,
    totalQuantity: 105,
    soldQuantity: 76,
    categorySlug: 'tablet',
    profitPercentage: 22,
  },
  {
    name: 'TabVision Mini',
    description:
      'Portable compact tablet for reading and media consumption.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 449,
    totalQuantity: 140,
    soldQuantity: 132,
    categorySlug: 'tablet',
    profitPercentage: 19,
  },
  {
    name: 'TabVision Studio',
    description:
      'Creative tablet with stylus support and color-accurate display.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 1099,
    totalQuantity: 55,
    soldQuantity: 33,
    categorySlug: 'tablet',
    profitPercentage: 27,
  },
  {
    name: 'TabVision Max',
    description:
      'Large-screen tablet designed for presentations and multitasking.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 1199,
    totalQuantity: 40,
    soldQuantity: 40,
    categorySlug: 'tablet',
    profitPercentage: 30,
  },
  {
    name: 'TabVision Lite',
    description:
      'Affordable tablet for students, families and casual use.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 349,
    totalQuantity: 160,
    soldQuantity: 103,
    categorySlug: 'tablet',
    profitPercentage: 16,
  },
  {
    name: 'TabVision Plus',
    description:
      'Versatile tablet with balanced performance for work and entertainment.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 749,
    totalQuantity: 95,
    soldQuantity: 62,
    categorySlug: 'tablet',
    profitPercentage: 23,
  },
  {
    name: 'TabVision Go',
    description:
      'Portable entry-level tablet for browsing, learning and streaming.',
    imageUrl:
      '/products/product-placeholder.svg',
    price: 299,
    totalQuantity: 180,
    soldQuantity: 171,
    categorySlug: 'tablet',
    profitPercentage: 15,
  },
];
