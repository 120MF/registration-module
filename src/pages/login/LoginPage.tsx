import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, message, Typography } from 'antd';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuthStore();

  const onFinish = async (values: { username: string; password: string }) => {
    const success = await login(values.username, values.password);

    if (success) {
      const user = useAuthStore.getState().user;
      if (user?.role === 'admin') {
        navigate('/admin');
        message.success('管理员登录成功');
      } else if (user?.role === 'patient') {
        navigate('/patient');
        message.success('患者登录成功');
      }
    } else {
      message.error('用户名不存在，请尝试 admin 或 patient');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
      }}
    >
      <Card style={{ width: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1890ff' }}>
            医院管理系统
          </Title>
          <Typography.Text type="secondary">请选择角色登录</Typography.Text>
        </div>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名 (admin, patient)"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Typography.Text type="secondary">
              提示: 可使用 admin 或 patient 作为用户名登录不同角色
            </Typography.Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
