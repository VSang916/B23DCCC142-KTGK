// src/pages/ClassroomManagement.tsx
import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  message, 
  Space, 
  Popconfirm,
  Row,
  Col,
  TableProps
} from 'antd';
import { Classroom } from '../../models/Classroom';
import { ClassroomService } from '../../services/ClassroomService';
import { SearchOutlined } from '@ant-design/icons';
import { SorterResult } from 'antd/es/table/interface';

const { Column } = Table;
const { Option } = Select;

const ClassroomManagement: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(null);
  const [searchText, setSearchText] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState<string | null>(null);
  const [form] = Form.useForm();

  const managers = ['Nguyễn Viết Sang', 'Trần Đức Định', 'Lưu Đức Tuấn'];
  const roomTypes = ['Lý thuyết', 'Thực hành', 'Hội trường'];

  useEffect(() => {
    const storedClassrooms = ClassroomService.getClassrooms();
    setClassrooms(storedClassrooms);
    setFilteredClassrooms(storedClassrooms);
  }, []);

  useEffect(() => {
    let result = [...classrooms];

    if (searchText) {
      const searchLower = searchText.toLowerCase();
      result = result.filter(classroom => 
        classroom.id.toLowerCase().includes(searchLower) || 
        classroom.name.toLowerCase().includes(searchLower)
      );
    }

    if (roomTypeFilter) {
      result = result.filter(classroom => classroom.type === roomTypeFilter);
    }

    setFilteredClassrooms(result);
  }, [searchText, roomTypeFilter, classrooms]);

  const handleAddEdit = () => {
    form.validateFields().then(values => {
      const classroom: Classroom = {
        id: currentClassroom?.id || Math.random().toString(36).substr(2, 10),
        ...values
      };

      if (!ClassroomService.isClassroomNameUnique(classroom.name, currentClassroom?.id)) {
        message.error('Tên phòng học đã tồn tại');
        return;
      }

      if (currentClassroom) {
        ClassroomService.updateClassroom(classroom);
      } else {
        ClassroomService.addClassroom(classroom);
      }

      const updatedClassrooms = ClassroomService.getClassrooms();
      setClassrooms(updatedClassrooms);
      setIsModalVisible(false);
      form.resetFields();
      setCurrentClassroom(null);
      message.success('Thao tác thành công');
    });
  };

  const handleDelete = (record: Classroom) => {
    if (record.capacity >= 30) {
      message.error('Chỉ được xóa phòng dưới 30 chỗ ngồi');
      return;
    }

    ClassroomService.deleteClassroom(record.id);
    const updatedClassrooms = ClassroomService.getClassrooms();
    setClassrooms(updatedClassrooms);
    message.success('Xóa phòng học thành công');
  };

  const openEditModal = (record: Classroom) => {
    setCurrentClassroom(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleTableChange: TableProps<Classroom>['onChange'] = (pagination, filters, sorter) => {
    const sorterResult = Array.isArray(sorter) ? sorter[0] : sorter;

    if (sorterResult.columnKey === 'capacity') {
      const sortedClassrooms = [...filteredClassrooms].sort((a: Classroom, b: Classroom) => 
        sorterResult.order === 'ascend' 
          ? a.capacity - b.capacity 
          : b.capacity - a.capacity
      );
      setFilteredClassrooms(sortedClassrooms);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Input 
            placeholder="Tìm kiếm theo mã phòng hoặc tên phòng"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>
        <Col span={8}>
          <Select
            style={{ width: '100%' }}
            placeholder="Lọc theo loại phòng"
            allowClear
            onChange={(value) => setRoomTypeFilter(value)}
          >
            {roomTypes.map(type => (
              <Option key={type} value={type}>{type}</Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Button 
            type="primary" 
            onClick={() => setIsModalVisible(true)}
          >
            Thêm Phòng Học
          </Button>
        </Col>
      </Row>

      <Table 
        dataSource={filteredClassrooms} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
        onChange={handleTableChange}
      >
        <Column 
          title="Mã Phòng" 
          dataIndex="id" 
          key="id" 
        />
        <Column 
          title="Tên Phòng" 
          dataIndex="name" 
          key="name" 
        />
        <Column 
          title="Số Chỗ Ngồi" 
          dataIndex="capacity" 
          key="capacity" 
          sorter={(a: Classroom, b: Classroom) => a.capacity - b.capacity}
        />
        <Column 
          title="Loại Phòng" 
          dataIndex="type" 
          key="type" 
        />
        <Column 
          title="Người Phụ Trách" 
          dataIndex="manager" 
          key="manager" 
        />
        <Column
          title="Thao Tác"
          key="actions"
          render={(_, record: Classroom) => (
            <Space>
              <Button onClick={() => openEditModal(record)}>Sửa</Button>
              <Popconfirm
                title="Bạn chắc chắn muốn xóa?"
                onConfirm={() => handleDelete(record)}
              >
                <Button danger>Xóa</Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={currentClassroom ? 'Chỉnh Sửa Phòng Học' : 'Thêm Phòng Học'}
        visible={isModalVisible}
        onOk={handleAddEdit}
        onCancel={() => {
          setIsModalVisible(false);
          setCurrentClassroom(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item 
            name="name" 
            label="Tên Phòng" 
            rules={[
              { required: true, message: 'Vui lòng nhập tên phòng' },
              { max: 50, message: 'Tên phòng không được quá 50 ký tự' }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item 
            name="capacity" 
            label="Số Chỗ Ngồi"
            rules={[
              { required: true, message: 'Vui lòng nhập số chỗ ngồi' },
              { 
                validator: (_, value) => {
                  if (value <= 0) {
                    return Promise.reject(new Error('Số chỗ ngồi phải lớn hơn 0'));
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input type="number" min={1} />
          </Form.Item>
          <Form.Item 
            name="type" 
            label="Loại Phòng"
            rules={[{ required: true, message: 'Vui lòng chọn loại phòng' }]}
          >
            <Select>
              {roomTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item 
            name="manager" 
            label="Người Phụ Trách"
            rules={[{ required: true, message: 'Vui lòng chọn người phụ trách' }]}
          >
            <Select>
              {managers.map(manager => (
                <Option key={manager} value={manager}>{manager}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassroomManagement;