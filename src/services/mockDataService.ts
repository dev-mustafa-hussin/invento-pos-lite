import api from './api';
import {
  Product,
  SaleInvoice,
  DailyReport,
  DashboardStats,
} from "@/types";

// Helper to map API product to frontend Product type
const mapProduct = (apiProduct: any): Product => ({
  ...apiProduct,
  createdAt: new Date(apiProduct.createdAt),
  updatedAt: new Date(apiProduct.updatedAt),
});

export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data.map(mapProduct);
  },

  getById: async (id: string): Promise<Product | undefined> => {
    try {
      const response = await api.get<Product>(`/products/${id}`);
      return mapProduct(response.data);
    } catch (error) {
      return undefined;
    }
  },

  create: async (
    product: Omit<Product, "id" | "createdAt" | "updatedAt">
  ): Promise<Product> => {
    const response = await api.post<Product>('/products', product);
    return mapProduct(response.data);
  },

  update: async (id: string, updates: Partial<Product>): Promise<Product> => {
    const response = await api.put<Product>(`/products/${id}`, updates);
    return mapProduct(response.data);
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  search: async (query: string): Promise<Product[]> => {
    // For now, we'll fetch all and filter client-side until we add search endpoint
    const products = await productsAPI.getAll();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.sku.toLowerCase().includes(query.toLowerCase()) ||
        p.barcode?.toLowerCase().includes(query.toLowerCase())
    );
  },

  getLowStock: async (): Promise<Product[]> => {
    const products = await productsAPI.getAll();
    return products.filter((p) => p.stock <= p.minimumStock);
  },
};

export const salesAPI = {
  // TODO: Implement Sales API endpoints when backend is ready
  getAll: async (): Promise<SaleInvoice[]> => {
    return []; 
  },

  getById: async (id: string): Promise<SaleInvoice | undefined> => {
    return undefined;
  },

  create: async (
    sale: Omit<SaleInvoice, "id" | "invoiceNumber">
  ): Promise<SaleInvoice> => {
    throw new Error("Sales API not implemented yet");
  },

  getByDateRange: async (
    startDate: Date,
    endDate: Date
  ): Promise<SaleInvoice[]> => {
    return [];
  },

  getTodaySales: async (): Promise<SaleInvoice[]> => {
    return [];
  },
};

export const reportsAPI = {
  // TODO: Implement Reports API endpoints when backend is ready
  getDailyReport: async (date: Date): Promise<DailyReport> => {
    return {
      date,
      totalSales: 0,
      invoiceCount: 0,
      topProducts: [],
    };
  },
};

export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    // Fetch real data for products
    const lowStockProducts = await productsAPI.getLowStock();
    
    // Mock sales data for now until Sales API is ready
    return {
      todaySales: 0,
      todayInvoices: 0,
      lowStockProducts,
      recentSales: [],
    };
  },
};

