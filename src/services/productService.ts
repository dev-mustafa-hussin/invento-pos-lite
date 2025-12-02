import api from '../api/axios';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  barcode?: string;
  categoryId?: number;
  category?: {
    id: number;
    name: string;
  };
  createdAt: string;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  stock: number;
  barcode?: string;
  categoryId?: number;
}

export const productService = {
  getAll: async (page = 1, pageSize = 10, categoryId?: number, search?: string) => {
    const response = await api.get<Product[]>('/products', {
      params: { page, pageSize, categoryId, search },
    });
    return response.data;
  },

  create: async (data: CreateProductDto) => {
    const response = await api.post<{ productId: number }>('/products', data);
    return response.data;
  },

  // Add other methods as needed (update, delete)
};
