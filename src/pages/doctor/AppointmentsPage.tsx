import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Table, Tag, Space, message, Card } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { doctorAPI } from '../../services/api';
import { useAuthStore } from '../../stores';
import type { DoctorRegistration } from '../../types';
import PrescriptionModal from '../../components/PrescriptionModal';

const AppointmentsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<DoctorRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<DoctorRegistration | null>(null);

  const { user } = useAuthStore();
  const doctorId = user?.staffId;

  // 获取今日挂号单
  const fetchTodayAppointments = async () => {
    if (!doctorId) {
      message.error('医生信息不完整');
      return;
    }

    setLoading(true);
    try {
      const response = await doctorAPI.getTodayRegistrations(doctorId);
      setRegistrations(response || []);
    } catch (error) {
      console.error('获取挂号单失败:', error);
      message.error('获取挂号单失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchTodayAppointments();
    }
  }, [doctorId]);

  // 打开开处方模态框
  const handleOpenPrescriptionModal = (record: DoctorRegistration) => {
    setSelectedRegistration(record);
    setModalVisible(true);
  };

  // 处方提交成功后的回调
  const handlePrescriptionSubmitted = () => {
    setModalVisible(false);
    setSelectedRegistration(null);
    fetchTodayAppointments(); // 刷新列表
    message.success('处方开具成功');
  };

  const columns = [
    {
      title: '挂号ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '患者姓名',
      dataIndex: 'patientName',
      key: 'patientName',
      width: 120,
    },
    {
      title: '挂号时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (text: string) => {
        try {
          return new Date(text).toLocaleString('zh-CN');
        } catch {
          return text;
        }
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          confirmed: { text: '已确认', color: 'green' },
          pending: { text: '待确认', color: 'orange' },
          cancelled: { text: '已取消', color: 'red' },
        };
        const s = statusMap[status] || { text: status, color: 'default' };
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: '处方状态',
      key: 'hasPrescription',
      width: 120,
      render: (_: any, record: DoctorRegistration) => {
        return record.hasPrescription ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            已开处方
          </Tag>
        ) : (
          <Tag color="default">未开处方</Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: DoctorRegistration) => (
        <Space>
          {!record.hasPrescription && (
            <Button
              type="primary"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleOpenPrescriptionModal(record)}
            >
              开处方
            </Button>
          )}
          {record.hasPrescription && (
            <Button type="link" size="small" disabled>
              已开处方
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Card
        title="今日挂号单"
        extra={
          <Button onClick={fetchTodayAppointments} loading={loading}>
            刷新
          </Button>
        }
        style={{ marginBottom: 16 }}
      >
        <Table
          columns={columns}
          dataSource={registrations}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1000 }}
          locale={{ emptyText: '暂无挂号单' }}
        />
      </Card>

      {/* 开处方模态框 */}
      {selectedRegistration && (
        <PrescriptionModal
          visible={modalVisible}
          registration={selectedRegistration}
          doctorId={doctorId!}
          onCancel={() => {
            setModalVisible(false);
            setSelectedRegistration(null);
          }}
          onSubmit={handlePrescriptionSubmitted}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
