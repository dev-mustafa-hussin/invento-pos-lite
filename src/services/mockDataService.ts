import {
  Product,
  SaleInvoice,
  SaleItem,
  DailyReport,
  DashboardStats,
} from "@/types";

const STORAGE_KEYS = {
  PRODUCTS: "invento_products",
  INVOICES: "invento_invoices",
};

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Laptop HP ProBook 450",
    sku: "LAP-HP-450",
    barcode: "1234567890123",
    category: "Electronics",
    unitPrice: 899.99,
    costPrice: 650.0,
    stock: 15,
    minimumStock: 5,
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "2",
    name: "Wireless Mouse Logitech",
    sku: "MOU-LOG-M185",
    category: "Accessories",
    unitPrice: 24.99,
    costPrice: 15.0,
    stock: 45,
    minimumStock: 20,
    status: "active",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
  },
  {
    id: "3",
    name: "USB-C Cable 2m",
    sku: "CAB-USB-C-2M",
    category: "Accessories",
    unitPrice: 12.99,
    costPrice: 7.0,
    stock: 3,
    minimumStock: 10,
    status: "active",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-05"),
  },
  {
    id: "4",
    name: 'Monitor Dell 24"',
    sku: "MON-DELL-24",
    category: "Electronics",
    unitPrice: 299.99,
    costPrice: 220.0,
    stock: 8,
    minimumStock: 3,
    status: "active",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "5",
    name: "Keyboard Mechanical RGB",
    sku: "KEY-MECH-RGB",
    category: "Accessories",
    unitPrice: 79.99,
    costPrice: 50.0,
    stock: 12,
    minimumStock: 5,
    status: "active",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-18"),
  },
];

const defaultInvoices: SaleInvoice[] = [
  {
    id: "INV-001",
    invoiceNumber: "INV-001",
    date: new Date(),
    customerName: "John Smith",
    items: [
      {
        id: "1",
        productId: "1",
        productName: "Laptop HP ProBook 450",
        quantity: 1,
        unitPrice: 899.99,
        discount: 0,
        lineTotal: 899.99,
      },
    ],
    subtotal: 899.99,
    discount: 0,
    tax: 89.99,
    total: 989.98,
    paymentMethod: "card",
    status: "completed",
  },
];

// Load from storage
let products: Product[] = [];
let invoices: SaleInvoice[] = [];

try {
  const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
  products = storedProducts ? JSON.parse(storedProducts) : defaultProducts;
  // Fix dates for products
  products = products.map((p) => ({
    ...p,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
  }));

  const storedInvoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
  invoices = storedInvoices ? JSON.parse(storedInvoices) : defaultInvoices;
  // Fix dates for invoices
  invoices = invoices.map((i) => ({
    ...i,
    date: new Date(i.date),
  }));
} catch (e) {
  console.error("Failed to load from local storage", e);
  products = defaultProducts;
  invoices = defaultInvoices;
}

const saveProducts = () =>
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
const saveInvoices = () =>
  localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));

export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...products]), 100);
    });
  },

  getById: async (id: string): Promise<Product | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(products.find((p) => p.id === id)), 100);
    });
  },

  create: async (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> => {
    return new Promise((resolve) => {
      const newProduct: Product = {
        ...product,
        id: `${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      products.push(newProduct);
      saveProducts();
      setTimeout(() => resolve(newProduct), 100);
    });
  },

  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    return new Promise((resolve, reject) => {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) {
        reject(new Error("Product not found"));
        return;
      }
      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date(),
      };
      saveProducts();
      setTimeout(() => resolve(products[index]), 100);
    });
  },

  delete: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      products = products.filter((p) => p.id !== id);
      saveProducts();
      setTimeout(() => resolve(), 100);
    });
  },

  search: async (query: string): Promise<Product[]> => {
    return new Promise((resolve) => {
      const results = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.sku.toLowerCase().includes(query.toLowerCase()) ||
          p.barcode?.toLowerCase().includes(query.toLowerCase())
      );
      setTimeout(() => resolve(results), 100);
    });
  },

  getLowStock: async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      const lowStock = products.filter((p) => p.stock <= p.minimumStock);
      setTimeout(() => resolve(lowStock), 100);
    });
  },
};

export const salesAPI = {
  getAll: async (): Promise<SaleInvoice[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...invoices]), 100);
    });
  },

  getById: async (id: string): Promise<SaleInvoice | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(invoices.find((i) => i.id === id)), 100);
    });
  },

  create: async (
    sale: Omit<SaleInvoice, "id" | "invoiceNumber">
  ): Promise<SaleInvoice> => {
    return new Promise((resolve) => {
      const invoiceNumber = `INV-${String(invoices.length + 1).padStart(
        3,
        "0"
      )}`;
      const newSale: SaleInvoice = {
        ...sale,
        id: invoiceNumber,
        invoiceNumber,
      };
      invoices.push(newSale);
      saveInvoices();

      // Update product stock
      sale.items.forEach((item) => {
        const productIndex = products.findIndex((p) => p.id === item.productId);
        if (productIndex !== -1) {
          products[productIndex].stock -= item.quantity;
        }
      });
      saveProducts();

      setTimeout(() => resolve(newSale), 100);
    });
  },

  getByDateRange: async (
    startDate: Date,
    endDate: Date
  ): Promise<SaleInvoice[]> => {
    return new Promise((resolve) => {
      const filtered = invoices.filter(
        (i) => new Date(i.date) >= startDate && new Date(i.date) <= endDate
      );
      setTimeout(() => resolve(filtered), 100);
    });
  },

  getTodaySales: async (): Promise<SaleInvoice[]> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return salesAPI.getByDateRange(today, new Date());
  },
};

export const reportsAPI = {
  getDailyReport: async (date: Date): Promise<DailyReport> => {
    return new Promise((resolve) => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const daySales = invoices.filter(
        (i) => new Date(i.date) >= startOfDay && new Date(i.date) <= endOfDay
      );

      const totalSales = daySales.reduce((sum, i) => sum + i.total, 0);

      const productSales = new Map<
        string,
        { name: string; quantity: number; revenue: number }
      >();
      daySales.forEach((invoice) => {
        invoice.items.forEach((item) => {
          const existing = productSales.get(item.productId);
          if (existing) {
            existing.quantity += item.quantity;
            existing.revenue += item.lineTotal;
          } else {
            productSales.set(item.productId, {
              name: item.productName,
              quantity: item.quantity,
              revenue: item.lineTotal,
            });
          }
        });
      });

      const topProducts = Array.from(productSales.entries())
        .map(([productId, data]) => ({
          productId,
          productName: data.name,
          quantitySold: data.quantity,
          revenue: data.revenue,
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setTimeout(
        () =>
          resolve({
            date,
            totalSales,
            invoiceCount: daySales.length,
            topProducts,
          }),
        100
      );
    });
  },
};

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    return new Promise(async (resolve) => {
      const todaySales = await salesAPI.getTodaySales();
      const lowStockProducts = await productsAPI.getLowStock();

      const totalSales = todaySales.reduce(
        (sum, invoice) => sum + invoice.total,
        0
      );

      setTimeout(
        () =>
          resolve({
            todaySales: totalSales,
            todayInvoices: todaySales.length,
            lowStockProducts,
            recentSales: todaySales.slice(0, 5),
          }),
        100
      );
    });
  },
};
