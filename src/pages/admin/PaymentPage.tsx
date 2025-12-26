import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  Button,
  DatePicker,
  Input,
  Modal,
  message,
  Space,
  Table,
  Tag,
} from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { paymentAPI } from '../../services/api';
import type { Payment } from '../../types';

const { RangePicker } = DatePicker;

const PaymentPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>('');
  const [dateRange, setDateRange] = useState<[string, string] | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [refundModalVisible, setRefundModalVisible] = useState<boolean>(false);
  const [refundReason, setRefundReason] = useState<string>('');

  // 加载缴费数据
  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentAPI.getPayments();
      setPayments(data);
    } catch (error) {
      message.error('获取缴费数据失败');
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  // 过滤数据
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.patientName.toLowerCase().includes(searchText.toLowerCase()) ||
      payment.registrationId.toLowerCase().includes(searchText.toLowerCase());

    if (dateRange) {
      const paymentDate = new Date(payment.createTime)
        .toISOString()
        .split('T')[0];
      const [start, end] = dateRange;
      return paymentDate >= start && paymentDate <= end;
    }

    return matchesSearch;
  });

  // 处理退费
  const handleRefund = async () => {
    if (!selectedPayment) return;

    try {
      await paymentAPI.refundPayment(selectedPayment.id, refundReason);
      message.success('退费成功');
      setRefundModalVisible(false);
      setRefundReason('');
      loadPayments(); // 重新加载数据
    } catch (error) {
      message.error('退费失败');
      console.error('Error refunding payment:', error);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '缴费ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '挂号ID',
      dataIndex: 'registrationId',
      key: 'registrationId',
    },
    {
      title: '患者姓名',
      dataIndex: 'patientName',
      key: 'patientName',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toFixed(2)}`,
    },
    {
      title: '缴费方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => {
        const methodMap: Record<string, string> = {
          cash: '现金',
          card: '银行卡',
          wechat: '微信支付',
          alipay: '支付宝',
        };
        return methodMap[method] || method;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        if (status === 'paid') {
          return <Tag color="green">已缴费</Tag>;
        } else if (status === 'refunded') {
          return <Tag color="red">已退费</Tag>;
        } else {
          return <Tag color="orange">待缴费</Tag>;
        }
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: (time: string) => new Date(time).toLocaleString('zh-CN'),
    },
    {
      title: '退费时间',
      dataIndex: 'refundTime',
      key: 'refundTime',
      render: (time: string) =>
        time ? new Date(time).toLocaleString('zh-CN') : '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Payment) => (
        <Space size="middle">
          {record.status === 'paid' && (
            <Button
              type="primary"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setSelectedPayment(record);
                setRefundModalVisible(true);
              }}
            >
              退费
            </Button>
          )}
          {record.status === 'refunded' && (
            <Tag color="blue">退费原因: {record.refundReason}</Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Input
            placeholder="搜索患者姓名或挂号ID"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
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

      <Table
        columns={columns}
        dataSource={filteredPayments}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
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
          您确定要为患者 <strong>{selectedPayment?.patientName}</strong>{' '}
          退费吗？
        </p>
        <p>缴费金额：¥{selectedPayment?.amount?.toFixed(2)}</p>
        <p>挂号ID：{selectedPayment?.registrationId}</p>
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

export default PaymentPage;
