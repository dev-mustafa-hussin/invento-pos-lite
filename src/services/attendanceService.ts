import api from '../api/axios';

export interface AttendanceRecord {
  id: number;
  employeeId: number;
  employeeName: string;
  date: string;
  checkInTime: string;
  checkOutTime?: string;
  hoursWorked?: number;
}

export const attendanceService = {
  getToday: async () => {
    const response = await api.get<AttendanceRecord[]>('/attendance', {
      params: { date: new Date().toISOString() }
    });
    return response.data;
  },

  checkIn: async (employeeId: number) => {
    const response = await api.post<{ attendanceId: number }>('/attendance/check-in', { employeeId });
    return response.data;
  },

  checkOut: async (employeeId: number) => {
    await api.post('/attendance/check-out', { employeeId });
  },
};
