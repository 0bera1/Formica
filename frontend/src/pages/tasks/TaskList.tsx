import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';

interface Task {
  _id: string; // Backend'den gelen ID
  title: string; // Görev başlığı
  description: string; // Görev açıklaması
  status: string; // Görev durumu
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]); // Görev listesi state

  useEffect(() => {
    // Backend'den görevleri çekiyoruz
    axios
      .get('http://localhost:3000/tasks') // Backend URL'i burada belirtilmeli
      .then((response) => {
        setTasks(response.data); // Backend'den gelen veriyi kaydet
      })
      .catch((error) => {
        console.error('Error fetching tasks:', error);
      });
  }, []);

  // Tablo için sütunlar
  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Task List</h1>
      {/* Ant Design Table */}
      <Table dataSource={tasks} columns={columns} rowKey="_id" />
    </div>
  );
};

export default TaskList;
