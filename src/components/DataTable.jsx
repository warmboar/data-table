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
  message
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';


const { Column } = Table;
const { Search } = Input;

const DataTable = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [searchText, setSearchText] = useState('');
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [form] = Form.useForm();

  // Определяем размер экрана
  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Тестовые данные
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

  // Поиск
  const handleSearch = (value) => {
    setSearchText(value.toLowerCase());
  };

  // Фильтрация данных
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

  // Модальное окно
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

  // Адаптивные стили
  const isMobile = screenWidth < 768;

  return (
    <div className="table-container">
      <div className="table-controls">
        <Search
          placeholder="Поиск..."
          allowClear
          enterButton={<SearchOutlined />}
          className="search-input"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showModal}
          className="add-button"
        >
          {isMobile ? '' : 'Добавить'}
        </Button>
      </div>

      <Table
        dataSource={filteredData}
        bordered
        pagination={{ 
          pageSize: 5,
          responsive: true,
          size: isMobile ? 'small' : 'default'
        }}
        scroll={{ x: true }}
        size={isMobile ? 'small' : 'middle'}
      >
        <Column
          title="Имя"
          dataIndex="name"
          key="name"
          width={isMobile ? 120 : 200}
          sorter={(a, b) => a.name.localeCompare(b.name)}
        />
        <Column
          title="Дата"
          dataIndex="date"
          key="date"
          width={isMobile ? 100 : 150}
          sorter={(a, b) => new Date(a.date) - new Date(b.date)}
          render={(date) => dayjs(date).format('DD.MM.YYYY')}
        />
        <Column
          title="Значение"
          dataIndex="value"
          key="value"
          width={isMobile ? 80 : 100}
          sorter={(a, b) => a.value - b.value}
        />
        <Column
          title="Действия"
          key="action"
          width={isMobile ? 90 : 120}
          render={(_, record) => (
            <Space size="small">
              <Button
                type="text"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record)}
                size={isMobile ? 'small' : 'middle'}
              />
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record.key)}
                size={isMobile ? 'small' : 'middle'}
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
        width={isMobile ? '90%' : '50%'}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input placeholder="Иван Иванов" />
          </Form.Item>
          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker 
              style={{ width: '100%' }} 
              format="DD.MM.YYYY" 
            />
          </Form.Item>
          <Form.Item
            name="value"
            label="Значение"
            rules={[{ required: true, message: 'Введите число' }]}
          >
            <InputNumber 
              style={{ width: '100%' }} 
              placeholder="42" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataTable;