import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchTasks, deleteTask, updateTask } from '../redux/slices/taskSlice';
import { fetchUsers } from '../redux/slices/userSlice'; // Yeni import
import { Button, Table, Popconfirm, Select, message, Tag, Divider } from 'antd'; // Yeni import
import moment from 'moment'; // Tarih işlemleri için import
import { Link } from 'react-router-dom';
import { MdOutlinePlaylistAdd, MdDelete } from 'react-icons/md';
import SideBar from '../components/SideBar';

const { Option } = Select;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const { users } = useSelector((state: RootState) => state.users); // Kullanıcıları almak için selector

  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers()); // Kullanıcıları fetch etmek için
  }, [dispatch]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    let filtered = tasks;

    if (selectedAssignees.length > 0) {
      filtered = filtered.filter(task =>
        task.assignees.some(assignee => selectedAssignees.includes(assignee))
      );
    }

    setFilteredTasks(filtered);
  }, [selectedAssignees, tasks]);

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const getUsernames = (assigneeIds: string[]) => {
    return assigneeIds.map(id => {
      const user = users.find(user => user._id === id);
      return user ? user.username : 'Unknown User';
    }).join(', ');
  };

  const handleAssigneeChange = (value: string[]) => {
    setAssignees(value);
  };

  const handleAddAssignees = async () => {
    for (const key of selectedRowKeys) {
      const task = tasks.find(task => task._id === key);
      if (task) {
        const updatedAssignees = Array.from(new Set([...assignees]));
        await dispatch(updateTask({ id: task._id, title: task.title, description: task.description, assignees: updatedAssignees }))
          .then(() => {
            message.success('Assignees updated successfully!');
          })
          .catch(() => {
            message.error('Failed to update assignees.');
          });
      }
    }
    dispatch(fetchTasks()); // Görevleri yeniden fetch ederek sayfanın yeniden render edilmesini sağla
  };

  const columns = [
    {
      title: 'Task Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-medium text-base tracking-wide px-6 hover:text-blue-800 ">{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text.length > 50 ? <span className="hover:text-blue-800 font-normal text-base tracking-wider transition-all duration-300">{text.slice(0, 50)}....</span>
        : <span className="hover:text-blue-800 font-normal text-base tracking-wider transition-all duration-300">{text}</span>,
    },
    {
      title: 'Assignees',
      dataIndex: 'assignees',
      key: 'assignees',
      render: (assignees: string[]) => getUsernames(assignees),
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

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(selectedRowKeys);
      const selectedTasks = tasks.filter(task => selectedRowKeys.includes(task._id));
      const combinedAssignees = selectedTasks.reduce((acc, task) => {
        task.assignees.forEach(assignee => {
          if (!acc.includes(assignee)) {
            acc.push(assignee);
          }
        });
        return acc;
      }, [] as string[]);
      setAssignees(combinedAssignees);
    },
  };

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
              dataSource={filteredTasks}
              rowKey="_id"
              loading={loading}
              pagination={{ pageSize: 7 }}
              bordered
              rowSelection={rowSelection}
              footer={() => (
                <div className="flex justify-end">
                  <p className="text-gray-600">
                    Total Tasks: <span className="font-semibold">{filteredTasks.length}</span>
                  </p>
                </div>
              )}
              style={{
                background: 'rgba(255, 255, 255,0.5)',
                borderRadius: '2rem',
                overflow: 'hidden',
              }}
              rowClassName="text-gray-800"
            />
          </div>
        </div>
      </div>

      {/* Filter Sidebar */}
      <div className="w-64 p-4 bg-white shadow-lg rounded-lg">
        <h4 className="text-xl font-semibold mb-4">Filters</h4>
        <div className="mb-4">
          <label className="block text-gray-700">Assignees</label>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select assignees"
            value={selectedAssignees}
            onChange={setSelectedAssignees}
            className="rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500"
          >
            {users.map(user => (
              <Option key={user._id} value={user._id}>
                {user.username}
              </Option>
            ))}
          </Select>
        </div>
        <Divider />
        <h4 className="text-xl font-semibold mb-4">Change Assignees</h4>
        <div className="mb-4 flex flex-col gap-2">
          {users.map(user => (
            <Tag
              key={user._id}
              color={assignees.includes(user._id) ? "blue" : "default"}
              onClick={() => {
                if (assignees.includes(user._id)) {
                  setAssignees(assignees.filter(id => id !== user._id));
                } else {
                  setAssignees([...assignees, user._id]);
                }
              }}
              className={`cursor-pointer text-base  ${assignees.includes(user._id) ? "scale-105" : "hover:scale-110 scale-95"} transition-all duration-300`}
            >
              {assignees.includes(user._id) ? `${user.username}       ✓ ` : `${user.username}`}
            </Tag>
          ))}
        </div>
        <Button type="primary" onClick={handleAddAssignees} className="w-full">
          Update Assignees
        </Button>
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
