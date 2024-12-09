import React, { useEffect } from 'react';
import { Table, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchUsers } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';

const UserList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const columns = [
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: string, record: { _id: string; username: string; email: string }) => (
        <Button type="primary" onClick={() => navigate(`/users/edit/${record._id}`)}>
          Edit
        </Button>
      ),
    },
  ];

  return <Table dataSource={users} columns={columns} loading={loading} rowKey="_id" />;
};

export default UserList;
