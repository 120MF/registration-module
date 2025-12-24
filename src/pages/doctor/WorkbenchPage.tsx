import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Descriptions, 
  Tabs, 
  Form, 
  Input, 
  Select, 
  Table, 
  Button, 
  Space, 
  Tag, 
  Timeline,
  message 
} from 'antd';
import { 
  UserOutlined, 
  FileTextOutlined, 
  MedicineBoxOutlined, 
  SearchOutlined,
  PlusOutlined,
  CheckCircleOutlined 
} from '@ant-design/icons';
import { doctorAPI, dictAPI } from '../../services/api';

const { TextArea } = Input;
const { TabPane } = Tabs;

const WorkbenchPage: React.FC = () => {
  const [currentPatient, setCurrentPatient] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [drugs, setDrugs] = useState<any[]>([]);
  const [examinations, setExaminations] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [selectedExaminations, setSelectedExaminations] = useState<any[]>([]);
  const [selectedTests, setSelectedTests] = useState<any[]>([]);
  const [form] = Form.useForm();

  // 获取患者队列
  const fetchPatientQueue = async () => {
    setLoading(true);
    try {
      const response = await doctorAPI.getPatientQueue();
      // 这里获取患者队列，当前页面只处理当前选中患者
    } catch (error) {
      message.error('获取患者队列失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取字典数据
  const fetchDictData = async () => {
    try {
      const [drugRes, examRes, testRes] = await Promise.all([
        dictAPI.getDrugs(),
        dictAPI.getExaminations(),
        dictAPI.getTests()
      ]);
      
      setDrugs(drugRes.data.filter((d: any) => d.status === 1));
      setExaminations(examRes.data.filter((e: any) => e.status === 1));
      setTests(testRes.data.filter((t: any) => t.status === 1));
    } catch (error) {
      message.error('获取字典数据失败');
    }
  };

  // 模拟选中一个患者
  useEffect(() => {
    fetchPatientQueue();
    fetchDictData();
    
    // 模拟当前患者信息
    setCurrentPatient({
      id: 'GH20250520001',
      name: '李四',
      age: 28,
      gender: '男',
      phone: '13800138000',
      allergies: '青霉素过敏',
      medicalHistory: '高血压病史',
      status: 'waiting',
      time: '09:00'
    });
  }, []);

  // 添加处方
  const addPrescription = () => {
    const newPrescription = {
      id: Date.now(),
      drugId: undefined,
      drugName: '',
      quantity: 1,
      dosage: '',
      price: 0
    };
    setPrescriptions([...prescriptions, newPrescription]);
  };

  // 更新处方
  const updatePrescription = (index: number, field: string, value: any) => {
    const updated = [...prescriptions];
    updated[index] = { ...updated[index], [field]: value };
    
    // 如果是药品选择，自动填充价格
    if (field === 'drugId') {
      const drug = drugs.find(d => d.id === value);
      if (drug) {
        updated[index] = { 
          ...updated[index], 
          drugName: drug.name,
          price: drug.price 
        };
      }
    }
    
    setPrescriptions(updated);
  };

  // 删除处方
  const removePrescription = (index: number) => {
    const updated = [...prescriptions];
    updated.splice(index, 1);
    setPrescriptions(updated);
  };

  // 计算处方总价
  const totalPrescriptionPrice = prescriptions.reduce((sum, pres) => sum + (pres.price * pres.quantity || 0), 0);

  // 添加检查
  const addExamination = (examId: number) => {
    const exam = examinations.find(e => e.id === examId);
    if (exam && !selectedExaminations.find(se => se.id === examId)) {
      setSelectedExaminations([...selectedExaminations, exam]);
    }
  };

  // 移除检查
  const removeExamination = (examId: number) => {
    setSelectedExaminations(selectedExaminations.filter(e => e.id !== examId));
  };

  // 添加检验
  const addTest = (testId: number) => {
    const test = tests.find(t => t.id === testId);
    if (test && !selectedTests.find(st => st.id === testId)) {
      setSelectedTests([...selectedTests, test]);
    }
  };

  // 移除检验
  const removeTest = (testId: number) => {
    setSelectedTests(selectedTests.filter(t => t.id !== testId));
  };

  // 提交诊疗
  const handleSubmitDiagnosis = async () => {
    try {
      message.success('诊疗提交成功');
      // 这里可以添加实际的提交逻辑
    } catch (error) {
      message.error('提交诊疗失败');
    }
  };

  // 处方表格列
  const prescriptionColumns = [
    {
      title: '药品名称',
      dataIndex: 'drugName',
      key: 'drugName',
      render: (text: string, record: any, index: number) => (
        <Select
          style={{ width: '100%' }}
          placeholder="选择药品"
          value={record.drugId}
          onChange={(value) => updatePrescription(index, 'drugId', value)}
        >
          {drugs.map(drug => (
            <Select.Option key={drug.id} value={drug.id}>
              {drug.name} (¥{drug.price}/{drug.unit})
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (text: number, record: any, index: number) => (
        <Input
          type="number"
          min="1"
          value={record.quantity}
          onChange={(e) => updatePrescription(index, 'quantity', parseInt(e.target.value) || 1)}
        />
      ),
    },
    {
      title: '用法用量',
      dataIndex: 'dosage',
      key: 'dosage',
      render: (text: string, record: any, index: number) => (
        <Input
          value={record.dosage}
          onChange={(e) => updatePrescription(index, 'dosage', e.target.value)}
          placeholder="如：每日三次，每次1片"
        />
      ),
    },
    {
      title: '价格',
      key: 'price',
      render: (text: any, record: any) => `¥${(record.price * record.quantity || 0).toFixed(2)}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any, index: number) => (
        <Button 
          type="link" 
          danger 
          onClick={() => removePrescription(index)}
        >
          删除
        </Button>
      ),
    },
  ];

  // 检查表格列
  const examinationColumns = [
    {
      title: '检查项目',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Button 
          type="link" 
          danger 
          onClick={() => removeExamination(record.id)}
        >
          移除
        </Button>
      ),
    },
  ];

  // 检验表格列
  const testColumns = [
    {
      title: '检验项目',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price}`,
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Button 
          type="link" 
          danger 
          onClick={() => removeTest(record.id)}
        >
          移除
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {currentPatient ? (
        <div>
          {/* 患者信息栏 */}
          <Card 
            style={{ marginBottom: '24px' }}
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <UserOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                <span>患者信息</span>
              </div>
            }
          >
            <Descriptions column={4}>
              <Descriptions.Item label="姓名">{currentPatient.name}</Descriptions.Item>
              <Descriptions.Item label="年龄">{currentPatient.age}岁</Descriptions.Item>
              <Descriptions.Item label="性别">{currentPatient.gender}</Descriptions.Item>
              <Descriptions.Item label="电话">{currentPatient.phone}</Descriptions.Item>
              <Descriptions.Item label="过敏史" span={2}>
                <Tag color={currentPatient.allergies ? 'red' : 'default'}>
                  {currentPatient.allergies || '无'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="既往病史" span={2}>
                {currentPatient.medicalHistory || '无'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 诊疗操作区 */}
          <Card>
            <Tabs defaultActiveKey="1">
              {/* 病历书写 */}
              <TabPane tab="病历书写" key="1">
                <Form form={form} layout="vertical">
                  <Form.Item label="主诉">
                    <TextArea rows={4} placeholder="请输入患者主诉" />
                  </Form.Item>
                  
                  <Form.Item label="现病史">
                    <TextArea rows={6} placeholder="请输入现病史" />
                  </Form.Item>
                  
                  <Form.Item label="既往史">
                    <TextArea rows={4} placeholder="请输入既往史" />
                  </Form.Item>
                  
                  <Form.Item label="体格检查">
                    <TextArea rows={6} placeholder="请输入体格检查结果" />
                  </Form.Item>
                  
                  <Form.Item label="诊断">
                    <TextArea rows={4} placeholder="请输入诊断结果" />
                  </Form.Item>
                </Form>
              </TabPane>

              {/* 检查开具 */}
              <TabPane tab="检查开具" key="2">
                <div style={{ display: 'flex', marginBottom: '24px' }}>
                  <Select
                    style={{ width: 300, marginRight: '16px' }}
                    placeholder="选择检查项目"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children as string).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {examinations
                      .filter(exam => !selectedExaminations.some(se => se.id === exam.id))
                      .map(exam => (
                        <Select.Option key={exam.id} value={exam.id}>
                          {exam.name} (¥{exam.price})
                        </Select.Option>
                      ))}
                  </Select>
                  <Button 
                    type="primary" 
                    onClick={() => {
                      const selectedValue = form.getFieldValue('examinationSelect');
                      if (selectedValue) {
                        addExamination(selectedValue);
                        form.setFieldsValue({ examinationSelect: undefined });
                      }
                    }}
                  >
                    添加检查
                  </Button>
                </div>

                <Table 
                  columns={examinationColumns} 
                  dataSource={selectedExaminations} 
                  rowKey="id" 
                  pagination={false}
                />
              </TabPane>

              {/* 检验开具 */}
              <TabPane tab="检验开具" key="3">
                <div style={{ display: 'flex', marginBottom: '24px' }}>
                  <Select
                    style={{ width: 300, marginRight: '16px' }}
                    placeholder="选择检验项目"
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.children as string).toLowerCase().includes(input.toLowerCase())
                    }
                  >
                    {tests
                      .filter(test => !selectedTests.some(st => st.id === test.id))
                      .map(test => (
                        <Select.Option key={test.id} value={test.id}>
                          {test.name} (¥{test.price})
                        </Select.Option>
                      ))}
                  </Select>
                  <Button 
                    type="primary" 
                    onClick={() => {
                      const selectedValue = form.getFieldValue('testSelect');
                      if (selectedValue) {
                        addTest(selectedValue);
                        form.setFieldsValue({ testSelect: undefined });
                      }
                    }}
                  >
                    添加检验
                  </Button>
                </div>

                <Table 
                  columns={testColumns} 
                  dataSource={selectedTests} 
                  rowKey="id" 
                  pagination={false}
                />
              </TabPane>

              {/* 药品开具 */}
              <TabPane tab="药品开具" key="4">
                <div style={{ marginBottom: '24px' }}>
                  <Button 
                    type="dashed" 
                    onClick={addPrescription}
                    icon={<PlusOutlined />}
                  >
                    添加药品
                  </Button>
                </div>

                <Table 
                  columns={prescriptionColumns} 
                  dataSource={prescriptions} 
                  rowKey="id" 
                  pagination={false}
                />

                {prescriptions.length > 0 && (
                  <div style={{ 
                    textAlign: 'right', 
                    marginTop: '16px', 
                    padding: '16px', 
                    background: '#f6ffed', 
                    border: '1px solid #b7eb8f', 
                    borderRadius: '4px' 
                  }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      处方总价：¥{totalPrescriptionPrice.toFixed(2)}
                    </span>
                  </div>
                )}
              </TabPane>
            </Tabs>

            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <Space>
                <Button type="primary" size="large" onClick={handleSubmitDiagnosis}>
                  <CheckCircleOutlined />
                  提交诊疗
                </Button>
                <Button size="large">保存草稿</Button>
                <Button size="large" danger>结束接诊</Button>
              </Space>
            </div>
          </Card>

          {/* 历史记录 */}
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <FileTextOutlined style={{ marginRight: '8px' }} />
                <span>历史就诊记录</span>
              </div>
            }
            style={{ marginTop: '24px' }}
          >
            <Timeline mode="left">
              <Timeline.Item label="2025-05-15" color="green">
                <p><strong>科室：</strong>内科</p>
                <p><strong>医生：</strong>王医生</p>
                <p><strong>诊断：</strong>感冒</p>
              </Timeline.Item>
              <Timeline.Item label="2025-04-20" color="blue">
                <p><strong>科室：</strong>内科</p>
                <p><strong>医生：</strong>李医生</p>
                <p><strong>诊断：</strong>高血压</p>
              </Timeline.Item>
            </Timeline>
          </Card>
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>暂无待诊患者</p>
        </div>
      )}
    </div>
  );
};

export default WorkbenchPage;