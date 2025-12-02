import api from '../api/axios';

export interface SystemSettings {
  storeName: string;
  storeAddress: string;
  storePhone: string;
  taxRate: string;
  currency: string;
  lowStockAlerts: string;
  dailyReports: string;
  backendUrl: string;
  [key: string]: string;
}

export const settingsService = {
  getSettings: async () => {
    const response = await api.get<SystemSettings>('/settings');
    return response.data;
  },

  updateSettings: async (settings: Partial<SystemSettings>) => {
    await api.put('/settings', settings);
  },
};
