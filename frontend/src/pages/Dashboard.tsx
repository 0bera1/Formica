import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchTasks, deleteTask } from '../redux/slices/taskSlice';
import { Button, Table, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import { MdOutlinePlaylistAdd, MdDelete } from 'react-icons/md';
import SideBar from '../components/SideBar';

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };
  
  const columns = [
    {
      title: 'Task Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Assignees',
      dataIndex: 'assignees',
      key: 'assignees',
      render: (assignees: string[]) => (Array.isArray(assignees) ? assignees.join(', ') : '-'),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (updatedAt: string) => new Date(updatedAt).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_text: string, record: { _id: string; title: string; assignees?: string[]; }) => (
        <div className="flex justify-center space-x-2">
          <Link to={`/task/${record._id}`}>
            <Button>View/Edit</Button>
          </Link>

          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>
              <MdDelete size={20} />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
    {/* Main Content Area */}
    <div className="flex-1 p-8 overflow-y-auto">
      <h3 className="text-3xl font-semibold text-gray-800 mb-8">Task Overview</h3>
  
      {/* Error message */}
      {error && <p className="text-red-600 bg-red-100 p-4 rounded-lg mb-6 text-lg">{error}</p>}
  
      {/* Content Card with Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 lg:-z-0 -z-10">
        <div className="overflow-x-auto lg:-z-0 -z-10">
          <Table
            columns={columns}
            dataSource={tasks}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 7 }}
            className="rounded-lg lg:-z-0 -z-10 "
          />
        </div>
      </div>
    </div>
  
    {/* Floating Button */}
    <button className="fixed lg:bottom-12 bottom-12 right-8 lg:right-12 z-10 p-4 bg-gradient-to-r from-blue-500 to-teal-400 text-white rounded-full shadow-lg transition-all hover:scale-125 duration-300 transform">
      <Link to="/task/create" className="flex items-center justify-center">
        <MdOutlinePlaylistAdd size={30} />
      </Link>
    </button>
  </div>
  

  );
};

export default Dashboard;
