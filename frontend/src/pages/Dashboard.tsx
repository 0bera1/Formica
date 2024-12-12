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
import TopBar from '../components/TopBar';
import { CgMore } from 'react-icons/cg';
import { FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

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
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: string | null }>({ key: '', direction: null });

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

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTasks = React.useMemo(() => {
    if (sortConfig.direction === null) {
      return filteredTasks;
    }
    const sorted = [...filteredTasks].sort((a, b) => {
      if (sortConfig.key === 'createdAt' || sortConfig.key === 'updatedAt') {
        return sortConfig.direction === 'asc'
          ? new Date(a[sortConfig.key]).getTime() - new Date(b[sortConfig.key]).getTime()
          : new Date(b[sortConfig.key]).getTime() - new Date(a[sortConfig.key]).getTime();
      } else {
        return sortConfig.direction === 'asc'
          ? (a[sortConfig.key as keyof typeof a] as string).localeCompare(b[sortConfig.key as keyof typeof b] as string)
          : (b[sortConfig.key as keyof typeof b] as string).localeCompare(a[sortConfig.key as keyof typeof a] as string);
      }
    });
    return sorted;
  }, [filteredTasks, sortConfig]);

  const columns = [
    {
      title: (
        <div className="flex items-center">
          Task Title
          <button onClick={() => handleSort('title')} className="ml-2">
            {sortConfig.key === 'title' && sortConfig.direction === 'asc' && <FaSortAlphaDown />}
            {sortConfig.key === 'title' && sortConfig.direction === 'desc' && <FaSortAlphaUp />}
            {sortConfig.key !== 'title' && <FaSortAlphaDown />}
          </button>
        </div>
      ),
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <span className="font-medium tracking-wide px-6 hover:text-blue-800 ">{text}</span>,
    },
    {
      title: (
        <div className="flex items-center">
          Description
          <button onClick={() => handleSort('description')} className="ml-2">
            {sortConfig.key === 'description' && sortConfig.direction === 'asc' && <FaSortAlphaDown />}
            {sortConfig.key === 'description' && sortConfig.direction === 'desc' && <FaSortAlphaUp />}
            {sortConfig.key !== 'description' && <FaSortAlphaDown />}
          </button>
        </div>
      ),
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => text.length > 20 ? <span className="hover:text-blue-800 font-normal text-base tracking-wider transition-all duration-300">{text.slice(0, 15)}....</span>
        : <span className="hover:text-blue-800 font-normal text-base tracking-wider transition-all duration-300">{text}</span>,
    },
    {
      title: (
        <div className="flex items-center">
          Assignees
          <button onClick={() => handleSort('assignees')} className="ml-2">
            {sortConfig.key === 'assignees' && sortConfig.direction === 'asc' && <FaSortAlphaDown />}
            {sortConfig.key === 'assignees' && sortConfig.direction === 'desc' && <FaSortAlphaUp />}
            {sortConfig.key !== 'assignees' && <FaSortAlphaDown />}
          </button>
        </div>
      ),
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
      title: (
        <div className="flex items-center">
          Created At
          <button onClick={() => handleSort('createdAt')} className="ml-2">
            {sortConfig.key === 'createdAt' && sortConfig.direction === 'asc' && <FaSortAmountDown />}
            {sortConfig.key === 'createdAt' && sortConfig.direction === 'desc' && <FaSortAmountUp />}
            {sortConfig.key !== 'createdAt' && <FaSortAmountDown />}
          </button>
        </div>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
    },
    {
      title: (
        <div className="flex items-center">
          Updated At
          <button onClick={() => handleSort('updatedAt')} className="ml-2">
            {sortConfig.key === 'updatedAt' && sortConfig.direction === 'asc' && <FaSortAmountDown />}
            {sortConfig.key === 'updatedAt' && sortConfig.direction === 'desc' && <FaSortAmountUp />}
            {sortConfig.key !== 'updatedAt' && <FaSortAmountDown />}
          </button>
        </div>
      ),
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
    <div className="flex lg:min-h-screen flex-col lg:mt-0 md:mt-0 mt-20 md:flex-row lg:flex-row">
      <SideBar />
      <TopBar />
      <div className="flex-1 lg:px-3 lg:pt-8 lg:p-0 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-semibold ml-5 ">Tasks Overview</h3>
          <button
            className="lg:hidden md:hidden p-2 absolute top-4 bg-white rounded-full right-3 z-50"
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}>
            {isRightSidebarOpen ? <AiOutlineClose size={30} className='' /> : <MdAssignmentInd size={30} />}
          </button>
          <div className='z-30 lg:block md:block hidden'>
            <button className={`py-2 px-3 bg-gradient-to-br rounded-full shadow-lg from-blue-500 to-teal-400 transition-all duration-500
             text-white items-center justify-center flex flex-col hover:scale-110  hover:from-teal-400 hover:to-blue-500
             ${isRightSidebarDesktop ? '' : ' mr-5'}` }
              onClick={() => setIsRightSidebarDesktop(!isRightSidebarDesktop)}
            >
              {isRightSidebarDesktop ? <AiOutlineClose size={20} />
                : <div className='justify-center items-center flex flex-col '>
                  <CgMore size={20} />
                  <h3 className='text-xs'>More</h3>
                </div>
              }

            </button>
          </div>
        </div>

        {error && <p className="text-red-600 bg-red-100 p-4 rounded-lg mb-6 text-lg">{error}</p>}

        <div className={`${isRightSidebarDesktop ? 'lg:-translate-x-0 lg:mr-72' : 'lg:translate-x-0'} transition-all duration-500 lg:mx-5
          `}>
          <Table
            columns={columns}
            dataSource={sortedTasks}
            rowKey="_id"
            loading={loading}
            pagination={{ pageSize: 7 }}
            bordered
            rowSelection={rowSelection}
            footer={() => (
              <div className="flex justify-end ">
                <p className="">
                  Total Tasks: <span className="font-semibold">{filteredTasks.length}</span>
                </p>
              </div>
            )}
            style={{
              background: 'rgba(255, 255, 255,0.5)',
              borderRadius: '2rem',
              overflow: 'auto',
            }}
          />
        </div>
      </div>
      <div className={`fixed top-0 right-0 lg:h-screen h-full w-64 p-4 bg-white shadow-lg rounded-lg transform 
        transition-transform duration-300
        z-20  ${isRightSidebarDesktop ? 'lg:translate-x-0 md:translate-x-0' : 'lg:translate-x-full md:translate-x-full'}
      ${isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'}  
        `}>
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-xl font-semibold mt-2">More</h4>

        </div>
        <div className="mb-4">
          <label className="block my-1 ml-1">Assignees Filter</label>
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
        className={`fixed lg:bottom-20 bottom-12 right-8 lg:right-80 z-10 p-4 bg-gradient-to-br hover:from-teal-400 hover:to-blue-500 from-blue-500 to-teal-400 text-white rounded-full shadow-lg transition-all hover:scale-125 duration-300 transform
        ${isRightSidebarDesktop ? 'lg:-translate-x-0 ' : 'lg:translate-x-60'}
      `}>
        <Link to="/task/create" className="flex items-center justify-center">
          <MdOutlinePlaylistAdd size={30} />
        </Link>
      </button>
    </div>
  );
};

export default Dashboard;