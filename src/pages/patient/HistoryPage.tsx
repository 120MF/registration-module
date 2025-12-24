import React, { useState, useEffect } from 'react';
import { List, Card, Tag, Timeline, Button, Modal, Space } from 'antd';
import { HistoryOutlined, FileTextOutlined, MedicineBoxOutlined } from '@ant-design/icons';
import { patientAPI } from '../../services/api';

const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // 获取历史记录
  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await patientAPI.getHistory();
      setHistory(response.data);
    } catch (error) {
      console.error('获取历史记录失败', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const showDetail = (record: any) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  return (
    <div>
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <HistoryOutlined style={{ marginRight: '8px', color: '#722ed1' }} />
            <span>就诊记录</span>
          </div>
        }
        style={{ marginBottom: '16px' }}
      >
        <List
          loading={loading}
          dataSource={history}
          renderItem={(record) => (
            <List.Item
              key={record.id}
              actions={[
                <Button type="link" onClick={() => showDetail(record)}>查看详情</Button>
              ]}
            >
              <List.Item.Meta
                title={
                  <div>
                    <span>{record.date}</span>
                    <Tag color="blue" style={{ marginLeft: '12px' }}>{record.department}</Tag>
                    <Tag color="green" style={{ marginLeft: '8px' }}>{record.doctor}</Tag>
                  </div>
                }
                description={
                  <div>
                    <div><strong>诊断：</strong>{record.diagnosis}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 详情弹窗 */}
      <Modal
        title="就诊详情"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>关闭</Button>
        ]}
        width={600}
      >
        {selectedRecord && (
          <div>
            <Card size="small" style={{ marginBottom: '16px' }}>
              <p><strong>就诊日期：</strong>{selectedRecord.date}</p>
              <p><strong>就诊科室：</strong>{selectedRecord.department}</p>
              <p><strong>接诊医生：</strong>{selectedRecord.doctor}</p>
              <p><strong>诊断结果：</strong>{selectedRecord.diagnosis}</p>
            </Card>

            <Card 
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <MedicineBoxOutlined style={{ marginRight: '8px' }} />
                  <span>处方信息</span>
                </div>
              }
              size="small"
            >
              <Timeline mode="left">
                {selectedRecord.prescriptions.map((pres: any, index: number) => (
                  <Timeline.Item key={index} label={`药品 ${index + 1}`}>
                    <p><strong>药品名称：</strong>{pres.name}</p>
                    <p><strong>数量：</strong>{pres.quantity}{pres.unit || '盒'}</p>
                    <p><strong>用法用量：</strong>{pres.dosage}</p>
                  </Timeline.Item>
                ))}
              </Timeline>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default HistoryPage;