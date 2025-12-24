// 科室类型定义
export interface Department {
  id: number;
  name: string;
  status: number; // 1: 启用, 0: 停用
  desc?: string;
}

// 人员类型定义
export interface Staff {
  id: number;
  name: string;
  departmentId: number;
  position: string;
  role: string;
}

// 设备类型定义
export interface Device {
  id: number;
  name: string;
  departmentId: number;
  purchaseDate: string; // YYYY-MM-DD
  status: string;
}

// 药品类型定义
export interface Drug {
  id: number;
  name: string;
  price: number;
  unit: string;
  stock: number;
  status: number; // 1: 启用, 0: 停用
}

// 检查项目类型定义
export interface Examination {
  id: number;
  name: string;
  price: number;
  type: string;
  status: number; // 1: 启用, 0: 停用
}

// 检验项目类型定义
export interface Test {
  id: number;
  name: string;
  price: number;
  type: string;
  status: number; // 1: 启用, 0: 停用
}

// 患者类型定义
export interface Patient {
  id: string;
  patientName: string;
  age: number;
  status: string; // 'waiting', 'in-progress', 'completed'
  time: string;
}

// 患者档案类型定义
export interface PatientProfile {
  id: number;
  name: string;
  gender: string;
  birthDate: string; // YYYY-MM-DD
  phone: string;
  isInsurance: boolean;
  allergies?: string;
  medicalHistory?: string;
}

// 就诊记录类型定义
export interface MedicalHistory {
  id: number;
  date: string; // YYYY-MM-DD
  doctor: string;
  department: string;
  diagnosis: string;
  prescriptions: Prescription[];
}

// 处方类型定义
export interface Prescription {
  name: string;
  quantity: number;
  dosage: string;
}

// 医生类型定义
export interface Doctor {
  id: number;
  name: string;
  departmentId: number;
}

// 号源类型定义
export interface Scheduling {
  id: number;
  departmentId: number;
  departmentName: string;
  doctorId: number;
  doctorName: string;
  date: string; // YYYY-MM-DD
  timeSlot: string;
  maxPatients: number;
  booked: number;
  status: number; // 1: 启用, 0: 停用
}

// 挂号类型定义
export interface Registration {
  id: string;
  departmentId: number;
  doctorId: number;
  scheduleId: number;
  patientName: string;
  status: string;
  createTime?: string;
}

// 系统设置类型定义
export interface SystemSettings {
  id: string;
  appointmentRange: number; // 提前预约天数
  requireConfirmation: boolean; // 是否需要确认
  maxDailyAppointments: number; // 每日最大预约数
}