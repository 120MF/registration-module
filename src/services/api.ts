// API服务定义

import type {
  Department,
  PatientProfile,
  Registration,
  Scheduling,
  Staff,
  Payment,
} from '../types';
import request from './request';

// 登录相关API
export const loginAPI = {
  login: (data: { username: string; password: string }) =>
    request.post('/login', data),
};

// 科室管理API
export const departmentAPI = {
  getDepartments: () =>
    request
      .get<{ success: boolean; data: Department[] }>('/departments')
      .then((res) => res.data),
  createDepartment: (data: Omit<Department, 'id'>) =>
    request.post<Department>('/departments', data),
  updateDepartment: (id: number, data: Partial<Department>) =>
    request.put<Department>(`/departments/${id}`, data),
  deleteDepartment: (id: number) => request.delete(`/departments/${id}`),
};

// 人员管理API
export const staffAPI = {
  getStaff: () =>
    request
      .get<{ success: boolean; data: Staff[] }>('/staff')
      .then((res) => res.data),
};

// 患者服务API
export const patientAPI = {
  getProfile: () =>
    request
      .get<{ success: boolean; data: PatientProfile }>('/patients/profile')
      .then((res) => res.data),
  updateProfile: (data: PatientProfile) =>
    request.put<PatientProfile>('/patients/profile', data),
  getDoctorsByDepartment: (deptId: number) =>
    request
      .get<{ success: boolean; data: any[] }>(
        `/departments/${deptId}/doctors`,
      )
      .then((res) => res.data),
  getDoctorSchedules: (doctorId: number) =>
    request.get<{ success: boolean; data: any[] }>(`/doctors/${doctorId}/schedules`).then(res => res.data),
  createRegistration: (data: Omit<Registration, 'id'>) =>
    request.post<Registration>('/registrations', data),
};

// 患者管理API
export const patientManagementAPI = {
  getPatients: () =>
    request
      .get<{ success: boolean; data: PatientProfile[] }>('/patients')
      .then((res) => res.data),
  getPatientById: (id: number) =>
    request
      .get<{ success: boolean; data: PatientProfile }>(`/patients/${id}`)
      .then((res) => res.data),
  createPatient: (data: Omit<PatientProfile, 'id'>) =>
    request.post<PatientProfile>('/patients', data),
  updatePatient: (id: number, data: Partial<PatientProfile>) =>
    request.put<PatientProfile>(`/patients/${id}`, data),
  deletePatient: (id: number) => request.delete(`/patients/${id}`),
};

// 管理员API
export const adminAPI = {
  // 号源管理API
  getScheduling: () =>
    request
      .get<{ success: boolean; data: Scheduling[] }>('/scheduling')
      .then((res) => res.data),
  createScheduling: (data: Omit<Scheduling, 'id'>) =>
    request.post<Scheduling>('/scheduling', data),
  updateScheduling: (id: number, data: Partial<Scheduling>) =>
    request.put<Scheduling>(`/scheduling/${id}`, data),
  deleteScheduling: (id: number) => request.delete(`/scheduling/${id}`),
  getDoctorsByDepartment: (deptId: number) =>
    request
      .get<{ success: boolean; data: any[] }>(
        `/departments/${deptId}/doctors`,
      )
      .then((res) => res.data),
  // 其他管理API
  getDepartments: () =>
    request
      .get<{ success: boolean; data: Department[] }>('/departments')
      .then((res) => res.data),
};

// 缴费管理API
export const paymentAPI = {
  getPayments: () =>
    request
      .get<{ success: boolean; data: Payment[] }>('/payments')
      .then((res) => res.data),
  getPaymentById: (id: string) =>
    request
      .get<{ success: boolean; data: Payment }>(`/payments/${id}`)
      .then((res) => res.data),
  createPayment: (data: Omit<Payment, 'id'>) =>
    request.post<Payment>('/payments', data),
  updatePayment: (id: string, data: Partial<Payment>) =>
    request.put<Payment>(`/payments/${id}`, data),
  // 退费操作
  refundPayment: (id: string, refundReason?: string) =>
    request.put<Payment>(`/payments/${id}/refund`, { refundReason }),
};

