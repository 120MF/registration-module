import { Card, Typography } from 'antd';
import type React from 'react';

const { Title } = Typography;

const DepartmentsPage: React.FC = () => {
  return (
    <div>
      <Title level={2}>门诊科室设置</Title>
      <Card>
        <p>门诊科室设置页面</p>
      </Card>
    </div>
  );
};

export default DepartmentsPage;
