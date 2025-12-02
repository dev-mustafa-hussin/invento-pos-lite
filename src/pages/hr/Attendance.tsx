import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendanceService } from '@/services/attendanceService';
import { employeeService } from '@/services/employeeService';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Loader2, Clock, LogIn, LogOut } from 'lucide-react';
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

export default function Attendance() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAll,
  });

  const { data: attendance, isLoading } = useQuery({
    queryKey: ['attendance', 'today'],
    queryFn: attendanceService.getToday,
    refetchInterval: 60000, // Refresh every minute
  });

  const checkInMutation = useMutation({
    mutationFn: attendanceService.checkIn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({ title: "Checked In", description: "Employee checked in successfully." });
      setSelectedEmployee('');
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.response?.data?.detail || "Failed to check in.", 
        variant: "destructive" 
      });
    },
  });

  const checkOutMutation = useMutation({
    mutationFn: attendanceService.checkOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast({ title: "Checked Out", description: "Employee checked out successfully." });
    },
    onError: (error: any) => {
      toast({ 
        title: "Error", 
        description: error.response?.data?.detail || "Failed to check out.", 
        variant: "destructive" 
      });
    },
  });

  const handleCheckIn = () => {
    if (!selectedEmployee) return;
    checkInMutation.mutate(parseInt(selectedEmployee));
  };

  const columns = [
    { header: 'Employee', accessor: 'employeeName' },
    { 
      header: 'Check In', 
      accessor: (row: any) => row.checkInTime.substring(0, 8)
    },
    { 
      header: 'Check Out', 
      accessor: (row: any) => row.checkOutTime ? row.checkOutTime.substring(0, 8) : '-'
    },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.checkOutTime ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
          {row.checkOutTime ? 'Completed' : 'Working'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        !row.checkOutTime && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => checkOutMutation.mutate(row.employeeId)}
            disabled={checkOutMutation.isPending}
          >
            <LogOut className="mr-2 h-3 w-3" />
            Check Out
          </Button>
        )
      )
    }
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track daily employee attendance
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Quick Check-in
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.filter(e => e.isActive).map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleCheckIn} disabled={!selectedEmployee || checkInMutation.isPending}>
                {checkInMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                Check In
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{attendance?.length || 0}</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold">
                  {attendance?.filter(a => !a.checkOutTime).length || 0}
                </p>
                <p className="text-xs text-muted-foreground">Currently Working</p>
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
            data={attendance || []}
            columns={columns}
          />
        )}
      </div>
    </PageTransition>
  );
}
