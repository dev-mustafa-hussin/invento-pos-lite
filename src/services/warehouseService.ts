import api from './api';

export interface Warehouse {
  id: number;
  name: string;
  location?: string;
  isPrimary: boolean;
  isActive: boolean;
}

export const warehouseService = {
  getAll: async () => {
    const response = await api.get<Warehouse[]>('/warehouses');
    return response.data;
  },
};
