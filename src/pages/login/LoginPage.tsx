import { UserOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Tabs, Typography, message } from 'antd';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';

const { Title } = Typography;

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, logout, loading } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'admin' | 'doctor' | 'patient'>(
    'admin'
  );
  const [form] = Form.useForm();

  const roleNameMap: Record<string, string> = {
    admin: '管理员',
    doctor: '医生',
    patient: '患者',
  };

  const placeholderMap: Record<string, string> = {
    admin: '请输入管理员账号 (admin)',
    doctor: '请输入医生姓名 (如：张医生)',
    patient: '请输入患者用户名或姓名 (如：patient 或 张三)',
  };

  const hintMap: Record<string, string[]> = {
    admin: ['管理员用户名: admin'],
    doctor: ['医生姓名: 张医生、刘医生'],
    patient: ['患者用户名: patient', '患者姓名: 张三、李四、王五'],
  };

  const onFinish = async (values: { username: string }) => {
    const success = await login(values.username);

    if (success) {
      const user = useAuthStore.getState().user;

      // 验证角色是否匹配当前Tab
      if (user?.role !== activeTab) {
        message.error(
          `您的账号是${roleNameMap[user.role]}，请切换到对应的登录Tab`
        );
        logout();
        return;
      }

      // 根据角色跳转
      if (user?.role === 'admin') {
        navigate('/admin');
        message.success('管理员登录成功');
      } else if (user?.role === 'doctor') {
        navigate('/doctor/appointments');
        message.success('医生登录成功');
      } else if (user?.role === 'patient') {
        navigate('/patient');
        message.success('患者登录成功');
      }
    } else {
      message.error('用户名不存在，请检查输入或切换到其他登录方式');
    }
  };

  const tabItems = [
    {
      key: 'admin',
      label: '管理员',
      children: (
        <Form
          form={form}
          name="admin-login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入管理员账号!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={placeholderMap.admin}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
              size="large"
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Typography.Text type="secondary">
              {hintMap.admin.map((hint, idx) => (
                <div key={idx}>{hint}</div>
              ))}
            </Typography.Text>
          </div>
        </Form>
      ),
    },
    {
      key: 'doctor',
      label: '医生',
      children: (
        <Form
          form={form}
          name="doctor-login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入医生姓名!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={placeholderMap.doctor}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
              size="large"
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Typography.Text type="secondary">
              {hintMap.doctor.map((hint, idx) => (
                <div key={idx}>{hint}</div>
              ))}
            </Typography.Text>
          </div>
        </Form>
      ),
    },
    {
      key: 'patient',
      label: '患者',
      children: (
        <Form
          form={form}
          name="patient-login"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder={placeholderMap.patient}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: '100%' }}
              size="large"
            >
              登录
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <Typography.Text type="secondary">
              {hintMap.patient.map((hint, idx) => (
                <div key={idx}>{hint}</div>
              ))}
            </Typography.Text>
          </div>
        </Form>
      ),
    },
  ];

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
      <Card style={{ width: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1890ff' }}>
            医院管理系统
          </Title>
          <Typography.Text type="secondary">登录系统</Typography.Text>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => {
            setActiveTab(key as 'admin' | 'doctor' | 'patient');
            form.resetFields();
          }}
          items={tabItems}
          centered
        />
      </Card>
    </div>
  );
};

export default LoginPage;
