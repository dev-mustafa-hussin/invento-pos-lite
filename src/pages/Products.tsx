import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { productsAPI } from '@/services/mockDataService';
import { Product } from '@/types';
import { ProductFormDialog } from '@/components/ProductFormDialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      toast({
        title: 'Error',
        description: 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`Are you sure you want to delete ${product.name}?`)) return;
    
    try {
      await productsAPI.delete(product.id);
      toast({
        title: 'Success',
        description: t('products.deleteSuccess'),
      });
      loadProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleFormSuccess = () => {
    loadProducts();
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('products.title')}</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">{t('products.subtitle')}</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          {t('products.add')}
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('products.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <DataTable
            data={filteredProducts}
            columns={[
              { 
                header: t('products.name'), 
                accessor: (row) => (
                  <div className="min-w-[120px]">
                    <p className="font-medium text-sm md:text-base">{row.name}</p>
                    <p className="text-xs text-muted-foreground md:hidden">{row.sku}</p>
                  </div>
                )
              },
              { 
                header: t('products.sku'), 
                accessor: 'sku',
                className: 'hidden md:table-cell'
              },
              { 
                header: t('products.category'), 
                accessor: 'category',
                className: 'hidden lg:table-cell'
              },
              { 
                header: t('products.price'), 
                accessor: (row) => (
                  <span className="text-sm md:text-base font-semibold">
                    ${row.unitPrice.toFixed(2)}
                  </span>
                )
              },
              { 
                header: t('products.stock'), 
                accessor: (row) => (
                  <Badge 
                    variant={row.stock <= row.minimumStock ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    {row.stock}
                  </Badge>
                )
              },
              { 
                header: t('products.status'), 
                accessor: (row) => (
                  <Badge 
                    variant={row.status === 'active' ? 'default' : 'secondary'}
                    className="text-xs hidden sm:inline-flex"
                  >
                    {row.status === 'active' ? t('products.active') : t('products.inactive')}
                  </Badge>
                ),
                className: 'hidden sm:table-cell'
              },
              { 
                header: t('products.actions'), 
                accessor: (row) => (
                  <div className="flex gap-1 md:gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEdit(row)}
                    >
                      <Edit className="h-3 w-3 md:h-4 md:w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(row)}
                    >
                      <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-destructive" />
                    </Button>
                  </div>
                )
              },
            ]}
          />
        </div>
      </div>

      <ProductFormDialog
        open={isFormOpen}
        onOpenChange={(open) => {
          setIsFormOpen(open);
          if (!open) setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
