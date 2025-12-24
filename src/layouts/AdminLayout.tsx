import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout: React.FC = () => {
  const location = useLocation();
  
  const menuItems: MenuProps['items'] = [
    {
      key: '/admin/departments',
      label: <Link to="/admin/departments">科室管理</Link>,
    },
    {
      key: '/admin/staff',
      label: <Link to="/admin/staff">人员管理</Link>,
    },
    {
      key: '/admin/scheduling',
      label: <Link to="/admin/scheduling">号源管理</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#1890ff' }}>
        <div style={{ marginRight: '24px' }}>
          <Title level={3} style={{ color: 'white', margin: 0 }}>医院管理系统</Title>
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
          />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content
            style={{
              padding: 24,
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

export default AdminLayout;