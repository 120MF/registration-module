import { Button, Card, Form, Input, Modal, Space, Tag, message } from 'antd';
import type React from 'react';
import { useEffect } from 'react';
import { prescriptionAPI } from '../services/api';
import type { DoctorRegistration, Prescription } from '../types';

const { TextArea } = Input;

interface PrescriptionModalProps {
  visible: boolean;
  registration: DoctorRegistration;
  doctorId: number;
  onCancel: () => void;
  onSubmit: () => void;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({
  visible,
  registration,
  doctorId,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  // 重置表单
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async (values: {
    symptoms: string;
    diagnosis: string;
    remark?: string;
  }) => {
    try {
      const prescriptionData: Omit<Prescription, 'prescription_id'> = {
        reg_id: registration.id, // 自动填充挂号ID
        patient_id: registration.patientId, // 自动填充患者ID
        staff_id: doctorId, // 自动填充医生ID
        prescription_date: new Date().toISOString(),
        prescription_status: 1, // 有效
        symptoms: values.symptoms,
        diagnosis: values.diagnosis,
        remark: values.remark || '',
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString(),
      };

      await prescriptionAPI.createPrescription(prescriptionData);
      message.success('处方开具成功');
      onSubmit(); // 调用回调刷新列表
    } catch (error) {
      console.error('开处方失败:', error);
      message.error('开处方失败，请稍后重试');
    }
  };

  return (
    <Modal
      title="开具处方"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Card size="small" title="挂号信息" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div><strong>挂号ID：</strong>{registration.id}</div>
          <div><strong>患者姓名：</strong>{registration.patientName}</div>
          <div><strong>挂号时间：</strong>{new Date(registration.createTime!).toLocaleString('zh-CN')}</div>
          <div><strong>状态：</strong>
            <Tag color={registration.status === 'confirmed' ? 'green' : 'orange'}>
              {registration.status === 'confirmed' ? '已确认' : '待确认'}
            </Tag>
          </div>
        </Space>
      </Card>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ symptoms: '', diagnosis: '', remark: '' }}
      >
        <Form.Item
          label="症状"
          name="symptoms"
          rules={[{ required: true, message: '请输入患者症状' }]}
        >
          <TextArea rows={4} placeholder="请输入患者的症状描述" />
        </Form.Item>

        <Form.Item
          label="诊断"
          name="diagnosis"
          rules={[{ required: true, message: '请输入诊断结果' }]}
        >
          <TextArea rows={4} placeholder="请输入诊断结果" />
        </Form.Item>

        <Form.Item
          label="备注"
          name="remark"
        >
          <TextArea rows={3} placeholder="请输入处方备注（可选）" />
        </Form.Item>

        <Form.Item style={{ textAlign: 'right', marginTop: 24 }}>
          <Space>
            <Button onClick={onCancel}>取消</Button>
            <Button type="primary" htmlType="submit">提交处方</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PrescriptionModal;