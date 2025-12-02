import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsService } from '@/services/reportsService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { addDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { Loader2, AlertTriangle } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { useTranslation } from 'react-i18next';
import { DataTable } from '@/components/DataTable';
import { Badge } from '@/components/ui/badge';

export default function Reports() {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });

  const { data: salesData, isLoading: salesLoading } = useQuery({
    queryKey: ['salesReport', dateRange],
    queryFn: () =>
      reportsService.getSalesReport(
        dateRange?.from?.toISOString(),
        dateRange?.to?.toISOString()
      ),
    enabled: !!dateRange?.from && !!dateRange?.to,
  });

  const { data: topProducts, isLoading: topProductsLoading } = useQuery({
    queryKey: ['topProducts'],
    queryFn: () => reportsService.getTopProducts(5),
  });

  const { data: lowStock, isLoading: lowStockLoading } = useQuery({
    queryKey: ['lowStock'],
    queryFn: reportsService.getLowStock,
  });

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('app.reports')}</h1>
          <p className="text-muted-foreground">
            Analyze your business performance
          </p>
        </div>

        <Tabs defaultValue="sales" className="space-y-4">
          <TabsList>
            <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
            <TabsTrigger value="inventory">Inventory Health</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-4">
            <div className="flex justify-end">
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Over Time</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  {salesLoading ? (
                    <div className="h-[350px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={350}>
                      <LineChart data={salesData}>
                        <XAxis
                          dataKey="date"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip 
                          labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                        />
                        <Line
                          type="monotone"
                          dataKey="totalRevenue"
                          stroke="#8884d8"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>
                    By quantity sold
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {topProductsLoading ? (
                    <div className="h-[350px] flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin" />
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height={350}>
                      <BarChart data={topProducts} layout="vertical" margin={{ left: 0 }}>
                        <XAxis type="number" hide />
                        <YAxis
                          dataKey="productName"
                          type="category"
                          width={100}
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <Tooltip />
                        <Bar dataKey="quantitySold" fill="#adfa1d" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Low Stock Alert
                </CardTitle>
                <CardDescription>
                  Products that are below their minimum stock level
                </CardDescription>
              </CardHeader>
              <CardContent>
                {lowStockLoading ? (
                  <div className="h-[200px] flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                ) : (
                  <DataTable
                    data={lowStock || []}
                    columns={[
                      { header: 'Product Name', accessor: 'name' },
                      { 
                        header: 'Current Stock', 
                        accessor: (row) => (
                          <span className="text-destructive font-bold">{row.stock}</span>
                        )
                      },
                      { header: 'Min. Stock', accessor: 'minimumStock' },
                      {
                        header: 'Status',
                        accessor: () => <Badge variant="destructive">Low Stock</Badge>
                      }
                    ]}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
