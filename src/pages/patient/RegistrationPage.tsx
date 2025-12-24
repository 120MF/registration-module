import React, { useState, useEffect } from 'react';
import { Form, Select, DatePicker, Button, Table, message, Card, Space } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { patientAPI } from '../../services/api';

const { Option } = Select;
const { RangePicker } = DatePicker;

const RegistrationPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);

  // 获取科室列表
  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      const data = await response.json();
      // 从mock数据中筛选出有效的科室
      const validDepts = data.data.filter((dept: any) => dept.status === 1);
      setDepartments(validDepts);
    } catch (error) {
      message.error('获取科室列表失败');
    }
  };

  // 根据科室获取医生
  const fetchDoctors = async (deptId: number) => {
    try {
      const response = await patientAPI.getDoctorsByDepartment(deptId);
      setDoctors(response.data);
      // 重置医生和号源选择
      setSelectedDoctor(null);
      setSchedules([]);
      form.setFieldsValue({ doctorId: undefined, scheduleId: undefined });
    } catch (error) {
      message.error('获取医生列表失败');
    }
  };

  // 根据医生获取号源
  const fetchSchedules = async (doctorId: number) => {
    try {
      const response = await patientAPI.getDoctorSchedules(doctorId);
      // 过滤出可用的号源
      const availableSchedules = response.data.filter((sched: any) => sched.available && sched.booked < sched.maxPatients);
      setSchedules(availableSchedules);
    } catch (error) {
      message.error('获取号源信息失败');
    }
  };

  // 提交挂号
  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      await patientAPI.createRegistration({
        departmentId: selectedDepartment,
        doctorId: values.doctorId,
        scheduleId: values.scheduleId,
        patientName: '张三', // 从用户档案获取
        status: 'pending'
      });
      message.success('挂号成功');
      form.resetFields();
      setSchedules([]);
      setSelectedDoctor(null);
    } catch (error) {
      message.error('挂号失败');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 当科室选择改变时
  const handleDepartmentChange = (value: number) => {
    setSelectedDepartment(value);
    if (value) {
      fetchDoctors(value);
    } else {
      setDoctors([]);
      setSchedules([]);
      setSelectedDoctor(null);
      form.setFieldsValue({ doctorId: undefined, scheduleId: undefined });
    }
  };

  // 当医生选择改变时
  const handleDoctorChange = (value: number) => {
    setSelectedDoctor(value);
    if (value) {
      fetchSchedules(value);
    } else {
      setSchedules([]);
      form.setFieldsValue({ scheduleId: undefined });
    }
  };

  const scheduleColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '可预约数量',
      dataIndex: 'maxPatients',
      key: 'maxPatients',
    },
    {
      title: '已预约数量',
      dataIndex: 'booked',
      key: 'booked',
    },
    {
      title: '剩余号源',
      key: 'remaining',
      render: (text: any, record: any) => record.maxPatients - record.booked,
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Button 
          type="link" 
          disabled={record.booked >= record.maxPatients}
          onClick={() => {
            form.setFieldsValue({ scheduleId: record.id });
            message.success(`已选择 ${dayjs(record.date).format('YYYY-MM-DD')} 的号源`);
          }}
        >
          {record.booked >= record.maxPatients ? '已约满' : '选择'}
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <AppstoreOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
            <span>挂号办理</span>
          </div>
        }
        style={{ marginBottom: '16px' }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="departmentId"
            label="选择科室"
            rules={[{ required: true, message: '请选择科室' }]}
          >
            <Select 
              placeholder="请选择科室" 
              onChange={handleDepartmentChange}
              loading={loading}
            >
              {departments.map(dept => (
                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="doctorId"
            label="选择医生"
            rules={[{ required: true, message: '请选择医生' }]}
          >
            <Select 
              placeholder="请选择医生" 
              onChange={handleDoctorChange}
              disabled={!selectedDepartment}
              loading={loading}
            >
              {doctors.map(doctor => (
                <Option key={doctor.id} value={doctor.id}>{doctor.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="scheduleId"
            label="选择号源"
            rules={[{ required: true, message: '请选择号源' }]}
          >
            <Select 
              placeholder="请选择号源日期" 
              disabled={!selectedDoctor}
            >
              {schedules.map(schedule => (
                <Option 
                  key={schedule.id} 
                  value={schedule.id}
                  disabled={schedule.booked >= schedule.maxPatients}
                >
                  {dayjs(schedule.date).format('YYYY-MM-DD')} 
                  (剩余{schedule.maxPatients - schedule.booked}个号源)
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={submitting}
                disabled={!form.getFieldValue('scheduleId')}
              >
                确认挂号
              </Button>
              <Button onClick={() => form.resetFields()}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {schedules.length > 0 && (
          <Card 
            title="号源详情" 
            size="small"
            style={{ marginTop: '16px' }}
          >
            <Table 
              columns={scheduleColumns} 
              dataSource={schedules} 
              rowKey="id"
              pagination={false}
            />
          </Card>
        )}
      </Card>
    </div>
  );
};

export default RegistrationPage;