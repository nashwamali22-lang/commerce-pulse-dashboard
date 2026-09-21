'use client';

import { Plus, RefreshCw } from 'lucide-react';

import { useEffect, useRef, useState } from 'react';

import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';

import { ProductFormModal } from '@/components/products/ProductFormModal';

import { ProductsTable } from '@/components/products/ProductsTable';

import { fetchCategories } from '@/features/categories/categoriesSlice';

import {
  selectCategories,
  selectCategoriesError,
  selectCategoriesLoading,
} from '@/features/categories/categorySelectors';

import type { CreateProductInput, Product } from '@/features/products/types';

import {
  createProduct,
  editProduct,
  fetchProducts,
  removeProduct,
} from '@/features/products/productsSlice';

import {
  selectProducts,
  selectProductsError,
  selectProductsLoading,
  selectProductsMutationLoading,
} from '@/features/products/productSelectors';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function ProductsPage() {
  const dispatch = useAppDispatch();

  const requested = useRef(false);

  const user = useAppSelector((state) => state.auth.user);

  const products = useAppSelector(selectProducts);

  const productsLoading = useAppSelector(selectProductsLoading);

  const mutationLoading = useAppSelector(selectProductsMutationLoading);

  const productsError = useAppSelector(selectProductsError);

  const categories = useAppSelector(selectCategories);

  const categoriesLoading = useAppSelector(selectCategoriesLoading);

  const categoriesError = useAppSelector(selectCategoriesError);

  const [modalOpen, setModalOpen] = useState(false);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  /*
   * Initial loading
   */
  useEffect(() => {
    if (requested.current) {
      return;
    }

    requested.current = true;

    void dispatch(fetchProducts());

    void dispatch(fetchCategories());
  }, [dispatch]);

  const loading =
    (productsLoading && products.length === 0) ||
    (categoriesLoading && categories.length === 0);

  const error = productsError ?? categoriesError;

  /*
   * Add Product
   */
  function openAddModal() {
    setEditingProduct(null);

    setModalOpen(true);
  }

  /*
   * Edit Product
   */
  function openEditModal(product: Product) {
    setEditingProduct(product);

    setModalOpen(true);
  }

  /*
   * Close modal
   */
  function closeModal() {
    if (mutationLoading) {
      return;
    }

    setModalOpen(false);

    setEditingProduct(null);
  }

  /*
   * Add / Edit submit
   */
  async function handleSubmit(input: CreateProductInput) {
    /*
     * Edit existing product
     */
    if (editingProduct) {
      const result = await dispatch(
        editProduct({
          id: editingProduct.id,

          changes: input,
        }),
      );

      if (editProduct.fulfilled.match(result)) {
        setModalOpen(false);

        setEditingProduct(null);
      }

      return;
    }

    /*
     * Create new product
     */
    const result = await dispatch(createProduct(input));

    if (createProduct.fulfilled.match(result)) {
      setModalOpen(false);

      setEditingProduct(null);
    }
  }

  /*
   * Delete Product
   */
  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Delete "${product.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    await dispatch(removeProduct(product.id));
  }

  /*
   * Manual refresh
   */
  function handleRefresh() {
    void dispatch(fetchCategories());

    void dispatch(fetchProducts());
  }

  /*
   * Called after development
   * catalog reset finishes.
   */
return (
    <main className="min-h-dvh bg-[#07111f] text-white">
      <div className="flex min-h-dvh">
        {/* Sidebar */}

        <DashboardSidebar email={user?.email} />

        {/* Main content */}

        <section className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-[1600px]">
            {/* Header */}

            <header className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-[-0.03em] text-white">
                  Products
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your products, inventory and categories.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/*
                 * DEVELOPMENT ONLY.
                 *
                 * This component
                 * already hides
                 * itself in
                 * production.
                 */}
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={productsLoading || categoriesLoading}
                  className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/[0.07] bg-[#0b1527] px-4 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${
                      productsLoading || categoriesLoading ? 'animate-spin' : ''
                    }`}
                  />
                  Refresh
                </button>

                <button
                  type="button"
                  onClick={openAddModal}
                  disabled={categories.length === 0 || mutationLoading}
                  className="inline-flex h-10 items-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                  Add Product
                </button>
              </div>
            </header>

            {/* Errors */}

            {error && (
              <div
                role="alert"
                className="mb-5 flex flex-col gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="text-sm text-red-300">{error}</p>

                <button
                  type="button"
                  onClick={handleRefresh}
                  className="self-start rounded-lg bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-400/15 sm:self-auto"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Categories warning */}

            {categories.length === 0 &&
              !categoriesLoading &&
              !categoriesError && (
                <div className="mb-5 rounded-xl border border-amber-400/15 bg-amber-400/[0.05] px-4 py-3">
                  <p className="text-sm font-medium text-amber-200">
                    No categories are available.
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-200/70">
                    Products cannot be created until at least one category exists.
                  </p>
                </div>
              )}

            {/* Content */}

            {loading ? (
              <ProductsSkeleton />
            ) : (
              <ProductsTable
                products={products}
                categories={categories}
                onEdit={openEditModal}
                onDelete={handleDelete}
              />
            )}
          </div>
        </section>
      </div>

      {/* Add / Edit Modal */}

      <ProductFormModal
        open={modalOpen}
        product={editingProduct}
        categories={categories}
        loading={mutationLoading}
        onClose={closeModal}
        onSubmit={handleSubmit}
      />
    </main>
  );
}

function ProductsSkeleton() {
  return (
    <div aria-label="Loading products" className="animate-pulse">
      {/* Search */}

      <div className="h-12 w-full max-w-xl rounded-xl bg-[#0b1527]" />

      {/* Category filters */}

      <div className="mt-5">
        <div className="h-3 w-20 rounded bg-white/[0.05]" />

        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div key={index} className="h-9 w-28 rounded-lg bg-[#0b1527]" />
          ))}
        </div>
      </div>

      {/* Stock filters */}

      <div className="mt-5">
        <div className="h-3 w-24 rounded bg-white/[0.05]" />

        <div className="mt-3 flex flex-wrap gap-2">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div key={index} className="h-9 w-24 rounded-lg bg-[#0b1527]" />
          ))}
        </div>
      </div>

      {/* Summary */}

      <div className="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({
          length: 4,
        }).map((_, index) => (
          <div
            key={index}
            className="h-[72px] rounded-xl border border-white/[0.05] bg-[#0b1527]"
          />
        ))}
      </div>

      {/* Table */}

      <div className="mt-5 overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0b1527]">
        <div className="h-12 bg-white/[0.02]" />

        {Array.from({
          length: 8,
        }).map((_, index) => (
          <div key={index} className="h-[68px] border-t border-white/[0.04]" />
        ))}
      </div>
    </div>
  );
}

