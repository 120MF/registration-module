import { LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Layout, Menu, Space, Typography } from 'antd';
import type React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
    {
      key: '/admin/patients',
      label: <Link to="/admin/patients">患者管理</Link>,
    },
    {
      key: '/admin/payments',
      label: <Link to="/admin/payments">缴费管理</Link>,
    },
    {
      key: '/admin/prescriptions',
      label: <Link to="/admin/prescriptions">处方管理</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#1890ff',
        }}
      >
        <div>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            医院管理系统
          </Title>
        </div>
        <Space>
          <Typography.Text style={{ color: 'white' }}>
            {user?.username || '管理员'}
          </Typography.Text>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ color: 'white' }}
          >
            退出
          </Button>
        </Space>
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
