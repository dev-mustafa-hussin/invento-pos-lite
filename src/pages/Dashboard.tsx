import { useEffect, useState } from 'react';
import { StatCard } from '@/components/StatCard';
import { DataTable } from '@/components/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, FileText, AlertTriangle, TrendingUp } from 'lucide-react';
import { dashboardAPI } from '@/services/mockDataService';
import { DashboardStats } from '@/types';
import { useTranslation } from 'react-i18next';
import { PageTransition } from '@/components/PageTransition';
import { StatCardSkeleton, TableSkeleton } from '@/components/LoadingSkeleton';
import { StaggerContainer, StaggerItem } from '@/components/animations/FadeIn';

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

  return (
    <PageTransition>
      <div className="space-y-4 md:space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('dashboard.title')}</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">{t('dashboard.subtitle')}</p>
        </div>

        {loading ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{t('dashboard.lowStockProducts')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TableSkeleton rows={3} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{t('dashboard.recentSales')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TableSkeleton rows={3} />
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <StaggerItem>
                <StatCard
                  title={t('dashboard.todaySales')}
                  value={`$${stats?.todaySales.toFixed(2) || '0.00'}`}
                  icon={DollarSign}
                  variant="success"
                  trend={{ value: '+12.5%', isPositive: true }}
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  title={t('dashboard.totalInvoices')}
                  value={stats?.todayInvoices || 0}
                  icon={FileText}
                  variant="default"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  title={t('dashboard.lowStock')}
                  value={stats?.lowStockProducts.length || 0}
                  icon={AlertTriangle}
                  variant="warning"
                />
              </StaggerItem>
              <StaggerItem>
                <StatCard
                  title={t('dashboard.revenueTrend')}
                  value="+23.5%"
                  icon={TrendingUp}
                  variant="success"
                />
              </StaggerItem>
            </StaggerContainer>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{t('dashboard.lowStockProducts')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                      <DataTable
                        data={stats.lowStockProducts}
                        columns={[
                          { header: t('products.name'), accessor: 'name' },
                          { 
                            header: t('products.stock'), 
                            accessor: (row) => (
                              <Badge variant="destructive" className="text-xs">
                                {row.stock}
                              </Badge>
                            )
                          },
                          { 
                            header: 'Min', 
                            accessor: (row) => <span className="text-xs md:text-sm">{row.minimumStock}</span>
                          },
                        ]}
                      />
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-muted-foreground text-center py-8">
                      {t('dashboard.allStocked')}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg md:text-xl">{t('dashboard.recentSales')}</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.recentSales && stats.recentSales.length > 0 ? (
                    <div className="overflow-x-auto -mx-2 sm:mx-0">
                      <DataTable
                        data={stats.recentSales}
                        columns={[
                          { header: 'Invoice', accessor: 'invoiceNumber' },
                          { 
                            header: 'Time', 
                            accessor: (row) => (
                              <span className="text-xs md:text-sm">
                                {new Date(row.date).toLocaleTimeString([], { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            )
                          },
                          { 
                            header: t('sales.total'), 
                            accessor: (row) => (
                              <span className="text-xs md:text-sm font-semibold">
                                ${row.total.toFixed(2)}
                              </span>
                            )
                          },
                        ]}
                      />
                    </div>
                  ) : (
                    <p className="text-sm md:text-base text-muted-foreground text-center py-8">
                      {t('dashboard.noSales')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </PageTransition>
  );
}
