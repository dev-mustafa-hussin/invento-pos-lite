import { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { DataTable } from '@/components/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { dashboardAPI } from '@/services/mockDataService';
import { DashboardStats } from '@/types';
import { useTranslation } from 'react-i18next';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await dashboardAPI.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={t('dashboard.todaySales')}
          value={`$${stats?.todaySales.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          variant="success"
          trend={{ value: '+12.5% from yesterday', isPositive: true }}
        />
        <StatCard
          title={t('dashboard.totalInvoices')}
          value={stats?.todayInvoices || 0}
          icon={FileText}
          variant="default"
        />
        <StatCard
          title={t('dashboard.lowStock')}
          value={stats?.lowStockProducts.length || 0}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title={t('dashboard.revenueTrend')}
          value="+23.5%"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.lowStockProducts')}</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              <DataTable
                data={stats.lowStockProducts}
                columns={[
                  { header: t('products.name'), accessor: 'name' },
                  { 
                    header: t('products.stock'), 
                    accessor: (row) => (
                      <Badge variant="destructive">
                        {row.stock} units
                      </Badge>
                    )
                  },
                  { 
                    header: 'Min. Stock', 
                    accessor: (row) => `${row.minimumStock} units`
                  },
                ]}
              />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                {t('dashboard.allStocked')}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentSales')}</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentSales && stats.recentSales.length > 0 ? (
              <DataTable
                data={stats.recentSales}
                columns={[
                  { header: 'Invoice', accessor: 'invoiceNumber' },
                  { 
                    header: 'Time', 
                    accessor: (row) => new Date(row.date).toLocaleTimeString()
                  },
                  { 
                    header: t('sales.total'), 
                    accessor: (row) => `$${row.total.toFixed(2)}`
                  },
                ]}
              />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                {t('dashboard.noSales')}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
