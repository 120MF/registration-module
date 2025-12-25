import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  message, 
  Space,
  Popconfirm
} from 'antd';
import { patientManagementAPI } from '../../services/api';
import type { PatientProfile } from '../../types';
import dayjs from 'dayjs';

const { Option } = Select;

const PatientManagementPage: React.FC = () => {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [editingPatient, setEditingPatient] = useState<PatientProfile | null>(null);
  const [form] = Form.useForm();

  // 获取患者列表
  const fetchPatients = async () => {
    try {
      setLoading(true);
      const data = await patientManagementAPI.getPatients();
      setPatients(data);
    } catch (error) {
      console.error('获取患者列表失败:', error);
      message.error('获取患者列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  // 打开新增患者对话框
  const showAddModal = () => {
    setEditingPatient(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑患者对话框
  const showEditModal = (patient: PatientProfile) => {
    setEditingPatient(patient);
    form.setFieldsValue({
      ...patient,
      birthDate: patient.birthDate ? dayjs(patient.birthDate) : null,
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      if (editingPatient) {
        // 编辑患者
        await patientManagementAPI.updatePatient(editingPatient.id, values);
        message.success('患者信息更新成功');
      } else {
        // 新增患者
        await patientManagementAPI.createPatient(values);
        message.success('患者创建成功');
      }
      
      setModalVisible(false);
      form.resetFields();
      fetchPatients(); // 刷新列表
    } catch (error) {
      console.error('保存患者信息失败:', error);
      message.error('保存患者信息失败');
    }
  };

  // 删除患者
  const handleDelete = async (id: number) => {
    try {
      await patientManagementAPI.deletePatient(id);
      message.success('患者删除成功');
      fetchPatients(); // 刷新列表
    } catch (error) {
      console.error('删除患者失败:', error);
      message.error('删除患者失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      key: 'gender',
      width: 80,
      render: (gender: string) => (gender === '男' ? '男' : gender === '女' ? '女' : gender),
    },
    {
      title: '出生日期',
      dataIndex: 'birthDate',
      key: 'birthDate',
      width: 120,
      render: (birthDate: string) => birthDate || '-',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '身份证号',
      dataIndex: 'idCard',
      key: 'idCard',
      width: 200,
      render: (idCard: string) => idCard || '-',
    },
    {
      title: '医保状态',
      dataIndex: 'isInsurance',
      key: 'isInsurance',
      width: 100,
      render: (isInsurance: boolean) => (isInsurance ? '是' : '否'),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (_, record: PatientProfile) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => showEditModal(record)}
            style={{ padding: 0 }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除此患者?"
            onConfirm={() => handleDelete(record.id)}
            okText="是"
            cancelText="否"
          >
            <Button type="link" danger style={{ padding: 0 }}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>患者管理</h2>
        <Button type="primary" onClick={showAddModal}>
          新增患者
        </Button>
      </div>

      <Table 
        dataSource={patients} 
        columns={columns} 
        rowKey="id" 
        loading={loading}
        pagination={{
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
      />

      {/* 新增/编辑患者对话框 */}
      <Modal
        title={editingPatient ? '编辑患者' : '新增患者'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入患者姓名' }]}
          >
            <Input placeholder="请输入患者姓名" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择患者性别' }]}
          >
            <Select placeholder="请选择患者性别">
              <Option value="男">男</Option>
              <Option value="女">女</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="birthDate"
            label="出生日期"
            rules={[{ required: true, message: '请选择出生日期' }]}
          >
            <DatePicker 
              placeholder="请选择出生日期" 
              format="YYYY-MM-DD"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="手机号"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="idCard"
            label="身份证号"
            rules={[
              { required: true, message: '请输入身份证号' },
              { 
                pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, 
                message: '请输入正确的身份证号' 
              },
            ]}
          >
            <Input placeholder="请输入身份证号" />
          </Form.Item>

          <Form.Item
            name="isInsurance"
            label="医保状态"
            valuePropName="checked"
          >
            <Select placeholder="请选择医保状态">
              <Option value={true}>是</Option>
              <Option value={false}>否</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PatientManagementPage;