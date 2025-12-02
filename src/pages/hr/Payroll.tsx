import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { payrollService } from '@/services/payrollService';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign, Calendar } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export default function Payroll() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth.toString());
  const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());

  const { data: payrolls, isLoading } = useQuery({
    queryKey: ['payroll', selectedMonth, selectedYear],
    queryFn: () => payrollService.getAll(parseInt(selectedMonth), parseInt(selectedYear)),
  });

  const generateMutation = useMutation({
    mutationFn: () => payrollService.generate(parseInt(selectedMonth), parseInt(selectedYear)),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['payroll'] });
      toast({ 
        title: "Payroll Generated", 
        description: `Successfully generated payroll for ${data.generatedCount} employees.` 
      });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.response?.data?.detail || "Failed to generate payroll.", 
        variant: "destructive" 
      });
    },
  });

  const columns = [
    { header: 'Employee', accessor: 'employeeName' },
    { 
      header: 'Base Salary', 
      accessor: (row: any) => `$${row.baseSalary.toLocaleString()}` 
    },
    { 
      header: 'Bonuses', 
      accessor: (row: any) => `$${row.bonuses.toLocaleString()}` 
    },
    { 
      header: 'Deductions', 
      accessor: (row: any) => `$${row.deductions.toLocaleString()}` 
    },
    { 
      header: 'Net Salary', 
      accessor: (row: any) => (
        <span className="font-bold text-green-600">
          ${row.netSalary.toLocaleString()}
        </span>
      )
    },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
          {row.isPaid ? 'Paid' : 'Pending'}
        </span>
      )
    },
    {
      header: 'Generated Date',
      accessor: (row: any) => format(new Date(row.generatedDate), 'MMM dd, yyyy')
    }
  ];

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payroll</h1>
            <p className="text-muted-foreground">
              Manage employee salaries and payments
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map(m => (
                  <SelectItem key={m} value={m.toString()}>
                    {format(new Date(2000, m - 1, 1), 'MMMM')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map(y => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={() => generateMutation.mutate()} 
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <DollarSign className="mr-2 h-4 w-4" />}
              Generate Payroll
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Net Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${payrolls?.reduce((sum, p) => sum + p.netSalary, 0).toLocaleString() || '0'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Deductions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                ${payrolls?.reduce((sum, p) => sum + p.deductions, 0).toLocaleString() || '0'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {payrolls?.filter(p => !p.isPaid).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            data={payrolls || []}
            columns={columns}
          />
        )}
      </div>
    </PageTransition>
  );
}
