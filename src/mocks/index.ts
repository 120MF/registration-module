import MockAdapter from 'axios-mock-adapter';
import request from '../services/request';
import { Scheduling, Department, Staff, PatientProfile, Registration } from '../types';

const mock = new MockAdapter(request, { delayResponse: 500 });

// 登录接口
mock.onPost('/login').reply((config) => {
  const { username } = JSON.parse(config.data);

  if (username === 'admin') {
    return [
      200,
      {
        success: true,
        data: {
          token: 'mock-token-admin',
          role: 'admin',
          name: '管理员',
        },
      },
    ];
  } else if (username === 'doctor') {
    return [
      200,
      {
        success: true,
        data: {
          token: 'mock-token-doctor',
          role: 'doctor',
          name: '张医生',
          departmentId: 101,
        },
      },
    ];
  } else if (username === 'patient') {
    return [
      200,
      {
        success: true,
        data: {
          token: 'mock-token-patient',
          role: 'patient',
          name: '患者',
        },
      },
    ];
  } else {
    return [401, { success: false, message: '用户名不存在' }];
  }
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
mock.onGet('/staff').reply(200, {
  success: true,
  data: [
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
  ] as Staff[],
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
    isInsurance: true,
    allergies: '青霉素过敏',
    medicalHistory: '高血压病史',
  } as PatientProfile,
});

mock.onPut('/patients/profile').reply((config) => {
  const profile = JSON.parse(config.data);
  return [200, { success: true, data: { ...profile, id: 1 } }];
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
    },
    {
      id: 2,
      doctorId: 1,
      date: '2025-05-26',
      available: true,
      maxPatients: 20,
      booked: 12,
    },
    {
      id: 3,
      doctorId: 2,
      date: '2025-05-25',
      available: false,
      maxPatients: 0,
      booked: 0,
    },
    // 为其他医生添加默认数据
    {
      id: 4,
      doctorId: doctorId,
      date: '2025-05-27',
      available: true,
      maxPatients: 15,
      booked: 3,
    },
    {
      id: 5,
      doctorId: doctorId,
      date: '2025-05-28',
      available: true,
      maxPatients: 10,
      booked: 0,
    }
  ];

  // 只返回匹配医生ID的数据
  const doctorSchedules = mockSchedules.filter(sched => sched.doctorId === doctorId);

  return [
    200,
    {
      success: true,
      data: doctorSchedules,
    }
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
  };

  // 根据departmentId获取科室名称
  const departments: Department[] = [
    { id: 101, name: '内科', status: 1 },
    { id: 102, name: '外科', status: 1 },
    { id: 103, name: '儿科', status: 1 },
    { id: 104, name: '妇科', status: 1 },
    { id: 105, name: '眼科', status: 1 },
  ];
  const dept = departments.find(d => d.id === newScheduling.departmentId);
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
    id: id
  };

  // 根据departmentId获取科室名称
  const departments: Department[] = [
    { id: 101, name: '内科', status: 1 },
    { id: 102, name: '外科', status: 1 },
    { id: 103, name: '儿科', status: 1 },
    { id: 104, name: '妇科', status: 1 },
    { id: 105, name: '眼科', status: 1 },
  ];
  const dept = departments.find(d => d.id === updatedScheduling.departmentId);
  updatedScheduling.departmentName = dept ? dept.name : '未知科室';

  updatedScheduling.doctorName = '未知医生';

  schedulingData = schedulingData.map(item =>
    item.id === id ? { ...item, ...updatedScheduling } : item
  );

  return [200, { success: true, data: updatedScheduling }];
});

mock.onDelete(/\/scheduling\/\d+/).reply((config) => {
  const url = config.url;
  const id = Number(url?.split('/').pop());
  schedulingData = schedulingData.filter(item => item.id !== id);
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

  const filteredDoctors = doctors.filter(doctor => doctor.departmentId === departmentId);

  return [200, { success: true, data: filteredDoctors }];
});

// 兜底策略：未匹配的请求通过网络发送
mock.onAny().passThrough();

console.log('Mock Adapter 已启动 🚀');

export default request;

