// API服务定义

import type {
  Department,
  PatientProfile,
  Registration,
  Scheduling,
  Staff,
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

