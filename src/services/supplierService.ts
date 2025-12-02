import api from '../api/axios';

export interface Supplier {
  id: number;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
}

export interface PurchaseOrder {
  id: number;
  supplierId: number;
  supplierName: string;
  orderDate: string;
  status: number; // 0: Pending, 1: Received, 2: Cancelled
  totalAmount: number;
  itemCount: number;
}

export interface CreateSupplierRequest {
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  taxNumber?: string;
}

export interface CreatePurchaseOrderRequest {
  supplierId: number;
  orderDate: string;
  notes?: string;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}

export const supplierService = {
  getAll: async () => {
    const response = await api.get<Supplier[]>('/purchases/suppliers');
    return response.data;
  },

  create: async (data: CreateSupplierRequest) => {
    const response = await api.post<number>('/purchases/suppliers', data);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get<PurchaseOrder[]>('/purchases/orders');
    return response.data;
  },

  createOrder: async (data: CreatePurchaseOrderRequest) => {
    const response = await api.post<number>('/purchases/orders', data);
    return response.data;
  },
};
