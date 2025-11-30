import { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { DataTable } from '@/components/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { dashboardAPI } from '@/services/mockDataService';
import { DashboardStats } from '@/types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

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
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your store's performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Sales"
          value={`$${stats?.todaySales.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          variant="success"
          trend={{ value: '+12.5% from yesterday', isPositive: true }}
        />
        <StatCard
          title="Invoices"
          value={stats?.todayInvoices || 0}
          icon={FileText}
          variant="default"
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockProducts.length || 0}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Revenue Trend"
          value="+23.5%"
          icon={TrendingUp}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
              <DataTable
                data={stats.lowStockProducts}
                columns={[
                  { header: 'Product', accessor: 'name' },
                  { 
                    header: 'Stock', 
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
                All products are well stocked!
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
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
                    header: 'Total', 
                    accessor: (row) => `$${row.total.toFixed(2)}`
                  },
                ]}
              />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No sales today yet
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
