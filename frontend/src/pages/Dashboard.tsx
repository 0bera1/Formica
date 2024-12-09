import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchTasks } from '../redux/slices/taskSlice';
import { Button, Table } from 'antd';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const columns = [
    {
      title: 'Task Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Assignees',
      dataIndex: 'assignees',
      key: 'assignees',
      render: (assignees: string[]) => (Array.isArray(assignees) ? assignees.join(', ') : '-'),
    },    
    {
      title: 'Actions',
      key: 'actions',
      render: (_text: string, record: { _id: string; title: string; assignees?: string[] }) => (
        <Link to={`/task/${record._id}`}>
          <Button>View</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>

      {error && <p className="text-red-500">{error}</p>}

      <Button type="primary" className="mb-4">
        <Link to="/task/create">Create New Task</Link>
      </Button>

      <Table
        columns={columns}
        dataSource={tasks}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default Dashboard;
