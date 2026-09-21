'use client';

import { X } from 'lucide-react';

import { useState, type FormEvent } from 'react';

import type { Category } from '@/features/categories/types';

import type { CreateProductInput, Product } from '@/features/products/types';

type ProductFormModalProps = {
  open: boolean;
  product?: Product | null;
  categories: Category[];
  loading: boolean;

  onClose: () => void;

  onSubmit: (input: CreateProductInput) => Promise<void>;
};

type FormState = {
  name: string;
  description: string;
  imageUrl: string;

  price: string;

  totalQuantity: string;
  soldQuantity: string;

  categoryId: string;

  profitPercentage: string;
};

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  imageUrl: '',

  price: '',

  totalQuantity: '',
  soldQuantity: '0',

  categoryId: '',

  profitPercentage: '20',
};

function getInitialForm(
  product: Product | null | undefined,
  categories: Category[]
): FormState {
  if (!product) {
    return {
      ...EMPTY_FORM,
      categoryId: categories[0]?.id ?? '',
    };
  }

  return {
    name: product.name,
    description: product.description,
    imageUrl: product.imageUrl,
    price: String(product.price),
    totalQuantity: String(product.totalQuantity),
    soldQuantity: String(product.soldQuantity),
    categoryId: product.categoryId,
    profitPercentage: String(product.profitPercentage),
  };
}
export function ProductFormModal(
  props: ProductFormModalProps
) {
  const {
    open,
    product,
    categories,
  } = props;

  if (!open) {
    return null;
  }

  const formKey =
    product?.id ??
    `new-${categories[0]?.id ?? 'no-category'}`;

  return (
    <ProductFormModalContent
      key={formKey}
      {...props}
    />
  );
}

function ProductFormModalContent({
  product,
  categories,
  loading,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const [form, setForm] =
    useState<FormState>(() =>
      getInitialForm(
        product,
        categories
      )
    );

  const [error, setError] =
    useState<string | null>(null);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    setError(null);

    const name = form.name.trim();

    const description = form.description.trim();

    const imageUrl = form.imageUrl.trim();

    const price = Number(form.price);

    const totalQuantity = Number(form.totalQuantity);

    const soldQuantity = Number(form.soldQuantity);

    const profitPercentage = Number(form.profitPercentage);

    if (!name) {
      setError('Product name is required.');

      return;
    }

    if (!description) {
      setError('Description is required.');

      return;
    }

    if (!form.categoryId) {
      setError('Please select a category.');

      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      setError('Price must be a valid positive number.');

      return;
    }

    if (!Number.isInteger(totalQuantity) || totalQuantity < 0) {
      setError('Total quantity must be 0 or greater.');

      return;
    }

    if (!Number.isInteger(soldQuantity) || soldQuantity < 0) {
      setError('Sold quantity must be 0 or greater.');

      return;
    }

    if (soldQuantity > totalQuantity) {
      setError('Sold quantity cannot exceed total quantity.');

      return;
    }

    if (
      !Number.isFinite(profitPercentage) ||
      profitPercentage < 0 ||
      profitPercentage > 100
    ) {
      setError('Profit percentage must be between 0 and 100.');

      return;
    }

    await onSubmit({
      name,
      description,

      imageUrl: imageUrl || '/products/product-placeholder.svg',

      price,

      totalQuantity,
      soldQuantity,

      categoryId: form.categoryId,

      profitPercentage,
    });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0b1527] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#0b1527] px-5 py-4">
          <div>
            <h2 id="product-modal-title" className="font-semibold text-white">
              {product ? 'Edit Product' : 'Add Product'}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Product information will be stored in Firestore.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          {error && (
            <div
              role="alert"
              className="rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Product Name" required>
              <input
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Category" required>
              <select
                value={form.categoryId}
                onChange={(e) => updateField('categoryId', e.target.value)}
                className={inputClass}
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description" required>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={`${inputClass} resize-none py-3`}
            />
          </Field>

          <Field label="Image URL">
            <input
              type="text"
              placeholder="/products/product-placeholder.svg"
              value={form.imageUrl}
              onChange={(e) => updateField('imageUrl', e.target.value)}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Price" required>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Profit %" required>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.profitPercentage}
                onChange={(e) =>
                  updateField('profitPercentage', e.target.value)
                }
                className={inputClass}
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Total Quantity" required>
              <input
                type="number"
                min="0"
                step="1"
                value={form.totalQuantity}
                onChange={(e) => updateField('totalQuantity', e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Sold Quantity" required>
              <input
                type="number"
                min="0"
                step="1"
                value={form.soldQuantity}
                onChange={(e) => updateField('soldQuantity', e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Available">
              <div className="flex h-11 items-center rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 text-sm font-semibold text-emerald-400">
                {Math.max(
                  Number(form.totalQuantity || 0) -
                    Number(form.soldQuantity || 0),
                  0,
                )}
              </div>
            </Field>
          </div>

          <div className="flex justify-end gap-3 border-t border-white/[0.06] pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="h-10 rounded-xl border border-white/[0.08] px-5 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || categories.length === 0}
              className="h-10 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Saving...' : product ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-medium text-slate-400">
        {label}

        {required && <span className="ml-1 text-red-400">*</span>}
      </span>

      {children}
    </label>
  );
}

const inputClass =
  'h-11 w-full rounded-xl border border-white/[0.07] bg-[#07111f] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/60';


