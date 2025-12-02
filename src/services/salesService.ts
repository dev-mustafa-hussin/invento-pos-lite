import api from '../api/axios';

export interface CreateInvoiceItemDto {
  productId: number;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface CreateInvoiceDto {
  customerId?: number; // Optional for now, or use a default Walk-in Customer
  items: CreateInvoiceItemDto[];
  paymentMethod: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  totalAmount: number;
  status: string;
}

export const salesService = {
  createInvoice: async (data: CreateInvoiceDto) => {
    const response = await api.post<Invoice>('/sales/invoices', data);
    return response.data;
  },

  getAll: async (page = 1, pageSize = 10, search?: string) => {
    const response = await api.get<Invoice[]>('/sales/invoices', {
      params: { page, pageSize, search },
    });
    return response.data;
  },
};
