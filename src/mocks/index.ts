import MockAdapter from 'axios-mock-adapter';
import request from '../services/request';
import type {
  Department,
  PatientProfile,
  Payment,
  Prescription,
  Registration,
  Scheduling,
  Staff,
} from '../types';

const mock = new MockAdapter(request, { delayResponse: 500 });

// 登录接口
mock.onPost('/login').reply((config) => {
  const { username } = JSON.parse(config.data);

  // 管理员账户
  if (username === 'admin') {
    return [
      200,
      {
        success: true,
        data: {
          token: 'mock-token-admin',
          user: {
            id: 'admin-001',
            username: 'admin',
            role: 'admin',
          },
        },
      },
    ];
  }

  // 通用患者账户
  if (username === 'patient') {
    return [
      200,
      {
        success: true,
        data: {
          token: 'mock-token-patient',
          user: {
            id: 'patient-001',
            username: 'patient',
            role: 'patient',
          },
        },
      },
    ];
  }

  // 医生姓名登录（张医生、刘医生）
  const doctorMap: Record<string, { id: number; name: string; departmentId: number; position: string }> = {
    '张医生': { id: 1, name: '张医生', departmentId: 101, position: '主任医师' },
    '刘医生': { id: 4, name: '刘医生', departmentId: 102, position: '副主任医师' },
  };

  if (doctorMap[username]) {
    const doctor = doctorMap[username];
    return [
      200,
      {
        success: true,
        data: {
          token: `mock-token-doctor-${doctor.id}`,
          user: {
            id: `doctor-${doctor.id}`,
            username: doctor.name,
            role: 'doctor',
            staffId: doctor.id,
            departmentId: doctor.departmentId,
            position: doctor.position,
          },
        },
      },
    ];
  }

  // 患者名字登录（张三、李四、王五）
  const patientMap: Record<string, { id: string; name: string }> = {
    '张三': { id: 'patient-001', name: '张三' },
    '李四': { id: 'patient-002', name: '李四' },
    '王五': { id: 'patient-003', name: '王五' },
  };

  if (patientMap[username]) {
    const patient = patientMap[username];
    return [
      200,
      {
        success: true,
        data: {
          token: `mock-token-${patient.id}`,
          user: {
            id: patient.id,
            username: patient.name,
            role: 'patient',
          },
        },
      },
    ];
  }

  return [401, { success: false, message: '用户名不存在' }];
});

// 科室管理相关接口
mock.onGet('/departments').reply(200, {
  success: true,
  data: [
    { id: 101, name: '内科', status: 1, desc: '内科诊疗' },
    { id: 102, name: '外科', status: 1, desc: '外科诊疗' },
    { id: 103, name: '儿科', status: 0, desc: '儿科诊疗' },
    { id: 104, name: '妇科', status: 1, desc: '妇科诊疗' },
    { id: 105, name: '眼科', status: 1, desc: '眼科诊疗' },
  ] as Department[],
});

mock.onPost('/departments').reply((config) => {
  const newDept = JSON.parse(config.data);
  newDept.id = Date.now(); // 简单模拟ID生成
  return [200, { success: true, data: newDept }];
});

mock.onPut(/\/departments\/\d+/).reply((config) => {
  const url = config.url;
  const id = url?.split('/').pop();
  const updatedDept = JSON.parse(config.data);
  updatedDept.id = Number(id);
  return [200, { success: true, data: updatedDept }];
});

mock.onDelete(/\/departments\/\d+/).reply((config) => {
  const url = config.url;
  const id = url?.split('/').pop();
  return [200, { success: true, message: `科室${id}删除成功` }];
});

// 人员管理相关接口
let staffData: Staff[] = [
  {
    id: 1,
    name: '张医生',
    departmentId: 101,
    position: '主任医师',
    role: 'doctor',
  },
  {
    id: 2,
    name: '李护士',
    departmentId: 101,
    position: '护士',
    role: 'nurse',
  },
  {
    id: 3,
    name: '王管理员',
    departmentId: 0,
    position: '系统管理员',
    role: 'admin',
  },
  {
    id: 4,
    name: '刘医生',
    departmentId: 102,
    position: '副主任医师',
    role: 'doctor',
  },
];

mock.onGet('/staff').reply(200, {
  success: true,
  data: staffData,
});

// 创建人员
mock.onPost('/staff').reply((config) => {
  const newStaff: Staff = {
    ...JSON.parse(config.data),
    id: Date.now(), // 简单模拟ID生成
  };
  staffData.push(newStaff);
  return [200, { success: true, data: newStaff }];
});

// 更新人员
mock.onPut(/\/staff\/\d+/).reply((config) => {
  const url = config.url;
  const id = Number(url?.split('/').pop());
  const updatedStaff = JSON.parse(config.data);

  staffData = staffData.map((item) =>
    item.id === id ? { ...item, ...updatedStaff } : item,
  );

  return [200, { success: true, data: updatedStaff }];
});

// 删除人员
mock.onDelete(/\/staff\/\d+/).reply((config) => {
  const url = config.url;
  const id = Number(url?.split('/').pop());
  staffData = staffData.filter((item) => item.id !== id);
  return [200, { success: true, message: `人员${id}删除成功` }];
});

// 患者档案相关接口
mock.onGet('/patients/profile').reply(200, {
  success: true,
  data: {
    id: 1,
    name: '张三',
    gender: '男',
    birthDate: '1990-05-15',
    phone: '13800138000',
    idCard: '110101199003071234',
    isInsurance: true,
  } as PatientProfile,
});

mock.onPut('/patients/profile').reply((config) => {
  const profile = JSON.parse(config.data);
  return [200, { success: true, data: { ...profile, id: 1 } }];
});

// 患者管理相关接口
mock.onGet('/patients').reply(200, {
  success: true,
  data: [
    {
      id: 1,
      name: '张三',
      gender: '男',
      birthDate: '1990-05-15',
      phone: '13800138000',
      idCard: '110101199003071234',
      isInsurance: true,
    },
    {
      id: 2,
      name: '李四',
      gender: '女',
      birthDate: '1985-08-22',
      phone: '13900139000',
      idCard: '220202198508225678',
      isInsurance: false,
    },
    {
      id: 3,
      name: '王五',
      gender: '男',
      birthDate: '1978-12-10',
      phone: '13700137000',
      idCard: '330303197812109012',
      isInsurance: true,
    },
  ] as PatientProfile[],
});

mock.onGet(/\/patients\/\d+/).reply((config) => {
  const url = config.url;
  const id = Number(url?.split('/').pop());
  const patient = {
    id: id,
    name: id === 1 ? '张三' : id === 2 ? '李四' : '王五',
    gender: id === 2 ? '女' : '男',
    birthDate: id === 1 ? '1990-05-15' : id === 2 ? '1985-08-22' : '1978-12-10',
    phone: id === 1 ? '13800138000' : id === 2 ? '13900139000' : '13700137000',
    idCard:
      id === 1
        ? '110101199003071234'
        : id === 2
          ? '220202198508225678'
          : '330303197812109012',
    isInsurance: id === 2 ? false : true,
  };
  return [200, { success: true, data: patient as PatientProfile }];
});

mock.onPost('/patients').reply((config) => {
  const newPatient = JSON.parse(config.data);
  newPatient.id = Date.now(); // 简单模拟ID生成
  return [200, { success: true, data: newPatient }];
});

mock.onPut(/\/patients\/\d+/).reply((config) => {
  const url = config.url;
  const id = Number(url?.split('/').pop());
  const updatedPatient = JSON.parse(config.data);
  updatedPatient.id = Number(id);
  return [200, { success: true, data: updatedPatient }];
});

mock.onDelete(/\/patients\/\d+/).reply((config) => {
  const url = config.url;
  const id = Number(url?.split('/').pop());
  return [200, { success: true, message: `患者${id}删除成功` }];
});

mock.onGet(/\/doctors\/\d+\/schedules/).reply((config) => {
  const url = config.url;
  const doctorId = Number(url?.split('/')[2]); // 提取URL中的医生ID

  // 模拟号源数据
  const mockSchedules = [
    {
      id: 1,
      doctorId: 1,
      date: '2025-05-25',
      available: true,
      maxPatients: 20,
      booked: 5,
      departmentId: 101,
      departmentName: '内科',
      doctorName: '张医生',
      timeSlot: '上午 8:00-12:00',
      status: 1,
      amount: 50, // 挂号费用
    },
    {
      id: 2,
      doctorId: 1,
      date: '2025-05-26',
      available: true,
      maxPatients: 20,
      booked: 12,
      departmentId: 101,
      departmentName: '内科',
      doctorName: '张医生',
      timeSlot: '下午 14:00-18:00',
      status: 1,
      amount: 50, // 挂号费用
    },
    {
      id: 3,
      doctorId: 2,
      date: '2025-05-25',
      available: false,
      maxPatients: 0,
      booked: 0,
      departmentId: 101,
      departmentName: '内科',
      doctorName: '李医生',
      timeSlot: '上午 8:00-12:00',
      status: 1,
      amount: 50, // 挂号费用
    },
    // 为其他医生添加默认数据
    {
      id: 4,
      doctorId: doctorId,
      date: '2025-05-27',
      available: true,
      maxPatients: 15,
      booked: 3,
      departmentId: 102,
      departmentName: '外科',
      doctorName: '刘医生',
      timeSlot: '上午 9:00-12:00',
      status: 1,
      amount: 60, // 挂号费用
    },
    {
      id: 5,
      doctorId: doctorId,
      date: '2025-05-28',
      available: true,
      maxPatients: 10,
      booked: 0,
      departmentId: 104,
      departmentName: '妇科',
      doctorName: '陈医生',
      timeSlot: '上午 9:00-12:00',
      status: 1,
      amount: 45, // 挂号费用
    },
  ];

  // 只返回匹配医生ID的数据
  const doctorSchedules = mockSchedules.filter(
    (sched) => sched.doctorId === doctorId,
  );

  return [
    200,
    {
      success: true,
      data: doctorSchedules,
    },
  ];
});

mock.onPost('/registrations').reply((config) => {
  const regData = JSON.parse(config.data);
  return [
    200,
    {
      success: true,
      data: {
        ...regData,
        id: 'GH' + Date.now(),
        status: 'pending',
        createTime: new Date().toISOString(),
      } as Registration,
    },
  ];
});

// 号源管理相关接口
let schedulingData: Scheduling[] = [
  {
    id: 1,
    departmentId: 101,
    departmentName: '内科',
    doctorId: 1,
    doctorName: '张医生',
    date: '2025-05-25',
    timeSlot: '上午 8:00-12:00',
    maxPatients: 20,
    booked: 5,
    status: 1, // 1: 启用, 0: 停用
    amount: 50, // 挂号费用
  },
  {
    id: 2,
    departmentId: 101,
    departmentName: '内科',
    doctorId: 1,
    doctorName: '张医生',
    date: '2025-05-26',
    timeSlot: '下午 14:00-18:00',
    maxPatients: 15,
    booked: 8,
    status: 1,
    amount: 50, // 挂号费用
  },
  {
    id: 3,
    departmentId: 102,
    departmentName: '外科',
    doctorId: 4,
    doctorName: '刘医生',
    date: '2025-05-25',
    timeSlot: '上午 8:00-12:00',
    maxPatients: 12,
    booked: 12,
    status: 1,
    amount: 60, // 挂号费用
  },
  {
    id: 4,
    departmentId: 104,
    departmentName: '妇科',
    doctorId: 5,
    doctorName: '陈医生',
    date: '2025-05-27',
    timeSlot: '上午 9:00-12:00',
    maxPatients: 10,
    booked: 0,
    status: 0, // 停用
    amount: 45, // 挂号费用
  },
];

mock.onGet('/scheduling').reply(200, {
  success: true,
  data: schedulingData,
});

mock.onPost('/scheduling').reply((config) => {
  const newScheduling: Scheduling = {
    ...JSON.parse(config.data),
    id: Date.now(), // 简单模拟ID生成
    booked: 0, // 新建号源预约数为0
    amount: JSON.parse(config.data).amount || 50, // 默认费用50元，如果未提供则使用默认值
  };

  // 根据departmentId获取科室名称
  const departments: Department[] = [
    { id: 101, name: '内科', status: 1 },
    { id: 102, name: '外科', status: 1 },
    { id: 103, name: '儿科', status: 1 },
    { id: 104, name: '妇科', status: 1 },
    { id: 105, name: '眼科', status: 1 },
  ];
  const dept = departments.find((d) => d.id === newScheduling.departmentId);
  newScheduling.departmentName = dept ? dept.name : '未知科室';

  newScheduling.doctorName = '未知医生';

  schedulingData.push(newScheduling);
  return [200, { success: true, data: newScheduling }];
});

mock.onPut(/\/scheduling\/\d+/).reply((config) => {
  const url = config.url;
  const id = Number(url?.split('/').pop());
  const updatedScheduling: Scheduling = {
    ...JSON.parse(config.data),
    id: id,
  };

  // 根据departmentId获取科室名称
  const departments: Department[] = [
    { id: 101, name: '内科', status: 1 },
    { id: 102, name: '外科', status: 1 },
    { id: 103, name: '儿科', status: 1 },
    { id: 104, name: '妇科', status: 1 },
    { id: 105, name: '眼科', status: 1 },
  ];
  const dept = departments.find((d) => d.id === updatedScheduling.departmentId);
  updatedScheduling.departmentName = dept ? dept.name : '未知科室';

  updatedScheduling.doctorName = '未知医生';

  schedulingData = schedulingData.map((item) =>
    item.id === id ? { ...item, ...updatedScheduling } : item,
  );

  return [200, { success: true, data: updatedScheduling }];
});

mock.onDelete(/\/scheduling\/\d+/).reply((config) => {
  const url = config.url;
  const id = Number(url?.split('/').pop());
  schedulingData = schedulingData.filter((item) => item.id !== id);
  return [200, { success: true, message: `号源${id}删除成功` }];
});

// 根据科室获取医生
mock.onGet(/\/departments\/\d+\/doctors/).reply((config) => {
  const url = config.url;
  const departmentId = Number(url?.split('/')[2]); // 提取URL中的部门ID

  // 模拟医生数据
  const doctors: any[] = [
    { id: 1, name: '张医生', departmentId: 101 },
    { id: 2, name: '李医生', departmentId: 101 },
    { id: 4, name: '刘医生', departmentId: 102 },
    { id: 5, name: '陈医生', departmentId: 104 },
  ];

  const filteredDoctors = doctors.filter(
    (doctor) => doctor.departmentId === departmentId,
  );

  return [200, { success: true, data: filteredDoctors }];
});

// 缴费管理相关接口
const paymentData: Payment[] = [
  {
    id: 'PAY001',
    registrationId: 'GH1700000000000',
    patientName: '张三',
    amount: 50,
    paymentMethod: 'wechat',
    status: 'paid',
    createTime: '2025-05-25T10:30:00Z',
  },
  {
    id: 'PAY002',
    registrationId: 'GH1700000000001',
    patientName: '李四',
    amount: 45,
    paymentMethod: 'card',
    status: 'paid',
    createTime: '2025-05-25T11:15:00Z',
  },
  {
    id: 'PAY003',
    registrationId: 'GH1700000000002',
    patientName: '王五',
    amount: 60,
    paymentMethod: 'cash',
    status: 'refunded',
    createTime: '2025-05-24T09:20:00Z',
    refundTime: '2025-05-24T15:30:00Z',
    refundReason: '医生停诊',
  },
  {
    id: 'PAY004',
    registrationId: 'GH1700000000003',
    patientName: '赵六',
    amount: 55,
    paymentMethod: 'alipay',
    status: 'paid',
    createTime: '2025-05-26T08:45:00Z',
  },
];

mock.onGet('/payments').reply(200, {
  success: true,
  data: paymentData,
});

mock.onGet(/\/payments\/\w+/).reply((config) => {
  const url = config.url;
  const id = url?.split('/').pop();
  const payment = paymentData.find((p) => p.id === id);

  if (payment) {
    return [200, { success: true, data: payment }];
  } else {
    return [404, { success: false, message: '缴费记录不存在' }];
  }
});

mock.onPost('/payments').reply((config) => {
  const newPayment: Payment = {
    ...JSON.parse(config.data),
    id: 'PAY' + Date.now(), // 简单模拟ID生成
    status: 'paid', // 新缴费默认为已支付
    createTime: new Date().toISOString(),
  };

  paymentData.push(newPayment);
  return [200, { success: true, data: newPayment }];
});

mock.onPut(/\/payments\/\w+\/refund/).reply((config) => {
  const url = config.url;
  const id = url?.split('/')[2]; // 提取缴费ID
  const { refundReason } = JSON.parse(config.data);

  const paymentIndex = paymentData.findIndex((p) => p.id === id);

  if (paymentIndex !== -1) {
    paymentData[paymentIndex] = {
      ...paymentData[paymentIndex],
      status: 'refunded',
      refundTime: new Date().toISOString(),
      refundReason: refundReason || '未知原因',
    };

    return [200, { success: true, data: paymentData[paymentIndex] }];
  } else {
    return [404, { success: false, message: '缴费记录不存在' }];
  }
});

mock.onPut(/\/payments\/\w+/).reply((config) => {
  const url = config.url;
  const id = url?.split('/')[2]; // 提取缴费ID
  const updateData = JSON.parse(config.data);

  const paymentIndex = paymentData.findIndex((p) => p.id === id);

  if (paymentIndex !== -1) {
    paymentData[paymentIndex] = {
      ...paymentData[paymentIndex],
      ...updateData,
    };

    return [200, { success: true, data: paymentData[paymentIndex] }];
  } else {
    return [404, { success: false, message: '缴费记录不存在' }];
  }
});

// 处方管理相关接口
let prescriptionData: Prescription[] = [
  {
    prescription_id: 'PRE001',
    reg_id: 'GH1700000000000',
    patient_id: 1,
    staff_id: 1,
    prescription_date: '2025-05-25T10:30:00Z',
    prescription_status: 1, // 有效
    symptoms: '头痛、发热',
    diagnosis: '感冒',
    create_time: '2025-05-25T10:30:00Z',
    update_time: '2025-05-25T10:30:00Z',
    remark: '多喝水，注意休息',
  },
  {
    prescription_id: 'PRE002',
    reg_id: 'GH1700000000001',
    patient_id: 2,
    staff_id: 1,
    prescription_date: '2025-05-25T11:15:00Z',
    prescription_status: 1, // 有效
    symptoms: '腹痛、腹泻',
    diagnosis: '急性肠胃炎',
    create_time: '2025-05-25T11:15:00Z',
    update_time: '2025-05-25T11:15:00Z',
    remark: '清淡饮食，按时服药',
  },
  {
    prescription_id: 'PRE003',
    reg_id: 'GH1700000000002',
    patient_id: 3,
    staff_id: 4,
    prescription_date: '2025-05-24T09:20:00Z',
    prescription_status: 0, // 作废
    symptoms: '胸痛',
    diagnosis: '疑似心绞痛',
    create_time: '2025-05-24T09:20:00Z',
    update_time: '2025-05-24T09:20:00Z',
    remark: '进一步检查后作废',
  },
  {
    prescription_id: 'PRE004',
    reg_id: 'GH1700000000003',
    patient_id: 1,
    staff_id: 4,
    prescription_date: '2025-05-26T08:45:00Z',
    prescription_status: 2, // 已归档
    symptoms: '咳嗽、咳痰',
    diagnosis: '支气管炎',
    create_time: '2025-05-26T08:45:00Z',
    update_time: '2025-05-26T08:45:00Z',
    remark: '按医嘱服药，一周后复诊',
  },
];

mock.onGet('/prescriptions').reply(200, {
  success: true,
  data: prescriptionData,
});

mock.onGet(/\/prescriptions\/\w+/).reply((config) => {
  const url = config.url;
  const id = url?.split('/').pop();
  const prescription = prescriptionData.find((p) => p.prescription_id === id);

  if (prescription) {
    return [200, { success: true, data: prescription }];
  } else {
    return [404, { success: false, message: '处方记录不存在' }];
  }
});

mock.onPost('/prescriptions').reply((config) => {
  const newPrescription: Prescription = {
    ...JSON.parse(config.data),
    prescription_id: 'PRE' + Date.now(), // 简单模拟ID生成
    prescription_status: 1, // 新处方默认为有效
    create_time: new Date().toISOString(),
    update_time: new Date().toISOString(),
  };

  prescriptionData.push(newPrescription);
  return [200, { success: true, data: newPrescription }];
});

mock.onPut(/\/prescriptions\/\w+/).reply((config) => {
  const url = config.url;
  const id = url?.split('/')[2]; // 提取处方ID
  const updateData = JSON.parse(config.data);

  const prescriptionIndex = prescriptionData.findIndex(
    (p) => p.prescription_id === id,
  );

  if (prescriptionIndex !== -1) {
    prescriptionData[prescriptionIndex] = {
      ...prescriptionData[prescriptionIndex],
      ...updateData,
      update_time: new Date().toISOString(),
    };

    return [200, { success: true, data: prescriptionData[prescriptionIndex] }];
  } else {
    return [404, { success: false, message: '处方记录不存在' }];
  }
});

mock.onDelete(/\/prescriptions\/\w+/).reply((config) => {
  const url = config.url;
  const id = url?.split('/')[2]; // 提取处方ID

  const initialLength = prescriptionData.length;
  prescriptionData = prescriptionData.filter((p) => p.prescription_id !== id);

  if (prescriptionData.length < initialLength) {
    return [200, { success: true, message: `处方${id}删除成功` }];
  } else {
    return [404, { success: false, message: '处方记录不存在' }];
  }
});

// 医生今日挂号单API
mock.onGet(/\/doctors\/\d+\/registrations\/today/).reply((config) => {
  const url = config.url;
  const doctorId = Number(url?.split('/')[2]); // 提取URL中的医生ID
  const today = new Date().toISOString().split('T')[0]; // 获取今日日期 YYYY-MM-DD

  // 模拟今日挂号单数据
  const registrationsData: (Registration & {
    patientId: number;
    scheduleDate: string;
  })[] = [
    {
      id: 'GH1700000000001',
      departmentId: 101,
      doctorId: 1,
      scheduleId: 1,
      patientName: '张三',
      patientId: 1,
      status: 'confirmed',
      createTime: `${today}T09:15:00Z`,
      scheduleDate: today,
    },
    {
      id: 'GH1700000000002',
      departmentId: 101,
      doctorId: 1,
      scheduleId: 1,
      patientName: '李四',
      patientId: 2,
      status: 'confirmed',
      createTime: `${today}T10:30:00Z`,
      scheduleDate: today,
    },
    {
      id: 'GH1700000000005',
      departmentId: 101,
      doctorId: 1,
      scheduleId: 2,
      patientName: '赵六',
      patientId: 4,
      status: 'confirmed',
      createTime: `${today}T10:45:00Z`,
      scheduleDate: today,
    },
    {
      id: 'GH1700000000004',
      departmentId: 102,
      doctorId: 4,
      scheduleId: 3,
      patientName: '王五',
      patientId: 3,
      status: 'confirmed',
      createTime: `${today}T11:00:00Z`,
      scheduleDate: today,
    },
  ];

  // 过滤当前医生的今日挂号单
  const doctorRegistrations = registrationsData
    .filter((reg) => reg.doctorId === doctorId && reg.scheduleDate === today)
    .map((reg) => ({
      ...reg,
      hasPrescription: prescriptionData.some((p) => p.reg_id === reg.id),
    }));

  return [
    200,
    {
      success: true,
      data: doctorRegistrations,
    },
  ];
});

// 兜底策略：未匹配的请求通过网络发送
mock.onAny().passThrough();

console.log('Mock Adapter 已启动 🚀');

export default request;
