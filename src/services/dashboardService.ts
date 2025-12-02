import api from '../api/axios';

export interface RecentSale {
  invoiceNumber: string;
  customerName: string;
  amount: number;
  date: string;
}

export interface DashboardStats {
  totalRevenue: number;
  totalInvoices: number;
  totalProducts: number;
  lowStockProducts: number;
  recentSales: RecentSale[];
}

export const dashboardService = {
  getStats: async () => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};
