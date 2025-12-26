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
  amount: number; // 挂号费用
}

// 挂号类型定义
export interface Registration {
  id: string;
  departmentId: number;
  doctorId: number;
  scheduleId: number;
  patientName: string;
  patientId?: number;
  status: string;
  createTime?: string;
  scheduleDate?: string;
  hasPrescription?: boolean;
}

// 医生视图的挂号类型
export interface DoctorRegistration extends Registration {
  patientId: number;
  scheduleDate: string;
  hasPrescription: boolean;
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

// 处方类型定义
export interface Prescription {
  prescription_id: string; // 处方唯一 ID（ UUID）
  reg_id: string; // 关联挂号表的挂号 ID（外键）
  patient_id: number; // 关联患者表的患者 ID（外键）
  staff_id: number; // 关联医生表的医生 ID（外键）
  prescription_date: string; // 处方开具时间
  prescription_status: number; // 处方状态：1 = 有效，0 = 作废，2 = 已归档
  symptoms: string; // 病人症状
  diagnosis: string; // 诊断结果
  create_time: string; // 记录创建时间
  update_time: string; // 记录更新时间
  remark?: string; // 处方备注（如特殊说明）
}
