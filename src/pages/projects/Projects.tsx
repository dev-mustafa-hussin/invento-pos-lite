import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, CreateProjectRequest } from '@/services/projectService';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Folder, Calendar, CheckCircle2 } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Projects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateProjectRequest>();

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: projectService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setIsDialogOpen(false);
      reset();
      toast({
        title: "Project created",
        description: "The new project has been successfully created.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: CreateProjectRequest) => {
    // Default status to NotStarted (0)
    createMutation.mutate({ ...data, status: 0 });
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-gray-100 text-gray-800';
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 0: return 'Not Started';
      case 1: return 'In Progress';
      case 2: return 'Completed';
      case 3: return 'On Hold';
      default: return 'Unknown';
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage client projects and tasks
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                  <Input id="name" {...register('name', { required: true })} />
                  {errors.name && <span className="text-xs text-red-500">Required</span>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" {...register('description')} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input id="startDate" type="date" {...register('startDate', { required: true })} />
                    {errors.startDate && <span className="text-xs text-red-500">Required</span>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input id="endDate" type="date" {...register('endDate')} />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Project
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects?.map((project) => {
              const progress = project.taskCount > 0 
                ? (project.completedTaskCount / project.taskCount) * 100 
                : 0;

              return (
                <Link key={project.id} to={`/projects/${project.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg font-semibold truncate pr-2">
                          {project.name}
                        </CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs whitespace-nowrap ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                        {project.description || "No description provided."}
                      </p>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <div className="space-y-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          {format(new Date(project.startDate), 'MMM dd, yyyy')}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Progress</span>
                            <span>{Math.round(progress)}%</span>
                          </div>
                          <Progress value={progress} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 border-t text-xs text-muted-foreground flex justify-between">
                      <div className="flex items-center">
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {project.completedTaskCount} / {project.taskCount} tasks
                      </div>
                      {project.customerName && (
                        <div className="flex items-center">
                          <Folder className="mr-1 h-3 w-3" />
                          {project.customerName}
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
            {projects?.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                No projects found. Create one to get started.
              </div>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
