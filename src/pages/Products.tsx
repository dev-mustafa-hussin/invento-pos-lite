import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Loader2 } from 'lucide-react';
import { productService, Product } from '@/services/productService';
import { ProductFormDialog } from '@/components/ProductFormDialog';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { useQuery } from '@tanstack/react-query';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

  const { data: products = [], isLoading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getAll(1, 100),
  });

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.barcode && p.barcode.includes(searchQuery))
  );

  const handleFormSuccess = () => {
    refetch();
    setIsFormOpen(false);
    setEditingProduct(null);
    toast({
      title: 'Success',
      description: 'Product saved successfully',
    });
  };

  return (
    <PageTransition>
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

        {isLoading ? (
          <TableSkeleton rows={10} />
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <DataTable
                data={filteredProducts}
                columns={[
                  { 
                    header: t('products.name'), 
                    accessor: (row: Product) => (
                      <div className="min-w-[120px]">
                        <p className="font-medium text-sm md:text-base">{row.name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{row.barcode}</p>
                      </div>
                    )
                  },
                  { 
                    header: t('products.sku'), 
                    accessor: (row: Product) => row.barcode || '-',
                  },
                  { 
                    header: t('products.category'), 
                    accessor: (row: Product) => row.category?.name || '-',
                  },
                  { 
                    header: t('products.price'), 
                    accessor: (row: Product) => (
                      <span className="text-sm md:text-base font-semibold">
                        ${row.price.toFixed(2)}
                      </span>
                    )
                  },
                  { 
                    header: t('products.stock'), 
                    accessor: (row: Product) => (
                      <Badge 
                        variant={row.stock <= 5 ? 'destructive' : 'default'}
                        className="text-xs"
                      >
                        {row.stock}
                      </Badge>
                    )
                  },
                  { 
                    header: t('products.actions'), 
                    accessor: (row: Product) => (
                      <div className="flex gap-1 md:gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingProduct(row);
                            setIsFormOpen(true);
                          }}
                        >
                          <Edit className="h-3 w-3 md:h-4 md:w-4" />
                        </Button>
                      </div>
                    )
                  },
                ]}
              />
            </div>
          </div>
        )}

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
    </PageTransition>
  );
}
