import { FileTextOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Button, Table, Tag, Space, message, Card } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { doctorAPI, prescriptionAPI } from '../../services/api';
import { useAuthStore } from '../../stores';
import type { DoctorRegistration, Prescription } from '../../types';
import PrescriptionModal from '../../components/PrescriptionModal';

// 扩展DoctorRegistration类型以包含处方信息
interface DoctorRegistrationWithPrescription extends DoctorRegistration {
  prescription?: Prescription;
}

const AppointmentsPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<DoctorRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRegistration, setSelectedRegistration] =
    useState<DoctorRegistrationWithPrescription | null>(null);

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
      // 由于后端API已经返回了hasPrescription字段，我们直接使用
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
  const handleOpenPrescriptionModal = async (record: DoctorRegistration) => {
    // 如果是编辑现有处方，则先获取处方详情
    if (record.hasPrescription) {
      try {
        // 获取该挂号对应的处方
        const prescriptions = await prescriptionAPI.getPrescriptions();
        const prescription = prescriptions.find(p => p.reg_id === record.id && p.staff_id === doctorId);
        if (prescription) {
          // 将挂号记录和处方信息一起设置
          setSelectedRegistration({...record, prescription});
          setModalVisible(true);
        } else {
          message.error('未找到对应的处方记录');
        }
      } catch (error) {
        console.error('获取处方详情失败:', error);
        message.error('获取处方详情失败');
      }
    } else {
      // 开具新处方
      setSelectedRegistration(record);
      setModalVisible(true);
    }
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
      width: 150,
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
            <Button
              type="primary"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => handleOpenPrescriptionModal(record)}
            >
              查看/编辑
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
          prescription={selectedRegistration.prescription} // 传递处方信息用于编辑
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
