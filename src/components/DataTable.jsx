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
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './DataTable.css';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingKey, setEditingKey] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [form] = Form.useForm();

  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  
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

  
  const filteredData = data.filter(item =>
    Object.entries(item).some(([key, val]) => {
      if (!val) return false;
      const search = searchText.toLowerCase();
      
      if (key === 'value') return val.toString().includes(search);
      if (key === 'date') {
        return ['DD.MM.YYYY', 'YYYY-MM-DD'].some(format => 
          dayjs(val).format(format).toLowerCase().includes(search)
        );
      }
      return val.toString().toLowerCase().includes(search);
    })
  );

 
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

  
  const columns = [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <div className="cell">{text}</div>
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      render: (date) => <div className="cell">{dayjs(date).format('DD.MM.YYYY')}</div>
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      key: 'value',
      render: (value) => <div className="cell">{value}</div>
    },
    {
      title: 'Действия',
      key: 'action',
      responsive: ['md'], 
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.key)}
            size="small"
          />
        </Space>
      )
    }
  ];

  return (
    <div className="table-container">
      <div className={`controls ${isMobile ? 'mobile' : ''}`}>
        <Input.Search
          placeholder="Поиск..."
          allowClear
          enterButton={<SearchOutlined />}
          size={isMobile ? 'large' : 'middle'}
          onSearch={handleSearch}
          style={{ width: isMobile ? '100%' : 300 }}
        />
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={showModal}
          size={isMobile ? 'large' : 'middle'}
          className="add-btn"
        >
          {!isMobile && 'Добавить'}
        </Button>
      </div>

      <div className="table-wrapper">
        <Table
      columns={columns}
      dataSource={filteredData}
      pagination={false}
     bordered
     size={isMobile ? 'small' : 'middle'}
      className="responsive-table"
       scroll={{ x: 'max-content' }} 
/>
      </div>

      <Modal
        title={editingKey ? 'Редактировать запись' : 'Добавить запись'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        okText={editingKey ? 'Обновить' : 'Добавить'}
        cancelText="Отмена"
        width={isMobile ? '90%' : '60%'}
        className="data-modal"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input size={isMobile ? 'large' : 'middle'} />
          </Form.Item>
          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker 
              style={{ width: '100%' }}
              format="DD.MM.YYYY"
              size={isMobile ? 'large' : 'middle'}
            />
          </Form.Item>
          <Form.Item
            name="value"
            label="Значение"
            rules={[{ required: true, message: 'Введите число' }]}
          >
            <InputNumber 
              style={{ width: '100%' }}
              size={isMobile ? 'large' : 'middle'}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DataTable;