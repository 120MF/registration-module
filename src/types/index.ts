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
  idCard: string; // 身份证号
  isInsurance: boolean;
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

// 缴费类型定义
export interface Payment {
  id: string;
  registrationId: string; // 关联的挂号ID
  patientName: string;
  amount: number; // 缴费金额
  paymentMethod: string; // 缴费方式: cash, card, wechat, alipay 等
  status: 'paid' | 'refunded' | 'pending'; // 支付状态
  createTime: string; // 创建时间
  refundTime?: string; // 退费时间（如果已退费）
  refundReason?: string; // 退费原因
}