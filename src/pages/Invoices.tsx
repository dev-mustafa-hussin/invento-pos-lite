import { useState } from 'react';
import { DataTable } from '@/components/DataTable';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Loader2 } from 'lucide-react';
import { salesService } from '@/services/salesService';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import { useQuery } from '@tanstack/react-query';

export default function Invoices() {
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices', searchQuery],
    queryFn: () => salesService.getAll(1, 50, searchQuery),
  });

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

        {isLoading ? (
          <TableSkeleton rows={10} />
        ) : (
          <DataTable
            data={invoices}
            columns={[
              { header: 'Invoice #', accessor: 'invoiceNumber' },
              { 
                header: 'Date', 
                accessor: (row) => new Date(row.date).toLocaleDateString()
              },
              { 
                header: 'Total Amount', 
                accessor: (row) => `$${row.totalAmount.toFixed(2)}`
              },
              { 
                header: 'Status', 
                accessor: (row) => (
                  <Badge variant={row.status === 'completed' ? 'default' : 'secondary'}>
                    {row.status}
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
