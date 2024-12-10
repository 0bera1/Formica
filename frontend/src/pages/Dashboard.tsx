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
      render: (text: string) => <span className="font-medium text-base tracking-wide pl-6 hover:text-blue-800 ">{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <span className="hover:text-blue-800 font-normal text-base tracking-wider transition-all duration-300">{text}</span>,
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
      render: (updateTask: string) => new Date(updateTask).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_text: string, record: { _id: string; title: string; assignees?: string[]; }) => (
        <div className="flex justify-center space-x-2">
          <Link to={`/task/${record._id}`}>
            <Button className=" hover:scale-90 transition-all duration-200">
              View/Edit
            </Button>
          </Link>

          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger className=" hover:scale-90 transition-all duration-200">
              <MdDelete size={20} />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen ">
      <SideBar />
      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h3 className="text-3xl font-semibold text-slate-600 mb-8">Task Overview</h3>

        {/* Error message */}
        {error && <p className="text-red-600 bg-red-100 p-4 rounded-lg mb-6 text-lg">{error}</p>}

        {/* Content Card with Table */}
        <div className="bg-gradient-to-br from-gray-900/5 via-gray-800/5 to-gray-900/5 
      backdrop-blur-lg backdrop-filter rounded-xl shadow-lg p-6">
          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={tasks}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 7 }}
              bordered
              footer={() => (
                <div className="flex justify-end">
                  <p className="text-gray-600">
                    Total Tasks: <span className="font-semibold">{tasks.length}</span>
                  </p>
                </div>
              )}
              style={{
                background: 'rgba(255, 255, 255,0.5)',
                borderRadius: '2rem',
                overflow: 'hidden',
              }}
              rowClassName="text-gray-800 hover:scale-[1.035] transition-all duration-500 "
            />
          </div>
        </div>
      </div>

      {/* Floating Button */}
      <button className="fixed lg:bottom-12 bottom-12 right-8 lg:right-12 z-10 p-4 bg-gradient-to-br from-blue-500 to-teal-400 text-white rounded-full shadow-lg transition-all hover:scale-125 duration-300 transform">
        <Link to="/task/create" className="flex items-center justify-center">
          <MdOutlinePlaylistAdd size={30} />
        </Link>
      </button>
    </div>
  );

};

export default Dashboard;
