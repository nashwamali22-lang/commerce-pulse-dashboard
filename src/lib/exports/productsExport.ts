import type { Product } from '@/features/products/types';

export type ExportProduct = Product & {
  categoryName: string;
  availableQuantity: number;
};

function getFileDate() {
  return new Date().toISOString().slice(0, 10);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value);
}

export async function exportProductsToExcel(products: ExportProduct[]) {
  if (products.length === 0) {
    throw new Error('There are no products to export.');
  }

  const XLSX = await import('xlsx');

  const rows = products.map((product) => ({
    Product: product.name,
    Description: product.description,
    Category: product.categoryName,
    Price: product.price,
    'Total Quantity': product.totalQuantity,
    'Sold Quantity': product.soldQuantity,
    'Available Quantity': product.availableQuantity,
    'Profit Percentage': `${product.profitPercentage}%`,
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet['!cols'] = [
    { wch: 25 },
    { wch: 50 },
    { wch: 15 },
    { wch: 14 },
    { wch: 17 },
    { wch: 17 },
    { wch: 20 },
    { wch: 20 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

  XLSX.writeFile(workbook, `products-${getFileDate()}.xlsx`);
}

export async function exportProductsToPdf(products: ExportProduct[]) {
  if (products.length === 0) {
    throw new Error('There are no products to export.');
  }

  const [jsPdfModule, autoTableModule] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);

  const jsPDF = jsPdfModule.default;
  const autoTable = autoTableModule.default;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  doc.setFontSize(18);
  doc.text('Product Inventory Report', 14, 17);

  doc.setFontSize(9);

  doc.text(`Generated: ${new Date().toLocaleString('en-US')}`, 14, 24);

  doc.text(`Products: ${products.length}`, 14, 29);

  const totalUnits = products.reduce(
    (total, product) => total + product.totalQuantity,
    0,
  );

  const soldUnits = products.reduce(
    (total, product) => total + product.soldQuantity,
    0,
  );

  const availableUnits = products.reduce(
    (total, product) => total + product.availableQuantity,
    0,
  );

  doc.text(`Total Units: ${totalUnits}`, 75, 29);

  doc.text(`Sold Units: ${soldUnits}`, 125, 29);

  doc.text(`Available Units: ${availableUnits}`, 170, 29);

  autoTable(doc, {
    startY: 35,

    head: [
      [
        'Product',
        'Category',
        'Price',
        'Total',
        'Sold',
        'Available',
        'Profit %',
      ],
    ],

    body: products.map((product) => [
      product.name,
      product.categoryName,
      formatCurrency(product.price),
      String(product.totalQuantity),
      String(product.soldQuantity),
      String(product.availableQuantity),
      `${product.profitPercentage}%`,
    ]),

    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
    },

    headStyles: {
      fontStyle: 'bold',
    },

    margin: {
      left: 14,
      right: 14,
    },
  });

  doc.save(`products-${getFileDate()}.pdf`);
}
