import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Tag, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { departmentAPI } from '../../services/api';

const { TextArea } = Input;

const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [form] = Form.useForm();

  // 获取科室列表
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await departmentAPI.getDepartments();
      setDepartments(response.data);
    } catch (error) {
      message.error('获取科室列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // 打开新增/编辑弹窗
  const showModal = (record?: any) => {
    setEditingDept(record || null);
    form.setFieldsValue({
      name: record?.name || '',
      desc: record?.desc || '',
      status: record?.status || 1,
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      if (editingDept) {
        // 编辑
        await departmentAPI.updateDepartment(editingDept.id, {
          ...values,
          status: values.status ? 1 : 0
        });
        message.success('更新科室成功');
      } else {
        // 新增
        await departmentAPI.createDepartment({
          ...values,
          status: values.status ? 1 : 0
        });
        message.success('新增科室成功');
      }
      setModalVisible(false);
      form.resetFields();
      fetchDepartments(); // 重新获取列表
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 删除科室
  const handleDelete = async (id: number) => {
    try {
      await departmentAPI.deleteDepartment(id);
      message.success('删除科室成功');
      fetchDepartments(); // 重新获取列表
    } catch (error) {
      message.error('删除科室失败');
    }
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: '科室名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '科室描述',
      dataIndex: 'desc',
      key: 'desc',
    },
    {
      title: '是否有效',
      key: 'status',
      render: (text: any, record: any) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>
          {record.status === 1 ? '有效' : '无效'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>编辑</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>删除</Button>
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
          新增科室
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={departments} 
        rowKey="id"
        loading={loading}
      />
      
      {/* 新增/编辑弹窗 */}
      <Modal
        title={editingDept ? '编辑科室' : '新增科室'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="科室名称"
            rules={[{ required: true, message: '请输入科室名称' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            name="desc"
            label="科室描述"
          >
            <TextArea rows={4} />
          </Form.Item>
          
          <Form.Item
            name="status"
            label="是否有效"
            valuePropName="checked"
          >
            <Input type="checkbox" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentPage;