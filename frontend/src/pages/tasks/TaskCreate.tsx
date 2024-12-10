import React, { useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { createTask } from '../../redux/slices/taskSlice';
import { Link, useNavigate } from 'react-router-dom';
import SideBar from '../../components/SideBar';
import './task.css';

const TaskCreate: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();

  const [assignees, setAssignees] = useState<string[]>([]);
  const [newAssignee, setNewAssignee] = useState<string>('');

  const navigate = useNavigate();
  const onFinish = (values: { title: string; description: string; assignees: string[] }) => {
    const { title, description } = values;
    const taskData = { title, description, assignees };

    // Dispatch createTask and pass task data
    dispatch(createTask(taskData))
      .then(() => {
        message.success('Task created successfully!');
        form.resetFields();
      })
      .catch(() => {
        message.error('Failed to create task.');
      });
  };

  const addAssignee = () => {
    if (newAssignee && !assignees.includes(newAssignee)) {
      setAssignees((prevAssignees) => [...prevAssignees, newAssignee]);
      setNewAssignee('');
    }
  };

  const removeAssignee = (assignee: string) => {
    setAssignees((prevAssignees) => prevAssignees.filter(a => a !== assignee));
  };

  return (
    <>
      <div className='lg:fixed left-0 top-0'>
        <SideBar />
      </div>
      <div className="bg-gray-50   min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8"
        style={{ zIndex: -999 }}>
        <div className="w-full max-w-5xl lg:mt-0 mt-14 flex flex-col lg:flex-row bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Sol Alan: Form */}
          <div className="w-full lg:w-2/3 p-8 space-y-6">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Create Task</h2>

            <Form form={form} onFinish={onFinish} layout="vertical">
              <Form.Item
                name="title"
                label="Task Title"
                rules={[{ required: true, message: 'Please input the task title!' }]}>
                <Input className="rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 p-4 text-lg" />
              </Form.Item>

              <Form.Item
                name="description"
                label="Task Description"
                rules={[{ required: true, message: 'Please input the task description!' }]}>
                <Input.TextArea className="rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 p-4 text-lg" rows={5} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit"
                  onClick={() => { navigate('/dashboard') }}
                  className="custom-button-2">
                  Create Task
                </Button>
              </Form.Item>
            </Form>

            <Link to="/dashboard">
              <Button className="w-full py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-lg">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          {/* Sağ Alan: Sidebar */}
          <div className="lg:w-1/3 bg-gray-50 p-8 space-y-6 rounded-r-xl flex flex-col justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Assign Users</h3>

            <div className="space-y-3">
              {assignees.map((assignee, index) => (
                <Button
                  key={index}
                  onClick={() => removeAssignee(assignee)}
                  type="default"
                  className="flex justify-between items-center px-5 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition ease-in-out duration-300">
                  {assignee} <span className="ml-2 text-xs font-semibold">X</span>
                </Button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <Input
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                placeholder="Add assignee"
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 p-4 text-lg w-full"
              />
              <Button
                type="primary"
                onClick={addAssignee}
                className="custom-button-2">
                Add Assignee
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>



  );
};

export default TaskCreate;
