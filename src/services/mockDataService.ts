// Mock data service - replace with real API calls to ASP.NET Core backend
import { Product, SaleInvoice, SaleItem, DailyReport, DashboardStats } from '@/types';

// TODO: Replace with actual API endpoints
const API_BASE_URL = '/api'; // Your ASP.NET Core API base URL

// Mock data storage (in-memory)
let products: Product[] = [
  {
    id: '1',
    name: 'Laptop HP ProBook 450',
    sku: 'LAP-HP-450',
    barcode: '1234567890123',
    category: 'Electronics',
    unitPrice: 899.99,
    costPrice: 650.00,
    stock: 15,
    minimumStock: 5,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Wireless Mouse Logitech',
    sku: 'MOU-LOG-M185',
    category: 'Accessories',
    unitPrice: 24.99,
    costPrice: 15.00,
    stock: 45,
    minimumStock: 20,
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    name: 'USB-C Cable 2m',
    sku: 'CAB-USB-C-2M',
    category: 'Accessories',
    unitPrice: 12.99,
    costPrice: 7.00,
    stock: 3,
    minimumStock: 10,
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '4',
    name: 'Monitor Dell 24"',
    sku: 'MON-DELL-24',
    category: 'Electronics',
    unitPrice: 299.99,
    costPrice: 220.00,
    stock: 8,
    minimumStock: 3,
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '5',
    name: 'Keyboard Mechanical RGB',
    sku: 'KEY-MECH-RGB',
    category: 'Accessories',
    unitPrice: 79.99,
    costPrice: 50.00,
    stock: 12,
    minimumStock: 5,
    status: 'active',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
];

let invoices: SaleInvoice[] = [
  {
    id: 'INV-001',
    invoiceNumber: 'INV-001',
    date: new Date(),
    customerName: 'John Smith',
    items: [
      {
        id: '1',
        productId: '1',
        productName: 'Laptop HP ProBook 450',
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
    paymentMethod: 'card',
    status: 'completed',
  },
  {
    id: 'INV-002',
    invoiceNumber: 'INV-002',
    date: new Date(Date.now() - 3600000),
    items: [
      {
        id: '1',
        productId: '2',
        productName: 'Wireless Mouse Logitech',
        quantity: 2,
        unitPrice: 24.99,
        discount: 0,
        lineTotal: 49.98,
      },
    ],
    subtotal: 49.98,
    discount: 0,
    tax: 4.99,
    total: 54.97,
    paymentMethod: 'cash',
    status: 'completed',
  },
];

// Products API
export const productsAPI = {
  // TODO: Replace with fetch(`${API_BASE_URL}/products`)
  getAll: async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...products]), 100);
    });
  },

  // TODO: Replace with fetch(`${API_BASE_URL}/products/${id}`)
  getById: async (id: string): Promise<Product | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(products.find(p => p.id === id)), 100);
    });
  },

  // TODO: Replace with fetch(`${API_BASE_URL}/products`, { method: 'POST', body: JSON.stringify(product) })
  create: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> => {
    return new Promise((resolve) => {
      const newProduct: Product = {
        ...product,
        id: `${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      products.push(newProduct);
      setTimeout(() => resolve(newProduct), 100);
    });
  },

  // TODO: Replace with fetch(`${API_BASE_URL}/products/${id}`, { method: 'PUT', body: JSON.stringify(product) })
  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    return new Promise((resolve, reject) => {
      const index = products.findIndex(p => p.id === id);
      if (index === -1) {
        reject(new Error('Product not found'));
        return;
      }
      products[index] = {
        ...products[index],
        ...updates,
        updatedAt: new Date(),
      };
      setTimeout(() => resolve(products[index]), 100);
    });
  },

  // TODO: Replace with fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' })
  delete: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      products = products.filter(p => p.id !== id);
      setTimeout(() => resolve(), 100);
    });
  },

  search: async (query: string): Promise<Product[]> => {
    return new Promise((resolve) => {
      const results = products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase()) ||
        p.barcode?.toLowerCase().includes(query.toLowerCase())
      );
      setTimeout(() => resolve(results), 100);
    });
  },

  getLowStock: async (): Promise<Product[]> => {
    return new Promise((resolve) => {
      const lowStock = products.filter(p => p.stock <= p.minimumStock);
      setTimeout(() => resolve(lowStock), 100);
    });
  },
};

// Sales API
export const salesAPI = {
  // TODO: Replace with fetch(`${API_BASE_URL}/sales`)
  getAll: async (): Promise<SaleInvoice[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...invoices]), 100);
    });
  },

  // TODO: Replace with fetch(`${API_BASE_URL}/sales/${id}`)
  getById: async (id: string): Promise<SaleInvoice | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(invoices.find(i => i.id === id)), 100);
    });
  },

  // TODO: Replace with fetch(`${API_BASE_URL}/sales`, { method: 'POST', body: JSON.stringify(sale) })
  create: async (sale: Omit<SaleInvoice, 'id' | 'invoiceNumber'>): Promise<SaleInvoice> => {
    return new Promise((resolve) => {
      const invoiceNumber = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
      const newSale: SaleInvoice = {
        ...sale,
        id: invoiceNumber,
        invoiceNumber,
      };
      invoices.push(newSale);
      
      // Update product stock
      sale.items.forEach(item => {
        const productIndex = products.findIndex(p => p.id === item.productId);
        if (productIndex !== -1) {
          products[productIndex].stock -= item.quantity;
        }
      });
      
      setTimeout(() => resolve(newSale), 100);
    });
  },

  getByDateRange: async (startDate: Date, endDate: Date): Promise<SaleInvoice[]> => {
    return new Promise((resolve) => {
      const filtered = invoices.filter(i => 
        i.date >= startDate && i.date <= endDate
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

// Reports API
export const reportsAPI = {
  // TODO: Replace with fetch(`${API_BASE_URL}/reports/daily?date=${date}`)
  getDailyReport: async (date: Date): Promise<DailyReport> => {
    return new Promise((resolve) => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const daySales = invoices.filter(i => 
        i.date >= startOfDay && i.date <= endOfDay
      );

      const totalSales = daySales.reduce((sum, i) => sum + i.total, 0);
      
      // Calculate top products
      const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
      daySales.forEach(invoice => {
        invoice.items.forEach(item => {
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

      setTimeout(() => resolve({
        date,
        totalSales,
        invoiceCount: daySales.length,
        topProducts,
      }), 100);
    });
  },
};

// Dashboard API
export const dashboardAPI = {
  // TODO: Replace with fetch(`${API_BASE_URL}/dashboard/stats`)
  getStats: async (): Promise<DashboardStats> => {
    return new Promise(async (resolve) => {
      const todaySales = await salesAPI.getTodaySales();
      const lowStockProducts = await productsAPI.getLowStock();
      
      const totalSales = todaySales.reduce((sum, invoice) => sum + invoice.total, 0);
      
      setTimeout(() => resolve({
        todaySales: totalSales,
        todayInvoices: todaySales.length,
        lowStockProducts,
        recentSales: todaySales.slice(0, 5),
      }), 100);
    });
  },
};
