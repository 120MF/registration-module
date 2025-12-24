// API服务定义
import request from './request';

// 登录相关API
export const loginAPI = {
  login: (data: { username: string; password: string }) => request.post('/login', data),
};

// 科室管理API
export const departmentAPI = {
  getDepartments: () => request.get('/departments'),
  createDepartment: (data: any) => request.post('/departments', data),
  updateDepartment: (id: number, data: any) => request.put(`/departments/${id}`, data),
  deleteDepartment: (id: number) => request.delete(`/departments/${id}`),
};

// 人员管理API
export const staffAPI = {
  getStaff: () => request.get('/staff'),
};

// 设备管理API
export const deviceAPI = {
  getDevices: () => request.get('/devices'),
};

// 字典管理API
export const dictAPI = {
  getDrugs: () => request.get('/drugs'),
  getExaminations: () => request.get('/examinations'),
  getTests: () => request.get('/tests'),
};

// 医生工作站API
export const doctorAPI = {
  getPatientQueue: () => request.get('/patients/queue'),
};

// 患者服务API
export const patientAPI = {
  getProfile: () => request.get('/patients/profile'),
  updateProfile: (data: any) => request.put('/patients/profile', data),
  getDoctorsByDepartment: (deptId: number) => request.get(`/departments/${deptId}/doctors`),
  getDoctorSchedules: (doctorId: number) => request.get(`/doctors/${doctorId}/schedules`),
  createRegistration: (data: any) => request.post('/registrations', data),
  getHistory: () => request.get('/patients/history'),
};