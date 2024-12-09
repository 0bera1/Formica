import React, { useEffect } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchTaskDetails, updateTask, createTask } from '../../store/taskSlice';
import { fetchUsers } from '../../store/userSlice';
import { useParams, useNavigate } from 'react-router-dom';

const TaskEdit: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { taskDetails, loading } = useSelector((state: RootState) => state.tasks);
  const { users } = useSelector((state: RootState) => state.users);

  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskDetails(id));
    }
    dispatch(fetchUsers());
  }, [id, dispatch]);

  useEffect(() => {
    if (taskDetails) {
      form.setFieldsValue(taskDetails);
    }
  }, [taskDetails, form]);

  const onFinish = (values: { title: string; description?: string; status: string; assignee?: string }) => {
    if (id) {
      dispatch(updateTask({ id, data: values })).then(() => navigate('/tasks'));
    } else {
      dispatch(createTask(values)).then(() => navigate('/tasks'));
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Status" name="status" rules={[{ required: true, message: 'Please select a status!' }]}>
        <Select>
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="In Progress">In Progress</Select.Option>
          <Select.Option value="Completed">Completed</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Assignee" name="assignee">
        <Select>
          {users.map((user) => (
            <Select.Option key={user._id} value={user._id}>
              {user.username}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TaskEdit;
