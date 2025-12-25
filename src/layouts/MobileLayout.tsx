import React from 'react';
import { Layout, Menu, Typography, Grid } from 'antd';
import { AppstoreOutlined, UserOutlined, HistoryOutlined, SettingOutlined } from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header, Content, Footer } = Layout;
const { useBreakpoint } = Grid;
const { Title } = Typography;

const MobileLayout: React.FC = () => {
  const location = useLocation();
  const screens = useBreakpoint();
  
  const menuItems: MenuProps['items'] = [
    {
      key: '/patient/profile',
      label: '档案',
      icon: <UserOutlined />,
    },
    {
      key: '/patient/registration',
      label: '挂号',
      icon: <AppstoreOutlined />,
    },
    {
      key: '/patient/history',
      label: '历史',
      icon: <HistoryOutlined />,
    },
  ];

  // Determine active key based on current path
  const currentKey = menuItems?.find(item => location.pathname.startsWith(item?.key || ''))?.key || '/patient/profile';

  return (
    <Layout style={{ 
      minHeight: '100vh',
      maxWidth: screens.md ? '400px' : '100%', 
      margin: screens.md ? '0 auto' : '0',
      background: '#f5f5f5'
    }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        backgroundColor: '#1890ff',
        padding: '0 20px'
      }}>
        <Title level={4} style={{ color: 'white', margin: 0, flex: 1 }}>患者服务</Title>
      </Header>
      <Content
        style={{
          padding: '20px 12px',
          margin: 0,
          minHeight: 280,
        }}
      >
        <Outlet />
      </Content>
      <Footer style={{ padding: 0 }}>
        <Menu
          mode="horizontal"
          selectedKeys={[currentKey]}
          style={{
            display: 'flex',
            borderTop: '1px solid #e8e8e8',
            background: '#fff'
          }}
          items={menuItems.map(item => ({
            ...item,
            style: { flex: 1, textAlign: 'center' }, // Make each tab equal width
            label: <Link to={item.key as string}>{item.label}</Link>
          }))}
        />
      </Footer>
    </Layout>
  );
};

export default MobileLayout;