import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, message, Select, Space, Table, Tag } from 'antd';
import type React from 'react';
import { useEffect, useState } from 'react';
import { staffAPI } from '../../services/api';
import type { Staff } from '../../types';

const { Search } = Input;
const { Option } = Select;

const StaffPage: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  // 获取人员列表
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const response = await staffAPI.getStaff();
      setStaffList(response || []);
    } catch (error) {
      message.error('获取人员列表失败');
      setStaffList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // 过滤数据
  const filteredStaff = staffList.filter((staff) => {
    const matchesSearch = staff.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesDepartment =
      !selectedDepartment ||
      staff.departmentId.toString() === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const columns = [
    {
      title: '序号',
      key: 'index',
      render: (text: any, record: any, index: number) => index + 1,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '职位',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag
          color={
            role === 'doctor' ? 'blue' : role === 'nurse' ? 'green' : 'orange'
          }
        >
          {role === 'doctor' ? '医生' : role === 'nurse' ? '护士' : '管理员'}
        </Tag>
      ),
    },
    {
      title: '所属科室',
      key: 'departmentId',
      render: (text: any, record: any) => {
        const deptMap: Record<number, string> = {
          101: '内科',
          102: '外科',
          103: '儿科',
          104: '妇科',
          105: '眼科',
          0: '管理员',
        };
        return deptMap[record.departmentId] || '未知科室';
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button type="link">编辑</Button>
          <Button type="link" danger>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
        <Search
          placeholder="搜索姓名"
          allowClear
          onSearch={setSearchText}
          style={{ width: 200 }}
          suffix={<SearchOutlined />}
        />
        <Select
          placeholder="选择科室"
          allowClear
          style={{ width: 200 }}
          onChange={setSelectedDepartment}
          value={selectedDepartment}
        >
          <Option value="101">内科</Option>
          <Option value="102">外科</Option>
          <Option value="103">儿科</Option>
          <Option value="104">妇科</Option>
          <Option value="105">眼科</Option>
          <Option value="0">管理员</Option>
        </Select>
        <Button type="primary">新增人员</Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredStaff}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default StaffPage;
