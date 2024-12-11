import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { fetchTasks, deleteTask, updateTask } from '../redux/slices/taskSlice';
import { fetchUsers } from '../redux/slices/userSlice';
import { Button, Table, Popconfirm, Select, message, Tag, Divider } from 'antd';
import { Link } from 'react-router-dom';
import { MdOutlinePlaylistAdd, MdDelete, MdAssignmentInd } from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import SideBar from '../components/SideBar';
import './dashboard.css';

const { Option } = Select;

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const { users } = useSelector((state: RootState) => state.users);

  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [assignees, setAssignees] = useState<string[]>([]);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isRightSidebarDesktop, setIsRightSidebarDesktop] = useState(true)

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchUsers());
  }, [dispatch]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);
  useEffect(() => {
    const filtered = tasks.filter(task => task.status === "in-progress");

    if (selectedAssignees.length > 0) {
      setFilteredTasks(filtered.filter(task =>
        task.assignees.some(assignee => selectedAssignees.includes(assignee))
      ));
    } else {
      setFilteredTasks(filtered);
    }
  }, [tasks, selectedAssignees]);

  const handleDelete = (taskId: string) => {
    dispatch(deleteTask(taskId));
  };

  const getUsernames = (assigneeIds: string[]) => {
    return assigneeIds.map(id => {
      const user = users.find(user => user._id === id);
      return user ? user.username : 'Unknown User';
    }).join(', ');
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
    dispatch(fetchTasks());
  };

  const columns = [
    {
      title: 'Task Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-medium tracking-wide px-6 hover:text-blue-800 ">{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text.length > 20 ? <span className="hover:text-blue-800 font-normal text-base tracking-wider transition-all duration-300">{text.slice(0, 15)}....</span>
        : <span className="hover:text-blue-800 font-normal text-base tracking-wider transition-all duration-300">{text}</span>,
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
        <Tag color={status === 'completed' ? 'green' : status === 'in-progress' ? 'blue' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
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
    <div className="flex min-h-screen flex-col lg:mt-0 mt-20 lg:flex-row">
      <SideBar />
      <div className="flex-1 lg:px-3 lg:pt-8 lg:p-0 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-semibold ml-5 text-slate-600">Task Overview</h3>
          <button
            className="lg:hidden p-2 absolute top-4 bg-white rounded-full right-3 z-50"
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}>
            {isRightSidebarOpen ? <AiOutlineClose size={30} className='' /> : <MdAssignmentInd size={30} />}
          </button>
          <div className='z-30 lg:block hidden'>
            <button
            onClick={()=> setIsRightSidebarDesktop(!isRightSidebarDesktop)}
            >
            {isRightSidebarDesktop ? <AiOutlineClose size={30} /> : <MdAssignmentInd size={30} />}

            </button>
          </div>
        </div>

        {error && <p className="text-red-600 bg-red-100 p-4 rounded-lg mb-6 text-lg">{error}</p>}

        <div className={`${isRightSidebarDesktop ? 'lg:-translate-x-0 lg:mr-72':'lg:translate-x-0'} transition-all duration-500 lg:mx-5
          `}>
          <Table
            columns={columns}
            dataSource={filteredTasks}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 7 }}
            bordered
            rowSelection={rowSelection}
            footer={() => (
              <div className="flex justify-end ">
                <p className="text-gray-600">
                  Total Tasks: <span className="font-semibold">{filteredTasks.length}</span>
                </p>
              </div>
            )}
            style={{
              background: 'rgba(255, 255, 255,0.5)',
              borderRadius: '2rem',
              overflow: 'auto',
            }}
            rowClassName="text-gray-800"
          />
        </div>
      </div>
      <div className={`fixed top-0 right-0 lg:h-screen h-full w-64 p-4 bg-white shadow-lg rounded-lg transform 
        transition-transform duration-300
        z-20  ${isRightSidebarDesktop ? 'lg:translate-x-0':'lg:translate-x-full'}
      ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}  
        `}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold mt-2">More</h4>

        </div>
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
      <button 
      className={`fixed lg:bottom-20 bottom-12 right-8 lg:right-80 z-10 p-4 bg-gradient-to-br from-blue-500 to-teal-400 text-white rounded-full shadow-lg transition-all hover:scale-125 duration-300 transform
        ${isRightSidebarDesktop ? 'lg:-translate-x-0 ':'lg:translate-x-60'}
      `}>
        <Link to="/task/create" className="flex items-center justify-center">
          <MdOutlinePlaylistAdd size={30} />
        </Link>
      </button>
    </div>
  );
};

export default Dashboard;