import { Department, Expert, Schedule, Appointment, SystemSettings } from '../types';
import dayjs from 'dayjs';

// Mock数据生成器
const generateMockData = () => {
  // 科室数据
  const departments: Department[] = [
    {
      id: 'dept-1',
      name: '内科',
      specialties: ['心血管内科', '呼吸内科', '消化内科', '内分泌科'],
      description: '内科是医院的重要科室之一，主要负责内科疾病的诊断和治疗。'
    },
    {
      id: 'dept-2',
      name: '外科',
      specialties: ['普外科', '骨外科', '神经外科', '泌尿外科'],
      description: '外科主要负责需要手术治疗的疾病。'
    },
    {
      id: 'dept-3',
      name: '妇产科',
      specialties: ['妇科', '产科', '计划生育科'],
      description: '妇产科负责女性生殖系统疾病及孕产期保健。'
    },
    {
      id: 'dept-4',
      name: '儿科',
      specialties: ['新生儿科', '小儿内科', '小儿外科'],
      description: '儿科专门负责儿童疾病的诊断和治疗。'
    },
    {
      id: 'dept-5',
      name: '眼科',
      specialties: ['白内障科', '青光眼科', '视网膜科'],
      description: '眼科负责眼部疾病的诊断和治疗。'
    },
    {
      id: 'dept-6',
      name: '耳鼻喉科',
      specialties: ['耳科', '鼻科', '咽喉科'],
      description: '耳鼻喉科负责耳、鼻、咽喉相关疾病的诊治。'
    }
  ];

  // 专家数据
  const experts: Expert[] = [
    {
      id: 'expert-1',
      name: '张医生',
      departmentId: 'dept-1',
      title: '主任医师',
      specialty: '心血管内科',
      maxAppointments: 20,
      description: '擅长心血管疾病诊治，有20年临床经验。'
    },
    {
      id: 'expert-2',
      name: '李医生',
      departmentId: 'dept-1',
      title: '副主任医师',
      specialty: '呼吸内科',
      maxAppointments: 15,
      description: '擅长呼吸系统疾病诊治。'
    },
    {
      id: 'expert-3',
      name: '王医生',
      departmentId: 'dept-2',
      title: '主任医师',
      specialty: '骨外科',
      maxAppointments: 10,
      description: '擅长骨科手术，关节置换等。'
    },
    {
      id: 'expert-4',
      name: '赵医生',
      departmentId: 'dept-3',
      title: '副主任医师',
      specialty: '妇科',
      maxAppointments: 18,
      description: '擅长妇科微创手术。'
    },
    {
      id: 'expert-5',
      name: '陈医生',
      departmentId: 'dept-4',
      title: '主治医师',
      specialty: '小儿内科',
      maxAppointments: 25,
      description: '擅长儿童常见病诊治。'
    }
  ];

  // 排班数据
  const schedules: Schedule[] = [];
  const today = dayjs();
  
  // 生成未来7天的排班数据
  for (let i = 0; i < 7; i++) {
    const date = today.add(i, 'day').format('YYYY-MM-DD');
    experts.forEach(expert => {
      // 每个专家每天最多3个时段（上午、下午、晚上）
      ['morning', 'afternoon', 'evening'].forEach(timeSlot => {
        // 随机生成可预约数量
        const maxSlots = expert.maxAppointments / 3; // 假设一天分3个时段
        const availableSlots = Math.floor(Math.random() * (maxSlots + 1)); // 随机剩余号源
        
        schedules.push({
          id: `sched-${expert.id}-${date}-${timeSlot}`,
          expertId: expert.id,
          date,
          timeSlot,
          availableSlots,
          maxSlots
        });
      });
    });
  }

  // 预约数据
  const appointments: Appointment[] = [
    {
      id: 'appt-1',
      patientId: 'patient-1',
      patientName: '患者甲',
      expertId: 'expert-1',
      expertName: '张医生',
      departmentId: 'dept-1',
      departmentName: '内科',
      scheduleId: `sched-expert-1-${today.format('YYYY-MM-DD')}-morning`,
      appointmentDate: today.format('YYYY-MM-DD'),
      timeSlot: 'morning',
      status: 'confirmed',
      createTime: dayjs().subtract(1, 'day').toISOString(),
      confirmTime: dayjs().subtract(1, 'day').toISOString(),
      notes: '高血压复诊'
    },
    {
      id: 'appt-2',
      patientId: 'patient-2',
      patientName: '患者乙',
      expertId: 'expert-2',
      expertName: '李医生',
      departmentId: 'dept-1',
      departmentName: '内科',
      scheduleId: `sched-expert-2-${today.add(1, 'day').format('YYYY-MM-DD')}-afternoon`,
      appointmentDate: today.add(1, 'day').format('YYYY-MM-DD'),
      timeSlot: 'afternoon',
      status: 'pending',
      createTime: dayjs().toISOString(),
      notes: '感冒咳嗽'
    },
    {
      id: 'appt-3',
      patientId: 'patient-3',
      patientName: '患者丙',
      expertId: 'expert-3',
      expertName: '王医生',
      departmentId: 'dept-2',
      departmentName: '外科',
      scheduleId: `sched-expert-3-${today.add(2, 'day').format('YYYY-MM-DD')}-morning`,
      appointmentDate: today.add(2, 'day').format('YYYY-MM-DD'),
      timeSlot: 'morning',
      status: 'confirmed',
      createTime: dayjs().subtract(2, 'day').toISOString(),
      confirmTime: dayjs().subtract(1, 'day').toISOString(),
      notes: '骨科复查'
    }
  ];

  // 系统设置
  const settings: SystemSettings = {
    id: 'settings-1',
    appointmentRange: 7, // 提前7天预约
    requireConfirmation: true, // 需要确认
    maxDailyAppointments: 100 // 每日最大预约数
  };

  return {
    departments,
    experts,
    schedules,
    appointments,
    settings
  };
};

export default generateMockData;