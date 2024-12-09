import React, { useEffect } from 'react';
import { Button, Input, Form, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchUserDetail, updateUser } from '../redux/slices/userSlice';
import { useParams, useNavigate } from 'react-router-dom';

interface UserUpdateFormValues {
  username: string;
  email: string;
}

const UserUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state: RootState) => state.users);

  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchUserDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
      });
    }
  }, [user, form]);

  const onFinish = (values: UserUpdateFormValues) => {
    if (id) {
      dispatch(updateUser({ id, ...values }));
      navigate(`/user/${id}`);
    }
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Update User</h2>

      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          name="username"
          label="Username"
          rules={[{ required: true, message: 'Please input the username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input the email!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Update User</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserUpdate;
