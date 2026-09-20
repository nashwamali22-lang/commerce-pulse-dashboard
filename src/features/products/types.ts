export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  category: string;
  price: number;
  totalQuantity: number;
  soldQuantity: number;
  profitPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  description: string;
  imageUrl: string;
  productUrl: string;
  category: string;
  price: number;
  totalQuantity: number;
  soldQuantity: number;
  profitPercentage: number;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductsState {
  items: Product[];
  loading: boolean;
  error: string | null;
}
