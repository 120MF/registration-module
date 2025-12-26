import { Card, Typography } from 'antd';
import type React from 'react';

const { Title } = Typography;

const MyAppointmentsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>我的预约记录</Title>
      <Card>
        <p>我的预约记录页面</p>
      </Card>
    </div>
  );
};

export default MyAppointmentsPage;
