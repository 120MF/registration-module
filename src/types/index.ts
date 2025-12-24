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