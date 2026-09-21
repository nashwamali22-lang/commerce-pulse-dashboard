'use client';

import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Edit3,
  FileSpreadsheet,
  FileText,
  Package,
  Search,
  Trash2,
  X,
} from 'lucide-react';

import {
  useMemo,
  useState,
} from 'react';

import type {
  Category,
} from '@/features/categories/types';

import type {
  Product,
} from '@/features/products/types';

import {
  exportProductsToExcel,
  exportProductsToPdf,
} from '@/lib/exports/productsExport';

import {
  getAvailableQuantity,
} from '@/lib/products/calculations';

type ProductsTableProps = {
  products: Product[];

  categories: Category[];

  onEdit: (
    product: Product
  ) => void;

  onDelete: (
    product: Product
  ) => void;
};

type ProductTableRow =
  Product & {
    categoryName: string;

    availableQuantity: number;
  };

type StockFilter =
  | 'all'
  | 'in-stock'
  | 'low-stock'
  | 'out-of-stock';

type ExportType =
  | 'pdf'
  | 'excel'
  | null;

export function ProductsTable({
  products,
  categories,
  onEdit,
  onDelete,
}: ProductsTableProps) {
  /*
   * Sorting
   */
  const [
    sorting,
    setSorting,
  ] =
    useState<SortingState>(
      []
    );

  /*
   * Search
   */
  const [
    search,
    setSearch,
  ] = useState('');

  /*
   * Category Filter
   */
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('all');

  /*
   * Stock Filter
   */
  const [
    stockFilter,
    setStockFilter,
  ] =
    useState<StockFilter>(
      'all'
    );

  /*
   * Export state
   */
  const [
    exporting,
    setExporting,
  ] =
    useState<ExportType>(
      null
    );

  const [
    exportError,
    setExportError,
  ] =
    useState<
      string | null
    >(null);

  /*
   * Category lookup
   *
   * Example:
   *
   * {
   *   "category-id": "Mobile"
   * }
   */
  const categoryMap =
    useMemo(
      () =>
        Object.fromEntries(
          categories.map(
            (category) => [
              category.id,
              category.name,
            ]
          )
        ),
      [categories]
    );

  /*
   * Convert normal
   * products into table
   * products.
   */
  const tableData =
    useMemo<
      ProductTableRow[]
    >(
      () =>
        products.map(
          (product) => ({
            ...product,

            categoryName:
              categoryMap[
                product.categoryId
              ] ??
              'Uncategorized',

            availableQuantity:
              getAvailableQuantity(
                product
              ),
          })
        ),
      [
        products,
        categoryMap,
      ]
    );

  /*
   * Count products
   * inside every category.
   */
  const categoryCounts =
    useMemo(() => {
      return Object.fromEntries(
        categories.map(
          (category) => [
            category.id,

            tableData.filter(
              (product) =>
                product.categoryId ===
                category.id
            ).length,
          ]
        )
      );
    }, [
      categories,
      tableData,
    ]);

  /*
   * Search + Category +
   * Stock filtering.
   *
   * All filters work
   * together using AND.
   */
  const filteredProducts =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase();

      return tableData.filter(
        (product) => {
          /*
           * Search
           */
          const matchesSearch =
            term === '' ||
            product.name
              .toLowerCase()
              .includes(
                term
              ) ||
            product.description
              .toLowerCase()
              .includes(
                term
              ) ||
            product.categoryName
              .toLowerCase()
              .includes(
                term
              );

          /*
           * Category
           */
          const matchesCategory =
            selectedCategory ===
              'all' ||
            product.categoryId ===
              selectedCategory;

          /*
           * Stock
           */
          const available =
            product.availableQuantity;

          const matchesStock =
            stockFilter ===
              'all' ||
            (stockFilter ===
              'in-stock' &&
              available >
                10) ||
            (stockFilter ===
              'low-stock' &&
              available >
                0 &&
              available <=
                10) ||
            (stockFilter ===
              'out-of-stock' &&
              available ===
                0);

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStock
          );
        }
      );
    }, [
      tableData,
      search,
      selectedCategory,
      stockFilter,
    ]);

  /*
   * Filtered summary
   */
  const summary =
    useMemo(() => {
      return filteredProducts.reduce(
        (
          result,
          product
        ) => {
          result.total += 1;

          result.available +=
            product.availableQuantity;

          result.sold +=
            product.soldQuantity;

          if (
            product.availableQuantity >
              0 &&
            product.availableQuantity <=
              10
          ) {
            result.lowStock +=
              1;
          }

          return result;
        },
        {
          total: 0,
          available: 0,
          sold: 0,
          lowStock: 0,
        }
      );
    }, [
      filteredProducts,
    ]);

  /*
   * Table columns
   */
  const columns =
    useMemo<
      ColumnDef<ProductTableRow>[]
    >(
      () => [
        /*
         * Product
         */
        {
          accessorKey:
            'name',

          header: ({
            column,
          }) => (
            <SortableHeader
              label="Product"
              sorted={
                column.getIsSorted()
              }
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() ===
                    'asc'
                )
              }
            />
          ),

          cell: ({
            row,
          }) => (
            <div className="flex min-w-[260px] items-center gap-3">
              <ProductImage
                src={
                  row.original
                    .imageUrl
                }
                name={
                  row.original
                    .name
                }
              />

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  {
                    row.original
                      .name
                  }
                </p>

                <p className="mt-0.5 max-w-[310px] truncate text-xs text-slate-500">
                  {
                    row.original
                      .description
                  }
                </p>
              </div>
            </div>
          ),
        },

        /*
         * Category
         */
        {
          accessorKey:
            'categoryName',

          header: ({
            column,
          }) => (
            <SortableHeader
              label="Category"
              sorted={
                column.getIsSorted()
              }
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() ===
                    'asc'
                )
              }
            />
          ),

          cell: ({
            row,
          }) => (
            <CategoryBadge
              name={
                row.original
                  .categoryName
              }
            />
          ),
        },

        /*
         * Price
         */
        {
          accessorKey:
            'price',

          header: ({
            column,
          }) => (
            <SortableHeader
              label="Price"
              sorted={
                column.getIsSorted()
              }
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() ===
                    'asc'
                )
              }
            />
          ),

          cell: ({
            row,
          }) =>
            formatCurrency(
              row.original
                .price
            ),
        },

        /*
         * Total
         */
        {
          accessorKey:
            'totalQuantity',

          header: ({
            column,
          }) => (
            <SortableHeader
              label="Total"
              sorted={
                column.getIsSorted()
              }
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() ===
                    'asc'
                )
              }
            />
          ),
        },

        /*
         * Sold
         */
        {
          accessorKey:
            'soldQuantity',

          header: ({
            column,
          }) => (
            <SortableHeader
              label="Sold"
              sorted={
                column.getIsSorted()
              }
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() ===
                    'asc'
                )
              }
            />
          ),
        },

        /*
         * Available
         */
        {
          accessorKey:
            'availableQuantity',

          header: ({
            column,
          }) => (
            <SortableHeader
              label="Available"
              sorted={
                column.getIsSorted()
              }
              onClick={() =>
                column.toggleSorting(
                  column.getIsSorted() ===
                    'asc'
                )
              }
            />
          ),

          cell: ({
            row,
          }) => (
            <StockValue
              value={
                row.original
                  .availableQuantity
              }
            />
          ),
        },

        /*
         * Actions
         */
        {
          id: 'actions',

          header:
            'Actions',

          enableSorting:
            false,

          cell: ({
            row,
          }) => (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onEdit(
                    row.original
                  )
                }
                aria-label={`Edit ${row.original.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] text-slate-400 transition hover:bg-violet-500/10 hover:text-violet-300"
              >
                <Edit3 className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  onDelete(
                    row.original
                  )
                }
                aria-label={`Delete ${row.original.name}`}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.07] text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ),
        },
      ],
      [
        onEdit,
        onDelete,
      ]
    );

  /*
   * TanStack Table
   */
  const table =
    useReactTable({
      data:
        filteredProducts,

      columns,

      state: {
        sorting,
      },

      onSortingChange:
        setSorting,

      getCoreRowModel:
        getCoreRowModel(),

      getSortedRowModel:
        getSortedRowModel(),

      getPaginationRowModel:
        getPaginationRowModel(),

      initialState: {
        pagination: {
          pageSize: 10,
        },
      },
    });

  /*
   * Reset pagination
   * whenever a filter
   * changes.
   */
  function resetPage() {
    table.setPageIndex(
      0
    );
  }

  /*
   * Clear every filter.
   */
  function clearFilters() {
    setSearch('');

    setSelectedCategory(
      'all'
    );

    setStockFilter(
      'all'
    );

    resetPage();
  }

  /*
   * Export ALL currently
   * filtered/sorted rows.
   *
   * Important:
   * We intentionally use
   * getSortedRowModel instead
   * of getRowModel because
   * getRowModel contains only
   * the current pagination page.
   */
  function getExportProducts() {
    return table
      .getSortedRowModel()
      .rows.map(
        (row) =>
          row.original
      );
  }

  /*
   * PDF Export
   */
  async function handlePdfExport() {
    try {
      setExportError(
        null
      );

      setExporting(
        'pdf'
      );

      const exportProducts =
        getExportProducts();

      await exportProductsToPdf(
        exportProducts
      );
    } catch (error) {
      setExportError(
        error instanceof
          Error
          ? error.message
          : 'PDF export failed.'
      );
    } finally {
      setExporting(
        null
      );
    }
  }

  /*
   * Excel Export
   */
  async function handleExcelExport() {
    try {
      setExportError(
        null
      );

      setExporting(
        'excel'
      );

      const exportProducts =
        getExportProducts();

      await exportProductsToExcel(
        exportProducts
      );
    } catch (error) {
      setExportError(
        error instanceof
          Error
          ? error.message
          : 'Excel export failed.'
      );
    } finally {
      setExporting(
        null
      );
    }
  }

  const filtersActive =
    search.trim() !==
      '' ||
    selectedCategory !==
      'all' ||
    stockFilter !==
      'all';

  return (
    <section className="space-y-5">
      {/* =========================
          Search
      ========================== */}

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />

        <input
          type="search"
          value={search}
          onChange={(
            event
          ) => {
            setSearch(
              event.target
                .value
            );

            resetPage();
          }}
          placeholder="Search by product, description or category..."
          className="h-12 w-full rounded-xl border border-white/[0.07] bg-[#0b1527] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-violet-500/50"
        />
      </div>

      {/* =========================
          Categories
      ========================== */}

      <div>
        <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          Categories
        </p>

        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={
              selectedCategory ===
              'all'
            }
            label="All Products"
            count={
              tableData.length
            }
            onClick={() => {
              setSelectedCategory(
                'all'
              );

              resetPage();
            }}
          />

          {categories.map(
            (category) => (
              <FilterChip
                key={
                  category.id
                }
                active={
                  selectedCategory ===
                  category.id
                }
                label={
                  category.name
                }
                count={
                  categoryCounts[
                    category.id
                  ] ?? 0
                }
                onClick={() => {
                  setSelectedCategory(
                    category.id
                  );

                  resetPage();
                }}
              />
            )
          )}
        </div>
      </div>

      {/* =========================
          Stock Status
      ========================== */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
            Stock Status
          </p>

          <div className="flex flex-wrap gap-2">
            <FilterChip
              active={
                stockFilter ===
                'all'
              }
              label="All"
              onClick={() => {
                setStockFilter(
                  'all'
                );

                resetPage();
              }}
            />

            <FilterChip
              active={
                stockFilter ===
                'in-stock'
              }
              label="In Stock"
              onClick={() => {
                setStockFilter(
                  'in-stock'
                );

                resetPage();
              }}
            />

            <FilterChip
              active={
                stockFilter ===
                'low-stock'
              }
              label="Low Stock"
              onClick={() => {
                setStockFilter(
                  'low-stock'
                );

                resetPage();
              }}
            />

            <FilterChip
              active={
                stockFilter ===
                'out-of-stock'
              }
              label="Out of Stock"
              onClick={() => {
                setStockFilter(
                  'out-of-stock'
                );

                resetPage();
              }}
            />
          </div>
        </div>

        {filtersActive && (
          <button
            type="button"
            onClick={
              clearFilters
            }
            className="inline-flex h-9 items-center gap-2 self-start rounded-lg px-3 text-xs font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white"
          >
            <X className="h-3.5 w-3.5" />

            Clear Filters
          </button>
        )}
      </div>

      {/* =========================
          Export
      ========================== */}

      <div className="flex flex-col gap-3 rounded-xl border border-white/[0.06] bg-[#0b1527] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-300">
            <Download className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Export Table
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              Export the
              current filtered
              and sorted results.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* PDF */}

          <button
            type="button"
            onClick={
              handlePdfExport
            }
            disabled={
              exporting !==
                null ||
              filteredProducts.length ===
                0
            }
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-red-400/15 bg-red-400/[0.05] px-4 text-xs font-semibold text-red-300 transition hover:border-red-400/25 hover:bg-red-400/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileText className="h-4 w-4" />

            {exporting ===
            'pdf'
              ? 'Exporting...'
              : 'Export PDF'}
          </button>

          {/* Excel */}

          <button
            type="button"
            onClick={
              handleExcelExport
            }
            disabled={
              exporting !==
                null ||
              filteredProducts.length ===
                0
            }
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/[0.05] px-4 text-xs font-semibold text-emerald-300 transition hover:border-emerald-400/25 hover:bg-emerald-400/[0.1] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <FileSpreadsheet className="h-4 w-4" />

            {exporting ===
            'excel'
              ? 'Exporting...'
              : 'Export Excel'}
          </button>
        </div>
      </div>

      {/* Export Error */}

      {exportError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-red-400/15 bg-red-400/[0.05] px-4 py-3"
        >
          <p className="text-sm text-red-300">
            {exportError}
          </p>

          <button
            type="button"
            onClick={() =>
              setExportError(
                null
              )
            }
            className="text-red-300/70 transition hover:text-red-200"
            aria-label="Close export error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* =========================
          Summary
      ========================== */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <SummaryCard
          label="Products"
          value={
            summary.total
          }
        />

        <SummaryCard
          label="Available Units"
          value={
            summary.available
          }
        />

        <SummaryCard
          label="Units Sold"
          value={
            summary.sold
          }
        />

        <SummaryCard
          label="Low Stock"
          value={
            summary.lowStock
          }
        />
      </div>

      {/* =========================
          Desktop Table
      ========================== */}

      <div className="hidden overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0b1527] md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-white/[0.025]">
              {table
                .getHeaderGroups()
                .map(
                  (
                    headerGroup
                  ) => (
                    <tr
                      key={
                        headerGroup.id
                      }
                    >
                      {headerGroup.headers.map(
                        (
                          header
                        ) => (
                          <th
                            key={
                              header.id
                            }
                            className="border-b border-white/[0.06] px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-600"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header
                                    .column
                                    .columnDef
                                    .header,
                                  header.getContext()
                                )}
                          </th>
                        )
                      )}
                    </tr>
                  )
                )}
            </thead>

            <tbody>
              {table
                .getRowModel()
                .rows.map(
                  (row) => (
                    <tr
                      key={
                        row.id
                      }
                      className="border-b border-white/[0.045] transition last:border-0 hover:bg-white/[0.018]"
                    >
                      {row
                        .getVisibleCells()
                        .map(
                          (
                            cell
                          ) => (
                            <td
                              key={
                                cell.id
                              }
                              className="px-4 py-3.5 text-sm text-slate-300"
                            >
                              {flexRender(
                                cell
                                  .column
                                  .columnDef
                                  .cell,
                                cell.getContext()
                              )}
                            </td>
                          )
                        )}
                    </tr>
                  )
                )}
            </tbody>
          </table>

          {table.getRowModel()
            .rows.length ===
            0 && (
            <EmptyState />
          )}
        </div>
      </div>

      {/* =========================
          Mobile Cards
      ========================== */}

      <div className="grid gap-3 md:hidden">
        {table
          .getRowModel()
          .rows.map(
            (row) => {
              const product =
                row.original;

              return (
                <article
                  key={
                    product.id
                  }
                  className="rounded-2xl border border-white/[0.07] bg-[#0b1527] p-4"
                >
                  <div className="flex gap-3">
                    <ProductImage
                      src={
                        product.imageUrl
                      }
                      name={
                        product.name
                      }
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">
                        {
                          product.name
                        }
                      </p>

                      <CategoryBadge
                        name={
                          product.categoryName
                        }
                      />
                    </div>

                    <p className="shrink-0 font-semibold text-white">
                      {formatCurrency(
                        product.price
                      )}
                    </p>
                  </div>

                  <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
                    {
                      product.description
                    }
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <MobileMetric
                      label="Total"
                      value={
                        product.totalQuantity
                      }
                    />

                    <MobileMetric
                      label="Sold"
                      value={
                        product.soldQuantity
                      }
                    />

                    <MobileMetric
                      label="Available"
                      value={
                        product.availableQuantity
                      }
                    />
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onEdit(
                          product
                        )
                      }
                      className="h-9 flex-1 rounded-lg border border-white/[0.07] text-xs font-medium text-slate-300 transition hover:bg-white/[0.04]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onDelete(
                          product
                        )
                      }
                      className="h-9 flex-1 rounded-lg border border-red-400/10 text-xs font-medium text-red-300 transition hover:bg-red-400/[0.05]"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            }
          )}

        {table.getRowModel()
          .rows.length ===
          0 && (
          <EmptyState />
        )}
      </div>

      {/* =========================
          Pagination
      ========================== */}

      {filteredProducts.length >
        0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing{' '}
            {table.getState()
              .pagination
              .pageIndex *
              table.getState()
                .pagination
                .pageSize +
              1}
            –
            {Math.min(
              (table.getState()
                .pagination
                .pageIndex +
                1) *
                table.getState()
                  .pagination
                  .pageSize,

              filteredProducts.length
            )}{' '}
            of{' '}
            {
              filteredProducts.length
            }
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {/* Page size */}

            <select
              aria-label="Products per page"
              value={
                table.getState()
                  .pagination
                  .pageSize
              }
              onChange={(
                event
              ) => {
                table.setPageSize(
                  Number(
                    event.target
                      .value
                  )
                );
              }}
              className="h-9 rounded-lg border border-white/[0.07] bg-[#0b1527] px-2 text-xs text-slate-300 outline-none"
            >
              {[
                10,
                20,
                50,
              ].map(
                (size) => (
                  <option
                    key={
                      size
                    }
                    value={
                      size
                    }
                  >
                    {size} / page
                  </option>
                )
              )}
            </select>

            {/* Current Page */}

            <span className="px-2 text-xs text-slate-500">
              Page{' '}
              {table.getState()
                .pagination
                .pageIndex +
                1}{' '}
              of{' '}
              {Math.max(
                table.getPageCount(),
                1
              )}
            </span>

            {/* Previous */}

            <button
              type="button"
              aria-label="Previous page"
              disabled={
                !table.getCanPreviousPage()
              }
              onClick={() =>
                table.previousPage()
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-slate-400 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {/* Next */}

            <button
              type="button"
              aria-label="Next page"
              disabled={
                !table.getCanNextPage()
              }
              onClick={() =>
                table.nextPage()
              }
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] text-slate-400 transition hover:bg-white/[0.04] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/*
 * Filter Button
 */
function FilterChip({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;

  label: string;

  count?: number;

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition ${
        active
          ? 'border-violet-500 bg-violet-600 text-white shadow-sm shadow-violet-950/20'
          : 'border-white/[0.07] bg-[#0b1527] text-slate-400 hover:border-white/[0.12] hover:text-white'
      }`}
    >
      {label}

      {count !==
        undefined && (
        <span
          className={`rounded-md px-1.5 py-0.5 text-[10px] ${
            active
              ? 'bg-white/15 text-white'
              : 'bg-white/[0.04] text-slate-500'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/*
 * Summary card
 */
function SummaryCard({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0b1527] px-4 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </p>

      <p className="mt-1 text-lg font-bold text-white">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

/*
 * Category Badge
 */
function CategoryBadge({
  name,
}: {
  name: string;
}) {
  return (
    <span className="mt-1 inline-flex rounded-md border border-violet-400/15 bg-violet-400/[0.07] px-2 py-1 text-[11px] font-medium text-violet-300">
      {name}
    </span>
  );
}

/*
 * Available stock
 * with status color.
 */
function StockValue({
  value,
}: {
  value: number;
}) {
  return (
    <span
      className={
        value === 0
          ? 'font-semibold text-red-400'
          : value <= 10
            ? 'font-semibold text-amber-400'
            : 'font-semibold text-emerald-400'
      }
    >
      {value}
    </span>
  );
}

/*
 * Sortable column header
 */
function SortableHeader({
  label,
  sorted,
  onClick,
}: {
  label: string;

  sorted:
    | false
    | 'asc'
    | 'desc';

  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 transition hover:text-slate-300"
    >
      {label}

      {sorted ===
      'asc' ? (
        <ArrowUp className="h-3.5 w-3.5" />
      ) : sorted ===
        'desc' ? (
        <ArrowDown className="h-3.5 w-3.5" />
      ) : (
        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
      )}
    </button>
  );
}

/*
 * Product Image
 */
function ProductImage({
  src,
  name,
}: {
  src: string;

  name: string;
}) {
  if (!src) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
        <Package className="h-5 w-5 text-violet-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className="h-11 w-11 shrink-0 rounded-xl bg-white/[0.04] object-cover"
    />
  );
}

/*
 * Mobile statistic
 */
function MobileMetric({
  label,
  value,
}: {
  label: string;

  value: number;
}) {
  return (
    <div className="rounded-xl bg-white/[0.025] p-2 text-center">
      <p className="text-[10px] text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-white">
        {value}
      </p>
    </div>
  );
}

/*
 * Empty State
 */
function EmptyState() {
  return (
    <div className="flex min-h-[220px] items-center justify-center p-8 text-center">
      <div>
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
          <Package className="h-5 w-5 text-violet-400" />
        </div>

        <h3 className="mt-3 text-sm font-semibold text-white">
          No matching
          products
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Change your search
          or filters and try
          again.
        </p>
      </div>
    </div>
  );
}

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    'en-US',
    {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2,
    }
  ).format(value);
}
