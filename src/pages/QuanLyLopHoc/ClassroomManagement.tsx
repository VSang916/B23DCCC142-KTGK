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
  Popconfirm 
} from 'antd';
import { Classroom } from '../../models/Classroom';
import { ClassroomService } from '../../services/ClassroomService';

const { Column } = Table;
const { Option } = Select;

const ClassroomManagement: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentClassroom, setCurrentClassroom] = useState<Classroom | null>(null);
  const [form] = Form.useForm();

  const managers = ['Trần Đức Định', 'Lưu Đức Tuấn', 'Nguyễn Viết Sang'];

  useEffect(() => {
    setClassrooms(ClassroomService.getClassrooms());
  }, []);

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

      setClassrooms(ClassroomService.getClassrooms());
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
    setClassrooms(ClassroomService.getClassrooms());
    message.success('Xóa phòng học thành công');
  };

  const openEditModal = (record: Classroom) => {
    setCurrentClassroom(record);
    setIsModalVisible(true);
    form.setFieldsValue(record);
  };

  return (
    <div style={{ padding: 24 }}>
      <Button 
        type="primary" 
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: 16 }}
      >
        Thêm Phòng Học
      </Button>

      <Table 
        dataSource={classrooms} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      >
        <Column title="Mã Phòng" dataIndex="id" key="id" />
        <Column title="Tên Phòng" dataIndex="name" key="name" />
        <Column title="Số Chỗ Ngồi" dataIndex="capacity" key="capacity" />
        <Column title="Loại Phòng" dataIndex="type" key="type" />
        <Column title="Người Phụ Trách" dataIndex="manager" key="manager" />
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
              <Option value="Lý thuyết">Lý thuyết</Option>
              <Option value="Thực hành">Thực hành</Option>
              <Option value="Hội trường">Hội trường</Option>
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