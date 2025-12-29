import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Input,
  List,
  Modal,
  Table,
  Tag,
  message,
  Space,
} from 'antd';
import dayjs from 'dayjs';
import type React from 'react';
import { useEffect, useState } from 'react';
import { paymentAPI, prescriptionAPI } from '../../services/api';
import { usePatientStore } from '../../stores';
import type { Payment, Prescription, Registration } from '../../types';

const { RangePicker } = DatePicker;

const RegistrationHistoryPage: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [refundModalVisible, setRefundModalVisible] = useState<boolean>(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundReason, setRefundReason] = useState<string>('');

  // 处方模态框状态
  const [prescriptionModalVisible, setPrescriptionModalVisible] =
    useState<boolean>(false);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<
    Prescription[]
  >([]);
  const [selectedRegistrationId, setSelectedRegistrationId] =
    useState<string>('');
  const [prescriptionLoading, setPrescriptionLoading] = useState<boolean>(false);

  const { profile, fetchProfile } = usePatientStore();

  const loadPayments = async () => {
    try {
      setLoading(true);

      if (!profile) {
        await fetchProfile();
      }

      const patientName = usePatientStore.getState().profile?.name;
      if (!patientName) {
        message.error('获取患者信息失败');
        return;
      }

      const paymentData = await paymentAPI.getPayments();
      const patientPayments = paymentData.filter(
        (payment) => payment.patientName === patientName,
      );

      const mockRegs: Registration[] = patientPayments.map((payment) => ({
        id: payment.registrationId,
        departmentId: 101,
        doctorId: 1,
        scheduleId: 1,
        patientName: payment.patientName,
        status: payment.status === 'refunded' ? 'refunded' : 'confirmed',
        createTime: payment.createTime,
      }));

      setRegistrations(mockRegs);
      setPayments(patientPayments);
    } catch {
      message.error('获取挂号历史数据失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      loadPayments();
    }
  }, [profile]);

  const getPaymentForRegistration = (regId: string) => {
    return payments.find((p) => p.registrationId === regId);
  };

  const filteredData = registrations.filter((reg) => {
    const payment = getPaymentForRegistration(reg.id);

    const matchesSearch =
      reg.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      reg.id.toLowerCase().includes(searchText.toLowerCase());

    if (dateRange && payment) {
      const regDate = new Date(payment.createTime).toISOString().split('T')[0];
      const [start, end] = dateRange;
      return matchesSearch && regDate >= start && regDate <= end;
    }

    return matchesSearch;
  });

  const handleRefund = async () => {
    if (!selectedPayment) return;

    try {
      await paymentAPI.refundPayment(selectedPayment.id, refundReason);
      message.success('退费成功');
      setRefundModalVisible(false);
      setRefundReason('');
      loadPayments();
    } catch {
      message.error('退费失败');
    }
  };

  // 查看处方记录
  const handleViewPrescriptions = async (registrationId: string) => {
    setPrescriptionLoading(true);
    setSelectedRegistrationId(registrationId);
    try {
      const allPrescriptions = await prescriptionAPI.getPrescriptions();
      const regPrescriptions = allPrescriptions.filter(
        (p) => p.reg_id === registrationId,
      );
      setSelectedPrescriptions(regPrescriptions);
      setPrescriptionModalVisible(true);
    } catch {
      message.error('获取处方记录失败');
    } finally {
      setPrescriptionLoading(false);
    }
  };

  const prescriptionColumns = [
    {
      title: '处方ID',
      dataIndex: 'prescription_id',
      key: 'prescription_id',
      width: 120,
    },
    {
      title: '开具日期',
      dataIndex: 'prescription_date',
      key: 'prescription_date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '症状',
      dataIndex: 'symptoms',
      key: 'symptoms',
    },
    {
      title: '诊断',
      dataIndex: 'diagnosis',
      key: 'diagnosis',
    },
    {
      title: '状态',
      dataIndex: 'prescription_status',
      key: 'prescription_status',
      render: (status: number) => {
        const statusMap = {
          1: <Tag color="green">有效</Tag>,
          0: <Tag color="red">作废</Tag>,
          2: <Tag color="blue">已归档</Tag>,
        };
        return statusMap[status as keyof typeof statusMap] || '未知';
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索挂号ID或患者姓名"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <RangePicker
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setDateRange([
                  dates[0].format('YYYY-MM-DD'),
                  dates[1].format('YYYY-MM-DD'),
                ]);
              } else {
                setDateRange(null);
              }
            }}
          />
          <Button onClick={loadPayments}>刷新</Button>
        </Space>
      </div>

      <List
        loading={loading}
        itemLayout="vertical"
        dataSource={filteredData}
        renderItem={(registration) => {
          const payment = getPaymentForRegistration(registration.id);

          return (
            <List.Item>
              <Card
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.3s',
                }}
                hoverable
                onClick={() => handleViewPrescriptions(registration.id)}
                title={
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>挂号: {registration.id}</span>
                    {payment && (
                      <Tag
                        color={
                          payment.status === 'paid'
                            ? 'green'
                            : payment.status === 'refunded'
                              ? 'red'
                              : 'orange'
                        }
                      >
                        {payment.status === 'paid'
                          ? '已缴费'
                          : payment.status === 'refunded'
                            ? '已退费'
                            : '待缴费'}
                      </Tag>
                    )}
                  </div>
                }
              >
                <List.Item.Meta
                  title={`患者: ${registration.patientName}`}
                  description={`挂号时间: ${registration.createTime ? new Date(registration.createTime).toLocaleString('zh-CN') : 'N/A'}`}
                />
                <div style={{ marginTop: 16 }}>
                  <p>
                    状态:{' '}
                    <Tag
                      color={
                        registration.status === 'confirmed' ? 'green' : 'red'
                      }
                    >
                      {registration.status}
                    </Tag>
                  </p>
                  {payment && (
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <p>缴费金额: ¥{payment.amount?.toFixed(2)}</p>
                        <p>
                          缴费方式:{' '}
                          {payment.paymentMethod === 'wechat'
                            ? '微信支付'
                            : payment.paymentMethod === 'alipay'
                              ? '支付宝'
                              : payment.paymentMethod === 'card'
                                ? '银行卡'
                                : payment.paymentMethod === 'cash'
                                  ? '现金'
                                  : payment.paymentMethod}
                        </p>
                        {payment.status === 'refunded' &&
                          payment.refundReason && (
                            <p>退费原因: {payment.refundReason}</p>
                          )}
                      </div>
                      {payment.status === 'paid' && (
                        <Button
                          type="primary"
                          danger
                          icon={<CloseCircleOutlined />}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPayment(payment);
                            setRefundModalVisible(true);
                          }}
                        >
                          退费
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <span style={{ color: '#999', fontSize: '12px' }}>
                    点击卡片查看处方记录
                  </span>
                </div>
              </Card>
            </List.Item>
          );
        }}
      />

      {/* 退费确认弹窗 */}
      <Modal
        title="退费确认"
        open={refundModalVisible}
        onOk={handleRefund}
        onCancel={() => {
          setRefundModalVisible(false);
          setRefundReason('');
        }}
      >
        <p>
          您确定要为挂号 <strong>{selectedPayment?.registrationId}</strong>{' '}
          退费吗？
        </p>
        <p>缴费金额：¥{selectedPayment?.amount?.toFixed(2)}</p>
        <div style={{ marginTop: 16 }}>
          <label>退费原因：</label>
          <Input.TextArea
            rows={4}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="请输入退费原因"
          />
        </div>
      </Modal>

      {/* 处方记录弹窗 */}
      <Modal
        title={`挂号 ${selectedRegistrationId} 的处方记录`}
        open={prescriptionModalVisible}
        onCancel={() => setPrescriptionModalVisible(false)}
        width={1000}
        footer={[
          <Button
            key="close"
            onClick={() => setPrescriptionModalVisible(false)}
          >
            关闭
          </Button>,
        ]}
      >
        {selectedPrescriptions.length > 0 ? (
          <Table
            columns={prescriptionColumns}
            dataSource={selectedPrescriptions}
            rowKey="prescription_id"
            loading={prescriptionLoading}
            pagination={false}
            size="small"
            scroll={{ x: 800 }}
            expandable={{
              expandedRowRender: (record: Prescription) => (
                <div style={{ padding: '16px 0' }}>
                  <p>
                    <strong>备注：</strong> {record.remark || '暂无备注'}
                  </p>
                  <p>
                    <strong>创建时间：</strong>{' '}
                    {dayjs(record.create_time).format('YYYY-MM-DD HH:mm:ss')}
                  </p>
                  <p>
                    <strong>更新时间：</strong>{' '}
                    {dayjs(record.update_time).format('YYYY-MM-DD HH:mm:ss')}
                  </p>
                </div>
              ),
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <p>暂无处方记录</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RegistrationHistoryPage;
