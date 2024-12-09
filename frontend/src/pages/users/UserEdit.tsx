import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchUserDetails, updateUser } from '../../store/userSlice';
import { useParams, useNavigate } from 'react-router-dom';

const UserEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { userDetails, loading } = useSelector((state: RootState) => state.users);

  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      dispatch(fetchUserDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (userDetails) {
      form.setFieldsValue(userDetails);
    }
  }, [userDetails, form]);

  interface UserFormValues {
    username: string;
    email: string;
  }

  const onFinish = (values: UserFormValues) => {
    if (id) {
      dispatch(updateUser({ id, data: values })).then(() => {
        navigate('/users');
      });
    }
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item label="Username" name="username">
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UserEdit;
