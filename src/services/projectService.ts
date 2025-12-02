import api from '../api/axios';

export interface Project {
  id: number;
  name: string;
  description?: string;
  customerId?: number;
  customerName?: string;
  startDate: string;
  endDate?: string;
  status: number; // 0: NotStarted, 1: InProgress, 2: Completed, 3: OnHold
  taskCount: number;
  completedTaskCount: number;
  tasks: ProjectTask[];
}

export interface ProjectTask {
  id: number;
  title: string;
  description?: string;
  status: number; // 0: Todo, 1: InProgress, 2: Review, 3: Done
  assignedEmployeeId?: number;
  assignedEmployeeName?: string;
  dueDate?: string;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  customerId?: number;
  startDate: string;
  endDate?: string;
  status: number;
}

export interface CreateTaskRequest {
  projectId: number;
  title: string;
  description?: string;
  assignedEmployeeId?: number;
  dueDate?: string;
}

export const projectService = {
  getAll: async () => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  create: async (data: CreateProjectRequest) => {
    const response = await api.post<{ projectId: number }>('/projects', data);
    return response.data;
  },

  createTask: async (data: CreateTaskRequest) => {
    const response = await api.post<{ taskId: number }>('/projects/tasks', data);
    return response.data;
  },

  updateTaskStatus: async (taskId: number, status: number) => {
    await api.put(`/projects/tasks/${taskId}/status`, { taskId, status });
  },
};
