import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '@/types';
import { productsAPI } from '@/services/mockDataService';
import { useToast } from '@/hooks/use-toast';

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
  onSuccess: () => void;
}

const categories = ['Electronics', 'Accessories', 'Office Supplies', 'Furniture', 'Other'];

export function ProductFormDialog({ open, onOpenChange, product, onSuccess }: ProductFormDialogProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category: 'Electronics',
    unitPrice: '',
    costPrice: '',
    stock: '',
    minimumStock: '',
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        barcode: product.barcode || '',
        category: product.category,
        unitPrice: product.unitPrice.toString(),
        costPrice: product.costPrice.toString(),
        stock: product.stock.toString(),
        minimumStock: product.minimumStock.toString(),
        status: product.status,
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        barcode: '',
        category: 'Electronics',
        unitPrice: '',
        costPrice: '',
        stock: '',
        minimumStock: '',
        status: 'active',
      });
    }
  }, [product, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        name: formData.name,
        sku: formData.sku,
        barcode: formData.barcode || undefined,
        category: formData.category,
        unitPrice: parseFloat(formData.unitPrice),
        costPrice: parseFloat(formData.costPrice),
        stock: parseInt(formData.stock),
        minimumStock: parseInt(formData.minimumStock),
        status: formData.status,
      };

      if (product) {
        await productsAPI.update(product.id, data);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        await productsAPI.create(data);
        toast({
          title: 'Success',
          description: 'Product created successfully',
        });
      }

      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitPrice">Unit Price *</Label>
              <Input
                id="unitPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.unitPrice}
                onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price *</Label>
              <Input
                id="costPrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumStock">Minimum Stock *</Label>
              <Input
                id="minimumStock"
                type="number"
                min="0"
                value={formData.minimumStock}
                onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'inactive') => 
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : product ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
