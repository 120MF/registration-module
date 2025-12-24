import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Space,
  Modal,
  Typography,
  App
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { adminAPI, departmentAPI } from '../../services/api';
import { Scheduling, Department } from '../../types';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const SchedulingPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Scheduling[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Scheduling | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);

  const { message, modal } = App.useApp();

  // 获取号源数据
  const fetchSchedulingData = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getScheduling();
      setData(response || []);
    } catch (error) {
      message.error('获取号源数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取科室列表
  const fetchDepartments = async () => {
    try {
      const response = await adminAPI.getDepartments();
      setDepartments(response || []);
    } catch (error) {
      message.error('获取科室列表失败');
    }
  };

  // 根据科室获取医生
  const fetchDoctors = async (deptId: number) => {
    try {
      const response = await adminAPI.getDoctorsByDepartment(deptId);
      setDoctors(response || []);
    } catch (error) {
      message.error('获取医生列表失败');
    }
  };

  // 当科室选择改变时
  const handleDepartmentChange = (value: number) => {
    setSelectedDepartment(value);
    if (value) {
      fetchDoctors(value);
    } else {
      setDoctors([]);
    }
  };

  // 保存号源信息
  const handleSave = async (values: Omit<Scheduling, 'id' | 'departmentName' | 'doctorName' | 'booked'>) => {
    try {
      if (editingRecord) {
        // 更新现有号源
        await adminAPI.updateScheduling(editingRecord.id, {
          ...values,
          date: dayjs(values.date).format('YYYY-MM-DD'),
          departmentName: departments.find(d => d.id === values.departmentId)?.name || editingRecord.departmentName,
          doctorName: doctors.find(d => d.id === values.doctorId)?.name || editingRecord.doctorName,
        } as Partial<Scheduling>);
        message.success('更新号源成功');
      } else {
        // 创建新号源
        await adminAPI.createScheduling({
          ...values,
          date: dayjs(values.date).format('YYYY-MM-DD'),
          departmentName: departments.find(d => d.id === values.departmentId)?.name || '',
          doctorName: doctors.find(d => d.id === values.doctorId)?.name || '',
          booked: 0
        } as Omit<Scheduling, 'id'>);
        message.success('创建号源成功');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingRecord(null);
      fetchSchedulingData(); // 刷新数据
    } catch (error) {
      message.error(editingRecord ? '更新号源失败' : '创建号源失败');
    }
  };

  // 删除号源
  const handleDelete = async (id: number) => {
    try {
      await adminAPI.deleteScheduling(id);
      message.success('删除号源成功');
      fetchSchedulingData(); // 刷新数据
    } catch (error) {
      message.error('删除号源失败');
    }
  };

  // 编辑号源
  const handleEdit = (record: Scheduling) => {
    setEditingRecord(record);
    form.setFieldsValue({
      ...record,
      date: dayjs(record.date)
    });
    setModalVisible(true);
  };

  // 打开创建号源模态框
  const showCreateModal = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 表格列定义
  const columns = [
    {
      title: '科室',
      dataIndex: 'departmentName',
      key: 'departmentName',
    },
    {
      title: '医生',
      dataIndex: 'doctorName',
      key: 'doctorName',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '时间段',
      dataIndex: 'timeSlot',
      key: 'timeSlot',
    },
    {
      title: '号源总数',
      dataIndex: 'maxPatients',
      key: 'maxPatients',
    },
    {
      title: '已预约数量',
      dataIndex: 'booked',
      key: 'booked',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: number) => {
        const statusMap = {
          1: <span style={{ color: 'green' }}>启用</span>,
          0: <span style={{ color: 'red' }}>停用</span>,
        };
        return statusMap[status as keyof typeof statusMap] || '未知';
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Scheduling) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              modal.confirm({
                title: '确认删除',
                content: `确定要删除 ${record.doctorName} 在 ${dayjs(record.date).format('YYYY-MM-DD')} 的号源吗？`,
                onOk: () => handleDelete(record.id),
              });
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchSchedulingData();
    fetchDepartments();
  }, []);

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4}>号源管理</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showCreateModal}
            >
              添加号源
            </Button>
          </div>
        }
        style={{ marginBottom: '16px' }}
      >
        <Form
          layout="inline"
          style={{ marginBottom: '16px' }}
        >
          <Form.Item label="科室">
            <Select
              placeholder="选择科室"
              style={{ width: 200 }}
              onChange={handleDepartmentChange}
              allowClear
            >
              {departments?.map(dept => (
                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="医生">
            <Select
              placeholder="选择医生"
              style={{ width: 200 }}
              disabled={!selectedDepartment}
              allowClear
            >
              {doctors?.map(doctor => (
                <Option key={doctor.id} value={doctor.id}>{doctor.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="日期范围">
            <RangePicker />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
          </Form.Item>
        </Form>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
        />
      </Card>

      {/* 添加/编辑号源模态框 */}
      <Modal
        title={editingRecord ? '编辑号源' : '添加号源'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setEditingRecord(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            name="departmentId"
            label="科室"
            rules={[{ required: true, message: '请选择科室' }]}
          >
            <Select
              placeholder="选择科室"
              onChange={handleDepartmentChange}
            >
              {departments?.map(dept => (
                <Option key={dept.id} value={dept.id}>{dept.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="doctorId"
            label="医生"
            rules={[{ required: true, message: '请选择医生' }]}
          >
            <Select
              placeholder="选择医生"
              disabled={!selectedDepartment}
            >
              {doctors?.map(doctor => (
                <Option key={doctor.id} value={doctor.id}>{doctor.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="出诊日期"
            rules={[{ required: true, message: '请选择出诊日期' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              disabledDate={(current) => current && current < dayjs().startOf('day')}
            />
          </Form.Item>

          <Form.Item
            name="timeSlot"
            label="时间段"
            rules={[{ required: true, message: '请输入时间段' }]}
          >
            <Input placeholder="例如：上午 8:00-12:00" />
          </Form.Item>

          <Form.Item
            name="maxPatients"
            label="号源总数"
            rules={[
              { required: true, message: '请输入号源总数' },
              { type: 'number', min: 1, message: '号源总数至少为1' }
            ]}
          >
            <Input type="number" placeholder="请输入号源总数" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select placeholder="选择状态">
              <Option value={1}>启用</Option>
              <Option value={0}>停用</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRecord ? '更新' : '创建'}
              </Button>
              <Button onClick={() => {
                setModalVisible(false);
                form.resetFields();
                setEditingRecord(null);
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SchedulingPage;