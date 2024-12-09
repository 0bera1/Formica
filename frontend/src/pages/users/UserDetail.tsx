import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchUserDetail, updateUser } from '../../redux/slices/userSlice';
import { useParams } from 'react-router-dom';
import { Modal, Input, } from 'antd';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.users);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });

  useEffect(() => {
    if (id) {
      dispatch(fetchUserDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (user) {
      setFormData({ username: user.username, email: user.email });
    }
  }, [user]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    if (id) {
      await dispatch(updateUser({ id, ...formData }));
      closeModal();
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">User Details</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>

      {/* Edit Button */}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={openModal}>
          Edit
        </button>
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit User"
        visible={isModalOpen}
        onOk={handleUpdate}
        onCancel={closeModal}
        okText="Update"
        cancelText="Cancel"
      >
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Username</label>
          <Input
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-gray-700 font-bold mb-2">Email</label>
          <Input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserDetail;
