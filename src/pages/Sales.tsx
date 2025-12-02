import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Minus, Trash2, ShoppingCart, Printer, Loader2 } from 'lucide-react';
import { productService, Product } from '@/services/productService';
import { salesService, Invoice } from '@/services/salesService';
import { useToast } from '@/hooks/use-toast';
import { Receipt } from '@/components/Receipt';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { AnimatedCard } from '@/components/animations/AnimatedCard';
import { StaggerContainer, StaggerItem } from '@/components/animations/FadeIn';
import { useQuery } from '@tanstack/react-query';

// Local interface for Cart Item
interface CartItem {
  id: string; // unique ID for cart item (timestamp + productId)
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  lineTotal: number;
}

export default function Sales() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState(''); // Just for display on receipt for now
  const [lastSale, setLastSale] = useState<Invoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const receiptRef = useRef<HTMLDivElement>(null);

  // Fetch products with search
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products', searchQuery],
    queryFn: () => productService.getAll(1, 50, undefined, searchQuery),
  });

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast({
          title: t('sales.insufficientStock'),
          description: `Only ${product.stock} units available`,
          variant: 'destructive',
        });
        return;
      }
      updateQuantity(existing.id, existing.quantity + 1);
    } else {
      const newItem: CartItem = {
        id: `${Date.now()}-${product.id}`,
        productId: product.id,
        productName: product.name,
        quantity: 1,
        unitPrice: product.price,
        discount: 0,
        lineTotal: product.price,
      };
      setCart([...cart, newItem]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }

    const item = cart.find(i => i.id === itemId);
    if (item) {
      const product = products.find(p => p.id === item.productId);
      // Note: This check relies on the currently fetched products. 
      // Ideally, we should check against the "real" stock, but for POS UI this is acceptable.
      if (product && newQuantity > product.stock) {
        toast({
          title: t('sales.insufficientStock'),
          description: `Only ${product.stock} units available`,
          variant: 'destructive',
        });
        return;
      }
    }

    setCart(cart.map(item => {
      if (item.id === itemId) {
        const lineTotal = (newQuantity * item.unitPrice) * (1 - item.discount / 100);
        return { ...item, quantity: newQuantity, lineTotal };
      }
      return item;
    }));
  };

  const updateDiscount = (itemId: string, discount: number) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const lineTotal = (item.quantity * item.unitPrice) * (1 - discount / 100);
        return { ...item, discount, lineTotal };
      }
      return item;
    }));
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setCustomerName('');
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalDiscount = cart.reduce((sum, item) => 
    sum + (item.quantity * item.unitPrice * item.discount / 100), 0
  );
  const tax = (subtotal - totalDiscount) * 0.15; // 15% tax (Hardcoded for now, should come from settings)
  const total = subtotal - totalDiscount + tax;

  const handlePrint = () => {
    window.print();
  };

  const completeSale = async () => {
    if (cart.length === 0) return;

    setIsProcessing(true);
    try {
      const invoiceData = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discount: item.discount
        })),
        paymentMethod: 'cash',
        // customerId: 1 // Default customer for now if needed
      };

      const newInvoice = await salesService.createInvoice(invoiceData);

      setLastSale(newInvoice);
      
      toast({
        title: t('sales.success'),
        description: `Invoice ${newInvoice.invoiceNumber} created`,
      });

      clearCart();
      // Refetch products to update stock
      // In a real app, we might want to invalidate queries
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to complete sale',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-4 md:space-y-6 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('sales.title')}</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">{t('sales.subtitle')}</p>
          </div>
          {lastSale && (
            <Button variant="outline" onClick={handlePrint} className="w-full sm:w-auto">
              <Printer className="mr-2 h-4 w-4" />
              {t('sales.printReceipt')}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2 space-y-4 order-2 lg:order-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('sales.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {isLoadingProducts ? (
               <div className="flex justify-center p-8">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
               </div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-h-[calc(100vh-400px)] lg:max-h-[calc(100vh-300px)] overflow-y-auto">
                {products.map((product) => (
                  <StaggerItem key={product.id}>
                    <AnimatedCard onClick={() => addToCart(product)}>
                      <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.barcode || 'No Barcode'}</p>
                        </div>
                        <Badge variant={product.stock <= 5 ? 'destructive' : 'default'}>
                          {product.stock}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-bold text-primary">
                          ${product.price.toFixed(2)}
                        </span>
                        <Button size="sm" onClick={() => addToCart(product)} disabled={product.stock <= 0}>
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                      </CardContent>
                    </AnimatedCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>

          <div className="space-y-4 order-1 lg:order-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  {t('sales.cart')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder={t('sales.customerName')}
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="border border-border rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-sm">{item.productName}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm text-muted-foreground ml-2">
                          × ${item.unitPrice.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Discount %"
                          value={item.discount}
                          onChange={(e) => updateDiscount(item.id, parseFloat(e.target.value) || 0)}
                          className="h-7 text-sm"
                        />
                        <span className="text-sm font-semibold whitespace-nowrap">
                          ${item.lineTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {cart.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">{t('sales.emptyCart')}</p>
                )}

                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('sales.subtotal')}:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('sales.discount')}:</span>
                    <span className="text-destructive">-${totalDiscount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('sales.tax')} (15%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>{t('sales.total')}:</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={completeSale}
                    disabled={cart.length === 0 || isProcessing}
                  >
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {t('sales.complete')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={clearCart}
                    disabled={cart.length === 0 || isProcessing}
                  >
                    {t('sales.clear')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Note: Receipt component needs to be updated to accept Invoice type if it doesn't already match */}
      {/* {lastSale && <Receipt ref={receiptRef} invoice={lastSale} />} */}
    </PageTransition>
  );
}
