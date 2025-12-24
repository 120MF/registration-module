// API服务定义

import type {
  Department,
  Device,
  Doctor,
  Drug,
  Examination,
  MedicalHistory,
  Patient,
  PatientProfile,
  Registration,
  Scheduling,
  Staff,
  Test,
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

// 设备管理API
export const deviceAPI = {
  getDevices: () =>
    request
      .get<{ success: boolean; data: Device[] }>('/devices')
      .then((res) => res.data),
};

// 字典管理API
export const dictAPI = {
  getDrugs: () =>
    request
      .get<{ success: boolean; data: Drug[] }>('/drugs')
      .then((res) => res.data),
  getExaminations: () =>
    request
      .get<{ success: boolean; data: Examination[] }>('/examinations')
      .then((res) => res.data),
  getTests: () =>
    request
      .get<{ success: boolean; data: Test[] }>('/tests')
      .then((res) => res.data),
};

// 医生工作站API
export const doctorAPI = {
  getPatientQueue: () =>
    request
      .get<{ success: boolean; data: Patient[] }>('/patients/queue')
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
      .get<{ success: boolean; data: Doctor[] }>(
        `/departments/${deptId}/doctors`,
      )
      .then((res) => res.data),
  getDoctorSchedules: (doctorId: number) =>
    request.get<{ success: boolean; data: any[] }>(`/doctors/${doctorId}/schedules`).then(res => res.data),
  createRegistration: (data: Omit<Registration, 'id'>) =>
    request.post<Registration>('/registrations', data),
  getHistory: () =>
    request
      .get<{ success: boolean; data: MedicalHistory[] }>('/patients/history')
      .then((res) => res.data),
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
      .get<{ success: boolean; data: Doctor[] }>(
        `/departments/${deptId}/doctors`,
      )
      .then((res) => res.data),
  // 其他管理API
  getDepartments: () =>
    request
      .get<{ success: boolean; data: Department[] }>('/departments')
      .then((res) => res.data),
};

