import { Card, Typography } from 'antd';
import type React from 'react';

const { Title } = Typography;

const ExpertsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>专家介绍设置</Title>
      <Card>
        <p>专家介绍设置页面</p>
      </Card>
    </div>
  );
};

export default ExpertsPage;
