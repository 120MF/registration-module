import { AppstoreOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Form,
  message,
  Select,
  Space,
  Table,
  Typography,
} from 'antd';
import dayjs from 'dayjs';
import type React from 'react';
import { useEffect, useState } from 'react';
import { patientAPI, paymentAPI } from '../../services/api';
import {
  useDepartmentStore,
  useDoctorStore,
  usePatientStore,
} from '../../stores';
import type { Scheduling } from '../../types';

const { Text } = Typography;

const RegistrationPage: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [schedules, setSchedules] = useState<Scheduling[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(
    null,
  );
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [selectedScheduleAmount, setSelectedScheduleAmount] =
    useState<number>(0);

  // 使用全局状态
  const {
    departments,
    loading: deptLoading,
    fetchDepartments,
  } = useDepartmentStore();
  const { doctorsByDepartment, fetchDoctorsByDepartment } = useDoctorStore();
  const { profile, fetchProfile } = usePatientStore();

  const doctors = selectedDepartment
    ? doctorsByDepartment[selectedDepartment] || []
    : [];
  const validDepartments = departments.filter((dept) => dept.status === 1);

  // 根据医生获取号源
  const fetchSchedules = async (doctorId: number) => {
    try {
      const response = await patientAPI.getDoctorSchedules(doctorId);
      const availableSchedules = (response || []).filter(
        (sched: Scheduling) => sched.booked < sched.maxPatients,
      );
      setSchedules(availableSchedules);
    } catch {
      message.error('获取号源信息失败');
    }
  };

  // 提交挂号和缴费
  const handleSubmit = async (values: {
    doctorId: number;
    scheduleId: number;
    paymentMethod: string;
  }) => {
    setSubmitting(true);
    try {
      const patientName = profile?.name || '未知患者';

      const registration = await patientAPI.createRegistration({
        departmentId: selectedDepartment!,
        doctorId: values.doctorId,
        scheduleId: values.scheduleId,
        patientName,
        status: 'pending',
      });

      const selectedSchedule = schedules.find(
        (s) => s.id === values.scheduleId,
      );
      const amount = selectedSchedule?.amount || 0;

      await paymentAPI.createPayment({
        registrationId: registration.data.id,
        patientName,
        amount,
        paymentMethod: values.paymentMethod,
        status: 'paid',
        createTime: new Date().toISOString(),
      });

      message.success('挂号及缴费成功');
      form.resetFields();
      setSchedules([]);
      setSelectedDoctor(null);
      setSelectedScheduleAmount(0);
    } catch {
      message.error('挂号或缴费失败');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchProfile();
  }, [fetchDepartments, fetchProfile]);

  const handleDepartmentChange = async (value: number) => {
    setSelectedDepartment(value);
    setSelectedDoctor(null);
    setSchedules([]);
    form.setFieldsValue({ doctorId: undefined, scheduleId: undefined });

    if (value) {
      await fetchDoctorsByDepartment(value);
    }
  };

  const handleDoctorChange = (value: number) => {
    setSelectedDoctor(value);
    form.setFieldsValue({ scheduleId: undefined });
    setSelectedScheduleAmount(0);

    if (value) {
      fetchSchedules(value);
    } else {
      setSchedules([]);
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
      render: (_: unknown, record: Scheduling) =>
        record.maxPatients - record.booked,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Scheduling) => (
        <Button
          type="link"
          disabled={record.booked >= record.maxPatients}
          onClick={() => {
            form.setFieldsValue({ scheduleId: record.id });
            setSelectedScheduleAmount(record.amount);
            message.success(
              `已选择 ${dayjs(record.date).format('YYYY-MM-DD')} 的号源`,
            );
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
            <AppstoreOutlined
              style={{ marginRight: '8px', color: '#52c41a' }}
            />
            <span>挂号办理</span>
          </div>
        }
        style={{ marginBottom: '16px' }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="departmentId"
            label="选择科室"
            rules={[{ required: true, message: '请选择科室' }]}
          >
            <Select
              placeholder="请选择科室"
              onChange={handleDepartmentChange}
              loading={deptLoading}
            >
              {validDepartments.map((dept) => (
                <Select.Option key={dept.id} value={dept.id}>
                  {dept.name}
                </Select.Option>
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
            >
              {doctors.map((doctor) => (
                <Select.Option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </Select.Option>
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
              onChange={(value) => {
                const selectedSchedule = schedules.find((s) => s.id === value);
                if (selectedSchedule) {
                  setSelectedScheduleAmount(selectedSchedule.amount);
                }
              }}
            >
              {schedules.map((schedule) => (
                <Select.Option
                  key={schedule.id}
                  value={schedule.id}
                  disabled={schedule.booked >= schedule.maxPatients}
                >
                  {dayjs(schedule.date).format('YYYY-MM-DD')}
                  (剩余{schedule.maxPatients - schedule.booked}个号源)
                  {schedule.amount && ` - ¥${schedule.amount.toFixed(2)}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          {selectedScheduleAmount > 0 && (
            <Card size="small" style={{ marginBottom: '16px' }}>
              <Text strong>挂号费用: ¥{selectedScheduleAmount.toFixed(2)}</Text>
            </Card>
          )}

          <Form.Item
            name="paymentMethod"
            label="选择缴费方式"
            rules={[{ required: true, message: '请选择缴费方式' }]}
          >
            <Select
              placeholder="请选择缴费方式"
              disabled={!form.getFieldValue('scheduleId')}
            >
              <Select.Option value="cash">现金</Select.Option>
              <Select.Option value="card">银行卡</Select.Option>
              <Select.Option value="wechat">微信支付</Select.Option>
              <Select.Option value="alipay">支付宝</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={
                  !form.getFieldValue('scheduleId') ||
                  !form.getFieldValue('paymentMethod')
                }
              >
                确认挂号并缴费
              </Button>
              <Button
                onClick={() => {
                  form.resetFields();
                  setSelectedScheduleAmount(0);
                }}
              >
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {schedules.length > 0 && (
          <Card title="号源详情" size="small" style={{ marginTop: '16px' }}>
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
