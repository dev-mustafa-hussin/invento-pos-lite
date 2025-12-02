import api from '../api/axios';

export interface PayrollRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  month: number;
  year: number;
  baseSalary: number;
  bonuses: number;
  deductions: number;
  netSalary: number;
  isPaid: boolean;
  generatedDate: string;
}

export const payrollService = {
  getAll: async (month?: number, year?: number) => {
    const response = await api.get<PayrollRecord[]>('/payroll', {
      params: { month, year }
    });
    return response.data;
  },

  generate: async (month: number, year: number) => {
    const response = await api.post<{ generatedCount: number }>('/payroll/generate', { month, year });
    return response.data;
  },
};
