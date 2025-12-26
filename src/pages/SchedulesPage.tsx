import { Card, Typography } from 'antd';
import type React from 'react';

const { Title } = Typography;

const SchedulesPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>专家坐诊排班表设置</Title>
      <Card>
        <p>专家坐诊排班表设置页面</p>
      </Card>
    </div>
  );
};

export default SchedulesPage;
