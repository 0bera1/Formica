/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, message, Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { addTask, getTasks } from '../redux/slices/taskSlice';
import { RootState, AppDispatch } from '../redux/store';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    if (!token) {
      navigate('/');
    } else {
      dispatch(getTasks(token));
    }
  }, [token, dispatch, navigate]);

  const handleAddTask = () => {
    dispatch(addTask({ title: 'New Task', description: 'Task Description' }))
      .unwrap()
      .then(() => {
        message.success('Task added successfully');
      })
      .catch(() => {
        message.error('Failed to add task');
      });
  };

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
      title: 'Actions',
      key: 'actions',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, _record: any) => (
        <Button type="link" onClick={() => { /* Handle task update */ }}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <Button type="primary" onClick={handleAddTask} className="mb-4">
        Add New Task
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
};

export default Dashboard;
