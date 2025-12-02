import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supplierService, CreatePurchaseOrderRequest } from '../../services/supplierService';
import { productService, Product } from '../../services/productService';
import { warehouseService } from '../../services/warehouseService';
import { Plus, Check } from 'lucide-react';

export default function PurchaseOrders() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['purchaseOrders'],
    queryFn: supplierService.getOrders,
  });

  const { data: suppliers } = useQuery({
    queryKey: ['suppliers'],
    queryFn: supplierService.getAll,
  });

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(),
  });

  const { data: warehouses } = useQuery({
    queryKey: ['warehouses'],
    queryFn: warehouseService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: supplierService.createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      setIsCreateOpen(false);
    },
  });

  const receiveMutation = useMutation({
    mutationFn: (data: { orderId: number; warehouseId: number }) =>
      supplierService.receiveOrder(data.orderId, data.warehouseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchaseOrders'] });
      setIsReceiveOpen(false);
      setSelectedOrderToReceive(null);
      setSelectedWarehouse('');
    },
  });

  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderItems, setOrderItems] = useState<{ productId: number; quantity: number; unitPrice: number }[]>([]);
  const [currentProduct, setCurrentProduct] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);

  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [selectedOrderToReceive, setSelectedOrderToReceive] = useState<number | null>(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState('');

  const handleReceiveClick = (orderId: number) => {
    setSelectedOrderToReceive(orderId);
    setIsReceiveOpen(true);
  };

  const handleConfirmReceive = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrderToReceive && selectedWarehouse) {
      receiveMutation.mutate({
        orderId: selectedOrderToReceive,
        warehouseId: parseInt(selectedWarehouse),
      });
    }
  };

  const handleAddItem = () => {
    if (!currentProduct || currentQuantity <= 0) return;
    const product = products?.find((p: Product) => p.id === parseInt(currentProduct));
    if (!product) return;

    setOrderItems([...orderItems, {
      productId: parseInt(currentProduct),
      quantity: currentQuantity,
      unitPrice: currentPrice || product.price
    }]);
    setCurrentProduct('');
    setCurrentQuantity(1);
    setCurrentPrice(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || orderItems.length === 0) return;

    const data: CreatePurchaseOrderRequest = {
      supplierId: parseInt(selectedSupplier),
      orderDate: new Date().toISOString(),
      items: orderItems,
    };

    createMutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-500">Manage purchase orders and incoming stock</p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Order
        </button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.supplierName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.itemCount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.totalAmount.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    order.status === 0 ? 'bg-yellow-100 text-yellow-800' : 
                    order.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {order.status === 0 ? 'Pending' : order.status === 1 ? 'Received' : 'Cancelled'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.status === 0 && (
                    <button
                      onClick={() => handleReceiveClick(order.id)}
                      className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      title="Receive Order"
                    >
                      <Check className="h-5 w-5 mr-1" />
                      Receive
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Create Purchase Order</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Supplier</label>
                <select
                  value={selectedSupplier}
                  onChange={(e) => setSelectedSupplier(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers?.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="border-t border-b border-gray-200 py-4">
                <h3 className="text-lg font-medium mb-2">Add Items</h3>
                <div className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5">
                    <label className="block text-xs font-medium text-gray-700">Product</label>
                    <select
                      value={currentProduct}
                      onChange={(e) => setCurrentProduct(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2"
                    >
                      <option value="">Select Product</option>
                      {products?.map((p: Product) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={currentQuantity}
                      onChange={(e) => setCurrentQuantity(parseInt(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="block text-xs font-medium text-gray-700">Unit Price</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={currentPrice}
                      onChange={(e) => setCurrentPrice(parseFloat(e.target.value))}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm border p-2"
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="w-full px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700">Order Items</h4>
                  <ul className="mt-2 divide-y divide-gray-200">
                    {orderItems.map((item, index) => {
                      const product = products?.find((p: Product) => p.id === item.productId);
                      return (
                        <li key={index} className="py-2 flex justify-between text-sm">
                          <span>{product?.name} x {item.quantity}</span>
                          <span>${(item.quantity * item.unitPrice).toFixed(2)}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-2 text-right font-bold">
                    Total: ${orderItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReceiveOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Receive Order #{selectedOrderToReceive}</h2>
            <form onSubmit={handleConfirmReceive} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Select Warehouse</label>
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                  required
                >
                  <option value="">Select Warehouse</option>
                  {warehouses?.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">Stock will be added to this warehouse.</p>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsReceiveOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                >
                  Confirm Receive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
