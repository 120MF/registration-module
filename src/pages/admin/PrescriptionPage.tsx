import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Tag, Space, message, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { prescriptionAPI } from '../../services/api';
import { Prescription } from '../../types';

const { TextArea } = Input;

const PrescriptionPage: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState<Prescription | null>(null);
  const [form] = Form.useForm();

  // 获取处方列表
  const fetchPrescriptions = async () => {
    setLoading(true);
    try {
      const response = await prescriptionAPI.getPrescriptions();
      setPrescriptions(response || []);
    } catch (error) {
      message.error('获取处方列表失败');
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  // 打开新增/编辑弹窗
  const showModal = (record?: Prescription) => {
    setEditingPrescription(record || null);
    form.setFieldsValue({
      reg_id: record?.reg_id || '',
      patient_id: record?.patient_id || undefined,
      staff_id: record?.staff_id || undefined,
      prescription_status: record?.prescription_status || 1,
      symptoms: record?.symptoms || '',
      diagnosis: record?.diagnosis || '',
      remark: record?.remark || '',
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async (values: Omit<Prescription, 'prescription_id'>) => {
    try {
      if (editingPrescription) {
        // 编辑
        await prescriptionAPI.updatePrescription(editingPrescription.prescription_id, {
          ...values,
          prescription_status: values.prescription_status
        } as Partial<Prescription>);
        message.success('更新处方成功');
      } else {
        // 新增
        await prescriptionAPI.createPrescription({
          ...values,
          prescription_status: values.prescription_status,
          prescription_date: new Date().toISOString()
        } as Omit<Prescription, 'prescription_id'>);
        message.success('新增处方成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchPrescriptions(); // 重新获取列表
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 删除处方
  const handleDelete = async (id: string) => {
    try {
      await prescriptionAPI.deletePrescription(id);
      message.success('删除处方成功');
      fetchPrescriptions(); // 重新获取列表
    } catch (error) {
      message.error('删除处方失败');
    }
  };

  const columns = [
    {
      title: '处方ID',
      dataIndex: 'prescription_id',
      key: 'prescription_id',
      width: 150,
    },
    {
      title: '挂号ID',
      dataIndex: 'reg_id',
      key: 'reg_id',
      width: 150,
    },
    {
      title: '患者ID',
      dataIndex: 'patient_id',
      key: 'patient_id',
    },
    {
      title: '医生ID',
      dataIndex: 'staff_id',
      key: 'staff_id',
    },
    {
      title: '开具时间',
      dataIndex: 'prescription_date',
      key: 'prescription_date',
      render: (text: string) => new Date(text).toLocaleString(),
      width: 180,
    },
    {
      title: '处方状态',
      key: 'prescription_status',
      render: (text: any, record: Prescription) => {
        const statusMap = {
          0: { text: '作废', color: 'red' },
          1: { text: '有效', color: 'green' },
          2: { text: '已归档', color: 'blue' },
        };
        const status = statusMap[record.prescription_status as keyof typeof statusMap];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: '症状',
      dataIndex: 'symptoms',
      key: 'symptoms',
    },
    {
      title: '诊断',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: Prescription) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.prescription_id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          新增处方
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={prescriptions}
        rowKey="prescription_id"
        loading={loading}
        scroll={{ x: 1200 }}
      />

      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingPrescription ? '编辑处方' : '新增处方'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="reg_id"
            label="挂号ID"
            rules={[{ required: true, message: '请输入挂号ID' }]}
          >
            <Input placeholder="请输入挂号ID" />
          </Form.Item>

          <Form.Item
            name="patient_id"
            label="患者ID"
            rules={[{ required: true, message: '请输入患者ID' }]}
          >
            <Input type="number" placeholder="请输入患者ID" />
          </Form.Item>

          <Form.Item
            name="staff_id"
            label="医生ID"
            rules={[{ required: true, message: '请输入医生ID' }]}
          >
            <Input type="number" placeholder="请输入医生ID" />
          </Form.Item>

          <Form.Item
            name="prescription_status"
            label="处方状态"
            rules={[{ required: true, message: '请选择处方状态' }]}
          >
            <Select placeholder="请选择处方状态">
              <Select.Option value={1}>有效</Select.Option>
              <Select.Option value={0}>作废</Select.Option>
              <Select.Option value={2}>已归档</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="symptoms"
            label="症状"
            rules={[{ required: true, message: '请输入症状' }]}
          >
            <TextArea rows={3} placeholder="请输入症状" />
          </Form.Item>

          <Form.Item
            name="diagnosis"
            label="诊断"
            rules={[{ required: true, message: '请输入诊断' }]}
          >
            <TextArea rows={3} placeholder="请输入诊断" />
          </Form.Item>

          <Form.Item
            name="remark"
            label="备注"
          >
            <TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PrescriptionPage;