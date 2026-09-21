export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
}

export type UpdateCategoryInput =
  Partial<CreateCategoryInput>;
