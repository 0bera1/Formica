import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchUserDetail, updateUser } from '../../redux/slices/userSlice';
import { useParams } from 'react-router-dom';
import { Modal, Input, message } from 'antd';
import SideBar from '../../components/SideBar';
import { VscLoading } from 'react-icons/vsc';
import { BiEdit} from 'react-icons/bi';
import { AiFillLeftSquare } from 'react-icons/ai';

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

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdate = async () => {
    if (id) {
      await dispatch(updateUser({ id, ...formData }));
      closeModal();
      message.success('User updated successfully!');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <SideBar />
        <div className="flex justify-center items-center w-full h-screen">
          <p className="flex items-center text-xl text-gray-700">
            <VscLoading className="animate-spin h-6 w-6 mr-3 text-blue-600" />
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!user) {
    return <p className="text-red-500">User not found</p>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SideBar />
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl mx-auto my-auto">
        <div className='flex flex-col justify-center mb-5 space-y-4'>
          <button 
          onClick={() => window.history.back()}
          className='items-center space-x-2 justify-start flex-row flex'>
            <AiFillLeftSquare className='inline-block text-3xl text-blue-600
            hover:text-blue-400 mr-1 transition-all duration-300
            hover:scale-125'/> 
            <h2 className="text-lg">Go Back</h2>
          </button>
          <h2 className="text-4xl font-semibold ml-2 text-gray-900 ">User Details</h2>
        </div>
        <div className="space-y-6 text-xl ml-2 text-gray-800">
          <p><strong className="text-blue-600">Username:</strong> {user.username}</p>
          <p><strong className="text-blue-600">Email:</strong> {user.email}</p>
          <p><strong className="text-blue-600">Password:</strong> Please apply to the higher authorities by providing the necessary reasons to learn or change the password.</p>
        </div>

        {/* Edit Button */}
        <div className="mt-8 flex justify-start">
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700
             text-white font-semibold py-3 px-6 rounded-full shadow-xl w-full
             transition-all duration-300 transform hover:scale-105
             items-center flex justify-center"
            onClick={openModal}
          >
            <BiEdit className="inline-block text-xl  mr-2" />
            Edit
          </button>
        </div>

        {/* Edit Modal */}
        <Modal
          visible={isModalOpen}
          onOk={handleUpdate}
          onCancel={closeModal}
          okText="Update"
          cancelText="Cancel"
          className="rounded-lg shadow-xl"
          centered
          width={600}
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Edit User</h2>
            <div className="mb-6">
              <label className="block text-lg font-medium text-gray-800 mb-2">Username</label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="p-3 border rounded-md w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-800 mb-2">Email</label>
              <Input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="p-3 border mb-4 rounded-md w-full focus:ring-2 focus:ring-blue-500 transition-all duration-300"
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default UserDetail;
