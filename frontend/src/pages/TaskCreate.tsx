import React, { useState } from 'react';
import { Button, Input, Form, Select } from 'antd';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { createTask } from '../redux/slices/taskSlice';
import { Link } from 'react-router-dom';

const TaskCreate: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();

  const [assignees, setAssignees] = useState<string[]>([]);

  const onFinish = (values: { title: string; description: string; assignees: string[] }) => {
    const { title, description } = values;
    dispatch(createTask({ title, description, assignees }));
    form.resetFields();
  };

  const handleAssigneeChange = (value: string[]) => {
    setAssignees(value);
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Create Task</h2>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="title"
          label="Task Title"
          rules={[{ required: true, message: 'Please input the task title!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Task Description"
          rules={[{ required: true, message: 'Please input the task description!' }]}
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="assignees"
          label="Assign Users"
        >
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select assignees"
            onChange={handleAssigneeChange}
          >
            <Select.Option value="user1">User 1</Select.Option>
            <Select.Option value="user2">User 2</Select.Option>
            <Select.Option value="user3">User 3</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Create Task</Button>
        </Form.Item>
      </Form>

      <Link to="/dashboard">
        <Button className="ml-4">Back to Dashboard</Button>
      </Link>
    </div>
  );
};

export default TaskCreate;
