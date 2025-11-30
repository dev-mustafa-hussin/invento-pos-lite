import React from 'react';
import { SaleInvoice } from '@/types';

interface ReceiptProps {
  invoice: SaleInvoice;
}

export const Receipt = React.forwardRef<HTMLDivElement, ReceiptProps>(({ invoice }, ref) => {
  return (
    <div ref={ref} className="hidden print:block p-8 bg-white text-black w-full max-w-[80mm] mx-auto font-mono text-sm">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold uppercase tracking-wider">Invento POS</h2>
        <p className="mt-1">123 Store Address, City</p>
        <p>Tel: +1 234 567 890</p>
      </div>
      
      <div className="mb-6 space-y-1 border-b border-dashed border-gray-400 pb-4">
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{new Date(invoice.date).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Invoice:</span>
          <span>{invoice.invoiceNumber}</span>
        </div>
        {invoice.customerName && (
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{invoice.customerName}</span>
          </div>
        )}
      </div>

      <div className="mb-4">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dashed border-gray-400">
              <th className="text-left py-2">Item</th>
              <th className="text-center py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item) => (
              <tr key={item.id} className="border-b border-dashed border-gray-200">
                <td className="py-2 pr-2">{item.productName}</td>
                <td className="text-center py-2 px-2">{item.quantity}</td>
                <td className="text-right py-2 px-2">{item.unitPrice.toFixed(2)}</td>
                <td className="text-right py-2 pl-2">{item.lineTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-2 border-t border-dashed border-gray-400 pt-4">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${invoice.subtotal.toFixed(2)}</span>
        </div>
        {invoice.discount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Discount:</span>
            <span>-${invoice.discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax:</span>
          <span>${invoice.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-double border-gray-400 pt-2 mt-2">
          <span>Total:</span>
          <span>${invoice.total.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center mt-8 pt-4 border-t border-dashed border-gray-400">
        <p className="font-semibold">Thank you for your purchase!</p>
        <p className="text-xs mt-2 text-gray-500">Please keep this receipt for your records.</p>
      </div>
    </div>
  );
});

Receipt.displayName = 'Receipt';
