import api from '../api/axios';

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  joinDate: string;
  baseSalary: number;
  isActive: boolean;
}

export interface CreateEmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  joinDate: string;
  baseSalary: number;
}

export const employeeService = {
  getAll: async () => {
    const response = await api.get<Employee[]>('/employees');
    return response.data;
  },

  create: async (data: CreateEmployeeRequest) => {
    const response = await api.post<{ employeeId: number }>('/employees', data);
    return response.data;
  },
};
