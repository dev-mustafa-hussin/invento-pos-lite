import api from '../api/axios';

export interface SalesReportItem {
  date: string;
  totalRevenue: number;
  invoiceCount: number;
}

export interface TopProductItem {
  productName: string;
  quantitySold: number;
  totalRevenue: number;
}

export interface LowStockItem {
  productId: number;
  name: string;
  stock: number;
  minimumStock: number;
}

export const reportsService = {
  getSalesReport: async (fromDate?: string, toDate?: string) => {
    const response = await api.get<SalesReportItem[]>('/reports/sales', {
      params: { fromDate, toDate },
    });
    return response.data;
  },

  getTopProducts: async (count = 5) => {
    const response = await api.get<TopProductItem[]>('/reports/top-products', {
      params: { count },
    });
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get<LowStockItem[]>('/reports/low-stock');
    return response.data;
  },
};
