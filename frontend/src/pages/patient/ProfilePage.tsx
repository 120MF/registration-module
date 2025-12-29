import { UserOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Radio,
  Space,
  Switch,
} from 'antd';
import dayjs from 'dayjs';
import type React from 'react';
import { useEffect } from 'react';
import { usePatientStore } from '../../stores';
import type { PatientProfile } from '../../types';

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const { profile, loading, saving, fetchProfile, updateProfile } =
    usePatientStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      form.setFieldsValue({
        name: profile.name,
        gender: profile.gender,
        birthDate: profile.birthDate ? dayjs(profile.birthDate) : null,
        phone: profile.phone,
        idCard: profile.idCard,
        isInsurance: profile.isInsurance,
      });
    }
  }, [profile, form]);

  const handleSave = async (values: {
    name: string;
    gender: string;
    birthDate: dayjs.Dayjs | null;
    phone: string;
    idCard: string;
    isInsurance: boolean;
  }) => {
    try {
      const data: PatientProfile = {
        id: profile?.id || 0,
        name: values.name,
        gender: values.gender,
        birthDate: values.birthDate
          ? values.birthDate.format('YYYY-MM-DD')
          : '',
        phone: values.phone,
        idCard: values.idCard || profile?.idCard || '',
        isInsurance: values.isInsurance,
      };
      await updateProfile(data);
      message.success('档案更新成功');
    } catch {
      message.error('更新档案失败');
    }
  };

  const handleReset = () => {
    if (profile) {
      form.setFieldsValue({
        name: profile.name,
        gender: profile.gender,
        birthDate: profile.birthDate ? dayjs(profile.birthDate) : null,
        phone: profile.phone,
        idCard: profile.idCard,
        isInsurance: profile.isInsurance,
      });
    }
  };

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
            <span>个人档案</span>
          </div>
        }
        style={{ marginBottom: '16px' }}
        loading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            isInsurance: false,
          }}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="请输入姓名" />
          </Form.Item>

          <Form.Item
            name="gender"
            label="性别"
            rules={[{ required: true, message: '请选择性别' }]}
          >
            <Radio.Group>
              <Radio value="男">男</Radio>
              <Radio value="女">女</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="birthDate" label="出生日期">
            <DatePicker
              style={{ width: '100%' }}
              placeholder="请选择出生日期"
              format="YYYY-MM-DD"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="联系电话"
            rules={[
              { required: true, message: '请输入联系电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' },
            ]}
          >
            <Input placeholder="请输入联系电话" />
          </Form.Item>

          <Form.Item
            name="isInsurance"
            label="是否医保"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={saving}>
                保存
              </Button>
              <Button onClick={handleReset} disabled={loading}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage;
