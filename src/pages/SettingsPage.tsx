import React from 'react';
import { Card, Typography } from 'antd';

const { Title } = Typography;

const SettingsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>系统设置</Title>
      <Card>
        <p>系统设置页面</p>
      </Card>
    </div>
  );
};

export default SettingsPage;