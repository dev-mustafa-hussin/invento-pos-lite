import { useEffect, useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Calendar } from 'lucide-react';
import { salesAPI } from '@/services/mockDataService';
import { SaleInvoice } from '@/types';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { TableSkeleton } from '@/components/LoadingSkeleton';

// TODO: Replace salesAPI.getAll with real GET /api/sales endpoint

export default function Invoices() {
  const [invoices, setInvoices] = useState<SaleInvoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<SaleInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = invoices.filter(i =>
        i.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  }, [searchQuery, invoices]);

  const loadInvoices = async () => {
    try {
      const data = await salesAPI.getAll();
      setInvoices(data);
      setFilteredInvoices(data);
    } catch (error) {
      console.error('Failed to load invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('app.invoices')}</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">View and manage sales history</p>
          </div>
          <Button variant="outline" className="w-full sm:w-auto">
            <Calendar className="h-4 w-4 mr-2" />
            Filter by Date
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton rows={10} />
        ) : (
          <DataTable
            data={filteredInvoices}
            columns={[
              { header: 'Invoice #', accessor: 'invoiceNumber' },
              { 
                header: 'Date', 
                accessor: (row) => new Date(row.date).toLocaleDateString()
              },
              { 
                header: 'Items', 
                accessor: (row) => row.items.length
              },
              { 
                header: t('sales.total'), 
                accessor: (row) => `$${row.total.toFixed(2)}`
              },
              { 
                header: 'Payment', 
                accessor: (row) => (
                  <Badge variant="outline">
                    {row.paymentMethod}
                  </Badge>
                )
              },
            ]}
          />
        )}
      </div>
    </PageTransition>
  );
}
