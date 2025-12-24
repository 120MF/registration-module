import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Switch, message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { dictAPI } from '../../services/api';

const { Search } = Input;

const DrugDictPage: React.FC = () => {
  const [drugs, setDrugs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // 获取药品列表
  const fetchDrugs = async () => {
    setLoading(true);
    try {
      const response = await dictAPI.getDrugs();
      setDrugs(response.data);
    } catch (error) {
      message.error('获取药品列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrugs();
  }, []);

  // 过滤数据
  const filteredDrugs = drugs.filter(drug => 
    drug.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: '药品名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`,
    },
    {
      title: '单位',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
    },
    {
      title: '是否启用',
      key: 'status',
      render: (text: any, record: any) => (
        <Switch 
          checked={record.status === 1} 
          disabled
        />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
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
        <Search
          placeholder="搜索药品名称"
          allowClear
          onSearch={setSearchText}
          style={{ width: 300 }}
          suffix={<SearchOutlined />}
        />
        <Button type="primary" icon={<PlusOutlined />}>
          新增药品
        </Button>
      </div>
      
      <Table 
        columns={columns} 
        dataSource={filteredDrugs} 
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default DrugDictPage;