import React from 'react';
import { Card, Space, Button, Grid } from 'antd';
import { UserOutlined, AppstoreOutlined, HistoryOutlined, FileTextOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { useBreakpoint } = Grid;

const HomePage: React.FC = () => {
  const screens = useBreakpoint();
  
  const features = [
    {
      key: 'profile',
      title: '档案维护',
      icon: <UserOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      path: '/patient/profile',
      description: '维护个人档案信息'
    },
    {
      key: 'registration',
      title: '挂号办理',
      icon: <AppstoreOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      path: '/patient/registration',
      description: '在线预约挂号'
    },
    {
      key: 'history',
      title: '结果查询',
      icon: <HistoryOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      path: '/patient/history',
      description: '查询就诊记录'
    },
    {
      key: 'report',
      title: '报告查询',
      icon: <FileTextOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      path: '/patient/report',
      description: '查看检验报告'
    }
  ];

  return (
    <div>
      <div style={{ 
        padding: '20px 12px',
        background: '#fff',
        borderRadius: '8px',
        marginBottom: '16px',
        textAlign: 'center'
      }}>
        <h2 style={{ margin: 0, color: '#1890ff' }}>欢迎使用患者服务系统</h2>
        <p style={{ color: '#888', margin: '8px 0 0' }}>便捷就医，健康同行</p>
      </div>
      
      <Space 
        direction="vertical" 
        size="middle" 
        style={{ 
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {features.map((feature) => (
          <Link to={feature.path} key={feature.key} style={{ width: '100%' }}>
            <Card 
              hoverable
              style={{ 
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
              bodyStyle={{ 
                padding: '16px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <div style={{ 
                width: '60px', 
                height: '60px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                borderRadius: '50%',
                backgroundColor: '#f0f7ff',
                marginRight: '16px'
              }}>
                {feature.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: '16px', color: '#333' }}>{feature.title}</h3>
                <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#888' }}>{feature.description}</p>
              </div>
              <div style={{ fontSize: '18px', color: '#ccc' }}>›</div>
            </Card>
          </Link>
        ))}
      </Space>
    </div>
  );
};

export default HomePage;