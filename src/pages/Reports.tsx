import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { Calendar, Download, FileText } from 'lucide-react';
import { reportsAPI } from '@/services/mockDataService';
import { DailyReport } from '@/types';

export default function Reports() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [report, setReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReport();
  }, [selectedDate]);

  const loadReport = async () => {
    try {
      const data = await reportsAPI.getDailyReport(selectedDate);
      setReport(data);
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    // TODO: Implement PDF export with backend API
    alert('PDF export will be implemented with backend integration');
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export with backend API
    alert('Excel export will be implemented with backend integration');
  };

  if (loading) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Daily Reports</h1>
          <p className="text-muted-foreground mt-1">Sales analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <FileText className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Report Date</CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="px-3 py-2 border border-border rounded-md bg-background"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
            <p className="text-3xl font-bold text-primary mt-2">
              ${report?.totalSales.toFixed(2) || '0.00'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Invoices</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {report?.invoiceCount || 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <p className="text-sm font-medium text-muted-foreground">Avg. Sale Value</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              ${report && report.invoiceCount > 0 
                ? (report.totalSales / report.invoiceCount).toFixed(2) 
                : '0.00'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          {report?.topProducts && report.topProducts.length > 0 ? (
            <DataTable
              data={report.topProducts.map((p, index) => ({ ...p, id: p.productId }))}
              columns={[
                { 
                  header: '#', 
                  accessor: (row) => {
                    const index = report.topProducts.findIndex(p => p.productId === row.productId);
                    return index + 1;
                  }
                },
                { header: 'Product', accessor: 'productName' },
                { header: 'Quantity Sold', accessor: 'quantitySold' },
                { 
                  header: 'Revenue', 
                  accessor: (row) => `$${row.revenue.toFixed(2)}`
                },
              ]}
            />
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No sales data for this date
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
