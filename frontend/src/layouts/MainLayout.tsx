import {
  AppstoreOutlined,
  CalendarOutlined,
  MedicineBoxOutlined,
  ScheduleOutlined,
  SettingOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Col, Layout, Menu, Row, Typography } from 'antd';
import type React from 'react';
import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label: <Link to={`/${key}`}>{label}</Link>,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('门诊管理', 'dashboard', <AppstoreOutlined />),
  getItem('科室设置', 'departments', <MedicineBoxOutlined />),
  getItem('专家管理', 'experts', <TeamOutlined />),
  getItem('排班管理', 'schedules', <ScheduleOutlined />),
  getItem('预约挂号', 'appointments', <CalendarOutlined />),
  getItem('预约记录', 'my-appointments', <UserOutlined />),
  getItem('系统设置', 'settings', <SettingOutlined />),
];

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ background: '#fff' }}
      >
        <div
          className="demo-logo-vertical"
          style={{ padding: '16px', textAlign: 'center' }}
        >
          <Title style={{ color: '#fff', margin: 0 }} level={4}>
            医院门诊系统
          </Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <Row
            justify="end"
            align="middle"
            style={{ paddingRight: 20, height: '100%' }}
          >
            <Col>
              <span>管理员</span>
            </Col>
          </Row>
        </Header>
        <Content style={{ margin: '24px 16px 0' }}>
          <div style={{ padding: 24, minHeight: 360, background: '#fff' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
