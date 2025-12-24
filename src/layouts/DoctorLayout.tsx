import React from 'react';
import { Layout, Menu, Typography, List, Card, Tag } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Outlet } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const DoctorLayout: React.FC = () => {
  const menuItems: MenuProps['items'] = [
    {
      key: 'workbench',
      label: '问诊工作台',
    },
    {
      key: 'history',
      label: '历史记录',
    },
    {
      key: 'settings',
      label: '个人设置',
    },
  ];

  // Mock patient data for the left panel
  const patients = [
    { id: 'GH20250520001', name: '李四', age: 28, status: 'waiting', time: '09:00' },
    { id: 'GH20250520002', name: '王五', age: 45, status: 'in-progress', time: '09:15' },
    { id: 'GH20250520003', name: '赵六', age: 32, status: 'completed', time: '08:45' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1890ff' }}>
        <div style={{ marginRight: '24px' }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>医生工作站</Title>
        </div>
      </Header>
      <Layout>
        <Sider width={300} style={{ background: '#fff', borderRight: '1px solid #e8e8e8' }}>
          <div style={{ padding: '20px 16px' }}>
            <Title level={5}>待诊患者列表</Title>
            <List
              dataSource={patients}
              renderItem={(patient) => (
                <List.Item 
                  style={{ 
                    padding: '12px 0', 
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer'
                  }}
                >
                  <List.Item.Meta
                    avatar={<UserOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                    title={
                      <div>
                        {patient.name} <Tag color={patient.status === 'waiting' ? 'orange' : patient.status === 'in-progress' ? 'blue' : 'green'}>
                          {patient.status === 'waiting' ? '待接诊' : patient.status === 'in-progress' ? '问诊中' : '已完成'}
                        </Tag>
                      </div>
                    }
                    description={`挂号时间: ${patient.time}`}
                  />
                </List.Item>
              )}
            />
          </div>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 0,
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default DoctorLayout;