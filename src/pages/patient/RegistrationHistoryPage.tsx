import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Input,
  List,
  Modal,
  message,
  Space,
  Tag,
} from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { paymentAPI } from '../../services/api';
import { usePatientStore } from '../../stores';
import type { Payment, Registration } from '../../types';

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

  const { profile, fetchProfile } = usePatientStore();

  const loadPayments = async () => {
    try {
      setLoading(true);

      // 确保有患者档案
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
                style={{ width: '100%' }}
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
                          onClick={() => {
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
              </Card>
            </List.Item>
          );
        }}
      />

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
    </div>
  );
};

export default RegistrationHistoryPage;
