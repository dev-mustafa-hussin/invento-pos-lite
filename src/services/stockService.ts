import api from './api';

export interface AdjustStockRequest {
  productId: number;
  warehouseId: number;
  quantityAdjustment: number;
  reason: string;
}

export interface TransferStockRequest {
  productId: number;
  fromWarehouseId: number;
  toWarehouseId: number;
  quantity: number;
  reason?: string;
}

export const stockService = {
  adjust: async (data: AdjustStockRequest) => {
    const response = await api.post('/stock/adjust', data);
    return response.data;
  },

  transfer: async (data: TransferStockRequest) => {
    const response = await api.post('/stock/transfer', data);
    return response.data;
  },
};
