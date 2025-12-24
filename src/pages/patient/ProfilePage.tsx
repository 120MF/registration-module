import React, { useState, useEffect } from 'react';
import { Form, Input, Button, DatePicker, Radio, Switch, message, Card, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { patientAPI } from '../../services/api';

const { RangePicker } = DatePicker;

const ProfilePage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 获取患者档案
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await patientAPI.getProfile();
      const profile = response.data;
      
      form.setFieldsValue({
        name: profile.name,
        gender: profile.gender,
        birthDate: profile.birthDate ? dayjs(profile.birthDate) : null,
        phone: profile.phone,
        isInsurance: profile.isInsurance,
        allergies: profile.allergies,
        medicalHistory: profile.medicalHistory,
      });
    } catch (error) {
      message.error('获取档案信息失败');
    } finally {
      setLoading(false);
    }
  };

  // 保存患者档案
  const saveProfile = async (values: any) => {
    setSaving(true);
    try {
      await patientAPI.updateProfile({
        ...values,
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
      });
      message.success('档案更新成功');
    } catch (error) {
      message.error('更新档案失败');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={saveProfile}
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

          <Form.Item
            name="birthDate"
            label="出生日期"
          >
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
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码' }
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

          <Form.Item
            name="allergies"
            label="过敏史"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="请输入过敏史，如无请填写无" 
            />
          </Form.Item>

          <Form.Item
            name="medicalHistory"
            label="既往病史"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="请输入既往病史，如无请填写无" 
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={saving}>
                保存
              </Button>
              <Button onClick={fetchProfile} disabled={loading}>
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