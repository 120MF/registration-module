import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const AppointmentsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>专家门诊网上预约挂号</Title>
      <Card>
        <p>专家门诊网上预约挂号页面</p>
      </Card>
    </div>
  );
};

export default AppointmentsPage;