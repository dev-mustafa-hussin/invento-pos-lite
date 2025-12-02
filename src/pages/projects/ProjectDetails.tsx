import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, CreateTaskRequest, ProjectTask } from '@/services/projectService';
import { employeeService } from '@/services/employeeService';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Calendar, User } from 'lucide-react';
import { PageTransition } from '@/components/PageTransition';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || '0');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<CreateTaskRequest>();

  const { data: projects, isLoading: isProjectLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getAll,
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: employeeService.getAll,
  });

  const project = projects?.find(p => p.id === projectId);

  const createTaskMutation = useMutation({
    mutationFn: projectService.createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsTaskDialogOpen(false);
      reset();
      toast({
        title: "Task added",
        description: "The new task has been successfully added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number, status: number }) => 
      projectService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const onTaskSubmit = (data: CreateTaskRequest) => {
    createTaskMutation.mutate({ ...data, projectId });
  };

  const onDragStart = (e: React.DragEvent, taskId: number) => {
    e.dataTransfer.setData('taskId', taskId.toString());
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent, status: number) => {
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    updateStatusMutation.mutate({ taskId, status });
  };

  if (isProjectLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const taskColumns = [
    { title: 'To Do', status: 0, color: 'bg-gray-100' },
    { title: 'In Progress', status: 1, color: 'bg-blue-50' },
    { title: 'Review', status: 2, color: 'bg-yellow-50' },
    { title: 'Done', status: 3, color: 'bg-green-50' },
  ];

  return (
    <PageTransition>
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            <p className="text-muted-foreground">
              {project.description}
            </p>
          </div>
          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onTaskSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input id="title" {...register('title', { required: true })} />
                  {errors.title && <span className="text-xs text-red-500">Required</span>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" {...register('description')} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignedEmployeeId">Assign To</Label>
                  <Select onValueChange={(val) => setValue('assignedEmployeeId', parseInt(val))}>
                    <SelectTrigger>
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" {...register('dueDate')} />
                </div>

                <Button type="submit" className="w-full" disabled={createTaskMutation.isPending}>
                  {createTaskMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Task
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 h-full min-w-[1000px]">
            {taskColumns.map((column) => (
              <div 
                key={column.status} 
                className={`flex-1 rounded-lg p-4 ${column.color} flex flex-col gap-3`}
                onDragOver={onDragOver}
                onDrop={(e) => onDrop(e, column.status)}
              >
                <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-500 mb-2">
                  {column.title}
                  <span className="ml-2 bg-white px-2 py-0.5 rounded-full text-xs border">
                    {project.tasks.filter(t => t.status === column.status).length}
                  </span>
                </h3>
                
                <div className="space-y-3 overflow-y-auto flex-1">
                  {project.tasks
                    .filter(t => t.status === column.status)
                    .map((task) => (
                      <Card 
                        key={task.id} 
                        draggable 
                        onDragStart={(e) => onDragStart(e, task.id)}
                        className="cursor-move hover:shadow-md transition-all active:cursor-grabbing"
                      >
                        <CardContent className="p-3 space-y-2">
                          <p className="font-medium text-sm">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between pt-2 border-t mt-2">
                            {task.assignedEmployeeName && (
                              <div className="flex items-center text-xs text-muted-foreground" title="Assignee">
                                <User className="mr-1 h-3 w-3" />
                                {task.assignedEmployeeName.split(' ')[0]}
                              </div>
                            )}
                            {task.dueDate && (
                              <div className="flex items-center text-xs text-muted-foreground" title="Due Date">
                                <Calendar className="mr-1 h-3 w-3" />
                                {format(new Date(task.dueDate), 'MMM dd')}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
