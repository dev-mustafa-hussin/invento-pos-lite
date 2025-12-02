import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { warehouseService } from '../../services/warehouseService';
import { stockService } from '../../services/stockService';
import { productService, Product } from '../../services/productService';

interface StockAdjustmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StockAdjustmentDialog({ isOpen, onClose }: StockAdjustmentDialogProps) {
  const queryClient = useQueryClient();
  const [productId, setProductId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [quantityAdjustment, setQuantityAdjustment] = useState(0);
  const [reason, setReason] = useState('');

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: warehouseService.getAll,
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const adjustMutation = useMutation({
    mutationFn: stockService.adjust,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
      setProductId('');
      setWarehouseId('');
      setQuantityAdjustment(0);
      setReason('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !warehouseId || quantityAdjustment === 0) return;

    adjustMutation.mutate({
      productId: parseInt(productId),
      warehouseId: parseInt(warehouseId),
      quantityAdjustment,
      reason,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Adjust Stock</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              required
            >
              <option value="">Select Product</option>
              {products?.map((p: Product) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Warehouse</label>
            <select
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              required
            >
              <option value="">Select Warehouse</option>
              {warehouses?.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Adjustment Quantity (+/-)</label>
            <input
              type="number"
              value={quantityAdjustment}
              onChange={(e) => setQuantityAdjustment(parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              required
              placeholder="e.g. -5 for loss, 10 for found"
            />
            <p className="mt-1 text-xs text-gray-500">Negative to remove stock, positive to add.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              rows={2}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
            >
              Adjust Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
