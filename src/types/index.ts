// 科室类型定义
export interface Department {
  id: string;
  name: string;
  specialties: string[];
  description?: string;
}

// 专家类型定义
export interface Expert {
  id: string;
  name: string;
  departmentId: string;
  title: string;
  specialty: string;
  photo?: string;
  maxAppointments: number; // 每日最大预约数
  description?: string;
}

// 排班类型定义
export interface Schedule {
  id: string;
  expertId: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // 如 'morning', 'afternoon', 'evening'
  availableSlots: number;
  maxSlots: number;
}

// 预约类型定义
export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  expertId: string;
  expertName: string;
  departmentId: string;
  departmentName: string;
  scheduleId: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createTime: string;
  confirmTime?: string;
  notes?: string;
}

// 系统设置类型定义
export interface SystemSettings {
  id: string;
  appointmentRange: number; // 提前预约天数
  requireConfirmation: boolean; // 是否需要确认
  maxDailyAppointments: number; // 每日最大预约数
}