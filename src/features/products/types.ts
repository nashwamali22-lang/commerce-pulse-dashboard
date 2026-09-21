export interface Product {
  id: string;

  name: string;
  description: string;
  imageUrl: string;

  price: number;

  totalQuantity: number;
  soldQuantity: number;

  categoryId: string;

  /*
   * We keep this because the current analytics/dashboard
   * already uses profit calculations.
   * It can remain 0 until we expose it in the UI.
   */
  profitPercentage: number;

  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  description: string;
  imageUrl: string;

  price: number;

  totalQuantity: number;
  soldQuantity: number;

  categoryId: string;

  profitPercentage: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}
