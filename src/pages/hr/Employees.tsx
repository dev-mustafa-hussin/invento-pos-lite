import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService, CreateEmployeeRequest } from '@/services/employeeService';
import { DataTable } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, User } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

export default function Employees() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateEmployeeRequest>();

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: employeeService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      setIsDialogOpen(false);
      reset();
      toast({
        title: "Employee added",
        description: "The new employee has been successfully added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateEmployeeRequest) => {
    createMutation.mutate(data);
  };

  const columns = [
    { header: 'Name', accessor: 'fullName' },
    { header: 'Job Title', accessor: 'jobTitle' },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    { 
      header: 'Join Date', 
      accessor: (row: any) => format(new Date(row.joinDate), 'MMM dd, yyyy') 
    },
    { 
      header: 'Salary', 
      accessor: (row: any) => `$${row.baseSalary.toLocaleString()}` 
    },
    {
      header: 'Status',
      accessor: (row: any) => (
        <span className={`px-2 py-1 rounded-full text-xs ${row.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Employees</h1>
            <p className="text-muted-foreground">
              Manage your team members
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" {...register('firstName', { required: true })} />
                    {errors.firstName && <span className="text-xs text-red-500">Required</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" {...register('lastName', { required: true })} />
                    {errors.lastName && <span className="text-xs text-red-500">Required</span>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" {...register('email', { required: true })} />
                  {errors.email && <span className="text-xs text-red-500">Required</span>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" {...register('phone')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input id="jobTitle" {...register('jobTitle', { required: true })} />
                  {errors.jobTitle && <span className="text-xs text-red-500">Required</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Join Date</Label>
                    <Input id="joinDate" type="date" {...register('joinDate', { required: true })} />
                    {errors.joinDate && <span className="text-xs text-red-500">Required</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baseSalary">Base Salary</Label>
                    <Input id="baseSalary" type="number" {...register('baseSalary', { required: true, min: 0 })} />
                    {errors.baseSalary && <span className="text-xs text-red-500">Required</span>}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Employee
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex h-[200px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <DataTable
            data={employees || []}
            columns={columns}
          />
        )}
      </div>
    </PageTransition>
  );
}
