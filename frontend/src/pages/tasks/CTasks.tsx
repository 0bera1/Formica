/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchTasks, deleteTask, Task } from '../../redux/slices/taskSlice';
import { Table, Button, Tag, message, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import SideBar from '../../components/SideBar';
import '../dashboard.css';
import { MdDelete } from 'react-icons/md';
import TopBar from '../../components/TopBar';

const CTasks: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const { users } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    const filteredTasks = tasks.filter(task => task.status === 'completed');
    setCompletedTasks(filteredTasks);
  }, [tasks]);

  const handleDelete = async (taskId: string) => {
    try {
      await dispatch(deleteTask(taskId));
      message.success('Task deleted successfully');
    } catch (error) {
      message.error('Failed to delete task');
    }
  };

  const getUsernames = (assigneeIds: string[]) => {
    return assigneeIds.map(id => {
      const user = users.find(user => user._id === id);
      return user ? user.username : 'Unknown User';
    }).join(', ');
  };
  const columns = [
    {
      title: 'Task Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-medium tracking-wide hover:text-blue-800">{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) =>
        text.length > 30
          ? <span className="hover:text-blue-800 font-normal tracking-wider">{text.slice(0, 29)}...</span>
          : <span className="hover:text-blue-800 font-normal tracking-wider">{text}</span>,
    },
    {
      title: 'Assignees',
      dataIndex: 'assignees',
      key: 'assignees',
      render: (assignees: string[]) => getUsernames(assignees),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'green' : 'volcano'}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_text: string, record: { _id: string; title: string; }) => (
        <div className="flex justify-center space-x-2">
          <Link to={`/task/${record._id}`}>
            <Button className="hover:scale-90 transition-all duration-200">
              View
            </Button>
          </Link>
          <Popconfirm
            title="Are you sure to delete this task?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger className="hover:scale-90 transition-all duration-200">
              <MdDelete size={20} />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen flex-col md:mt-0 mt-20 md:flex-row">
      <SideBar />
      <TopBar />
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-semibold ">Completed Tasks</h3>
        </div>

        {error && <p className="text-red-600 bg-red-100 p-4 rounded-lg mb-6 text-lg">{error}</p>}

        <div className="
           rounded-xl  md:p-6 bg-transparent md:w-full mx-auto">
          <Table
            columns={columns}
            dataSource={completedTasks}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 7 }}
            bordered
            footer={() => (
              <div className="flex justify-end">
                <p className="">
                  Total Completed Tasks: <span className="font-semibold">{completedTasks.length}</span>
                </p>
              </div>
            )}
            style={{
              background: 'rgba(255, 255, 255, 0.5)',
              borderRadius: '2rem',
              overflow: 'auto',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CTasks;