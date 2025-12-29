import { PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, message, Space, Table, Tag } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useDepartmentStore } from '../../stores';
import type { Department } from '../../types';

const { TextArea } = Input;

const DepartmentPage: React.FC = () => {
  const {
    departments,
    loading,
    fetchDepartments,
    addDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartmentStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingDept, setEditingDept] = useState<Department | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchDepartments(true); // 强制刷新，因为这是管理页面
  }, [fetchDepartments]);

  const showModal = (record?: Department) => {
    setEditingDept(record || null);
    form.setFieldsValue({
      name: record?.name || '',
      desc: record?.desc || '',
      status: record?.status === 1,
    });
    setModalVisible(true);
  };

  const handleSubmit = async (values: {
    name: string;
    desc?: string;
    status: boolean;
  }) => {
    try {
      const data = {
        name: values.name,
        desc: values.desc,
        status: values.status ? 1 : 0,
      };

      if (editingDept) {
        await updateDepartment(editingDept.id, data);
        message.success('更新科室成功');
      } else {
        await addDepartment(data);
        message.success('新增科室成功');
      }
      setModalVisible(false);
      form.resetFields();
    } catch {
      message.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDepartment(id);
      message.success('删除科室成功');
    } catch {
      message.error('删除科室失败');
    }
  };

  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (_: unknown, __: Department, index: number) => index + 1,
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
      render: (_: unknown, record: Department) => (
        <Tag color={record.status === 1 ? 'green' : 'red'}>
          {record.status === 1 ? '有效' : '无效'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: Department) => (
        <Space size="middle">
          <Button type="link" onClick={() => showModal(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            删除
          </Button>
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

      <Modal
        title={editingDept ? '编辑科室' : '新增科室'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="name"
            label="科室名称"
            rules={[{ required: true, message: '请输入科室名称' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="desc" label="科室描述">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item name="status" label="是否有效" valuePropName="checked">
            <Input type="checkbox" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartmentPage;
