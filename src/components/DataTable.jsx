import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Space,
  message,
} from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Column } = Table;
const { Search } = Input;

const DataTable = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [searchText, setSearchText] = useState('');
  const [form] = Form.useForm();

  useEffect(() => {
    setData([
      {
        key: '1',
        name: 'Иван Иванов',
        date: '2025-05-15',
        value: 78,
      },
      {
        key: '2',
        name: 'Петр Петров',
        date: '2025-06-24',
        value: 99,
      },
      {
        key: '3',
        name: 'Сидор Сидоров',
        date: '2025-04-10',
        value: 98,
      },
    ]);
  }, []);

  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  const filteredData = data.filter(item => {
    return Object.entries(item).some(([key, val]) => {
      if (val == null) return false;
      const search = searchText.toLowerCase();

      if (key === 'value') {
        return val.toString().includes(search);
      }

      if (key === 'date') {
        const formats = ['DD.MM.YYYY', 'YYYY-MM-DD', 'D.M.YYYY'];
        return formats.some(format => 
          dayjs(val).format(format).toLowerCase().includes(search)
        );
      }

      return val.toString().toLowerCase().includes(search);
    });
  });

  const showModal = () => {
    form.resetFields();
    setEditingKey('');
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    form.setFieldsValue({
      name: record.name,
      date: dayjs(record.date),
      value: record.value,
    });
    setEditingKey(record.key);
    setIsModalVisible(true);
  };

  const handleDelete = (key) => {
    setData(data.filter(item => item.key !== key));
    message.success('Запись удалена');
  };

  const handleOk = () => {
    form.validateFields()
      .then(values => {
        const newRecord = {
          key: editingKey || String(data.length + 1),
          name: values.name,
          date: values.date.format('YYYY-MM-DD'),
          value: values.value,
        };

        if (editingKey) {
          setData(data.map(item => (item.key === editingKey ? newRecord : item)));
          message.success('Запись обновлена');
        } else {
          setData([...data, newRecord]);
          message.success('Запись добавлена');
        }

        setIsModalVisible(false);
        form.resetFields();
      });
  };

  return (
    <div>
      <div style={{ 
        marginBottom: '16px', 
        display: 'flex', 
        justifyContent: 'space-between'
      }}>
        <Search
          placeholder="Поиск по таблице"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: '300px' }}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
          Добавить
        </Button>
      </div>

      <Table
        dataSource={filteredData}
        bordered
        pagination={{ pageSize: 5 }}
        scroll={{ x: 'max-content' }}
      >
        <Column
          title="Имя"
          dataIndex="name"
          key="name"
          width={200}
          sorter={(a, b) => a.name.localeCompare(b.name)}
        />
        <Column
          title="Дата"
          dataIndex="date"
          key="date"
          width={150}
          sorter={(a, b) => new Date(a.date) - new Date(b.date)}
          render={(date) => dayjs(date).format('DD.MM.YYYY')}
        />
        <Column
          title="Значение"
          dataIndex="value"
          key="value"
          width={100}
          sorter={(a, b) => a.value - b.value}
        />
        <Column
          title="Действия"
          key="action"
          width={120}
          render={(_, record) => (
            <Space size="middle">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
              />
            </Space>
          )}
        />
      </Table>

      <Modal
        title={editingKey ? 'Редактировать запись' : 'Добавить запись'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingKey ? 'Обновить' : 'Добавить'}
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
          >
            <Input placeholder="Введите имя" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: 'Пожалуйста, выберите дату' }]}
          >
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item
            name="value"
            label="Числовое значение"
            rules={[{ required: true, message: 'Пожалуйста, введите значение' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder="Введите число" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataTable;