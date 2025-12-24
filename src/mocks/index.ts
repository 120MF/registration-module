import MockAdapter from 'axios-mock-adapter';
import request from '../services/request';

// 开发环境下启用mock
const isMockEnabled = process.env.NODE_ENV !== 'production';

if (isMockEnabled) {
  const mock = new MockAdapter(request, { delayResponse: 500 });

  // 登录接口
  mock.onPost('/login').reply((config) => {
    const { username } = JSON.parse(config.data);
    
    if (username === 'admin') {
      return [200, { 
        success: true, 
        data: { 
          token: 'mock-token-admin', 
          role: 'admin', 
          name: '管理员' 
        } 
      }];
    } else if (username === 'doctor') {
      return [200, { 
        success: true, 
        data: { 
          token: 'mock-token-doctor', 
          role: 'doctor', 
          name: '张医生',
          departmentId: 101
        } 
      }];
    } else if (username === 'patient') {
      return [200, { 
        success: true, 
        data: { 
          token: 'mock-token-patient', 
          role: 'patient', 
          name: '患者'
        } 
      }];
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
    ]
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
      { id: 1, name: '张医生', departmentId: 101, position: '主任医师', role: 'doctor' },
      { id: 2, name: '李护士', departmentId: 101, position: '护士', role: 'nurse' },
      { id: 3, name: '王管理员', departmentId: 0, position: '系统管理员', role: 'admin' },
      { id: 4, name: '刘医生', departmentId: 102, position: '副主任医师', role: 'doctor' },
    ]
  });

  // 设备管理相关接口
  mock.onGet('/devices').reply(200, {
    success: true,
    data: [
      { id: 1, name: '心电图机', departmentId: 101, purchaseDate: '2023-01-15', status: '正常' },
      { id: 2, name: 'B超仪', departmentId: 102, purchaseDate: '2023-03-20', status: '维修中' },
      { id: 3, name: 'X光机', departmentId: 104, purchaseDate: '2022-11-10', status: '正常' },
    ]
  });

  // 药品字典相关接口
  mock.onGet('/drugs').reply(200, {
    success: true,
    data: [
      { id: 1, name: '阿莫西林', price: 12.5, unit: '盒', stock: 50, status: 1 },
      { id: 2, name: '布洛芬', price: 8.3, unit: '盒', stock: 100, status: 1 },
      { id: 3, name: '头孢克肟', price: 25.0, unit: '盒', stock: 30, status: 0 },
    ]
  });

  // 检查项目相关接口
  mock.onGet('/examinations').reply(200, {
    success: true,
    data: [
      { id: 1, name: '胸部CT', price: 360, type: 'exam', status: 1 },
      { id: 2, name: '心电图', price: 25, type: 'exam', status: 1 },
      { id: 3, name: 'B超', price: 120, type: 'exam', status: 1 },
    ]
  });

  // 检验项目相关接口
  mock.onGet('/tests').reply(200, {
    success: true,
    data: [
      { id: 1, name: '血常规', price: 30, type: 'test', status: 1 },
      { id: 2, name: '尿常规', price: 25, type: 'test', status: 1 },
      { id: 3, name: '肝功能', price: 80, type: 'test', status: 1 },
    ]
  });

  // 患者列表（医生端）
  mock.onGet('/patients/queue').reply(200, {
    success: true,
    data: [
      { id: 'GH20250520001', patientName: '李四', age: 28, status: 'waiting', time: '2025-05-20 09:00' },
      { id: 'GH20250520002', patientName: '王五', age: 45, status: 'in-progress', time: '2025-05-20 09:15' },
      { id: 'GH20250520003', patientName: '赵六', age: 32, status: 'completed', time: '2025-05-20 08:45' },
    ]
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
      medicalHistory: '高血压病史'
    }
  });

  mock.onPut('/patients/profile').reply((config) => {
    const profile = JSON.parse(config.data);
    return [200, { success: true, data: { ...profile, id: 1 } }];
  });

  // 挂号相关接口
  mock.onGet('/departments/doctors').reply(200, {
    success: true,
    data: [
      { id: 1, name: '张医生', departmentId: 101 },
      { id: 2, name: '刘医生', departmentId: 101 },
    ]
  });

  mock.onGet('/doctors/schedules').reply(200, {
    success: true,
    data: [
      { id: 1, doctorId: 1, date: '2025-05-25', available: true, maxPatients: 20, booked: 5 },
      { id: 2, doctorId: 1, date: '2025-05-26', available: true, maxPatients: 20, booked: 12 },
      { id: 3, doctorId: 2, date: '2025-05-25', available: false, maxPatients: 0, booked: 0 },
    ]
  });

  mock.onPost('/registrations').reply((config) => {
    const regData = JSON.parse(config.data);
    return [200, { 
      success: true, 
      data: { 
        ...regData, 
        id: 'GH' + Date.now(),
        status: 'pending',
        createTime: new Date().toISOString()
      } 
    }];
  });

  // 就诊记录相关接口
  mock.onGet('/patients/history').reply(200, {
    success: true,
    data: [
      { 
        id: 1, 
        date: '2025-05-20', 
        doctor: '张医生', 
        department: '内科', 
        diagnosis: '感冒',
        prescriptions: [
          { name: '感冒灵', quantity: 2, dosage: '每日三次，每次1片' }
        ]
      },
      { 
        id: 2, 
        date: '2025-04-15', 
        doctor: '李医生', 
        department: '外科', 
        diagnosis: '皮肤过敏',
        prescriptions: [
          { name: '氯雷他定', quantity: 1, dosage: '每日一次，每次1片' }
        ]
      },
    ]
  });

  // 兜底策略：未匹配的请求通过网络发送
  mock.onAny().passThrough();
  
  console.log('Mock Adapter 已启动 🚀');
}

export default request;