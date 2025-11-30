// Core data types for the POS system

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  stock: number;
  minimumStock: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface SaleItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage
  lineTotal: number;
}

export interface SaleInvoice {
  id: string;
  invoiceNumber: string;
  date: Date;
  customerName?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'other';
  status: 'completed' | 'cancelled';
}

export interface DailyReport {
  date: Date;
  totalSales: number;
  invoiceCount: number;
  topProducts: {
    productId: string;
    productName: string;
    quantitySold: number;
    revenue: number;
  }[];
}

export interface DashboardStats {
  todaySales: number;
  todayInvoices: number;
  lowStockProducts: Product[];
  recentSales: SaleInvoice[];
}
