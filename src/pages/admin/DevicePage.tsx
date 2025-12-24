import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, DatePicker, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { deviceAPI } from '../../services/api';
import { Device } from '../../types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const DevicePage: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取设备列表
  const fetchDevices = async () => {
    setLoading(true);
    try {
      const response = await deviceAPI.getDevices();
      setDevices(response || []);
    } catch (error) {
      message.error('获取设备列表失败');
      setDevices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (text: any, record: Device, index: number) => index + 1,
    },
    {
      title: '设备名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '所属科室',
      key: 'departmentId',
      render: (text: any, record: Device) => {
        const deptMap: Record<number, string> = {
          101: '内科',
          102: '外科',
          103: '儿科',
          104: '妇科',
          105: '眼科'
        };
        return deptMap[record.departmentId] || '未知科室';
      }
    },
    {
      title: '采购日期',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '状态',
      key: 'status',
      render: (text: any, record: Device) => (
        <Tag color={record.status === '正常' ? 'green' : 'red'}>
          {record.status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: Device) => (
        <Space size="middle">
          <Button type="link">编辑</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <RangePicker placeholder={['采购开始日期', '采购结束日期']} />
        </Space>
        <Button type="primary" icon={<PlusOutlined />}>
          新增设备
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={devices} 
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default DevicePage;