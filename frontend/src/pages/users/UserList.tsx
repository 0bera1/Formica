/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Space, Popconfirm, Modal, Input, Form, message } from "antd";
import { Link, } from "react-router-dom";
import { fetchUsers, deleteUser, } from "../../redux/slices/userSlice"; // Redux işlemleri
import { RootState } from "../../redux/store"; // Store importu
import SideBar from "../../components/SideBar";
import { RiUser6Line } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { register } from "../../redux/slices/authSlice";

const UserList = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users); // Kullanıcı listesine erişim
    const loading = useSelector((state: RootState) => state.users.loading); // Yükleniyor durumu

    const [isModalOpen, setIsModalOpen] = useState(false); // Modal görünürlüğü
    const [form] = Form.useForm(); // Ant Design Form referansı

    // Kullanıcı verilerini al
    useEffect(() => {
        dispatch<any>(fetchUsers());
    }, [dispatch]);

    // Kullanıcı silme fonksiyonu
    const handleDelete = (id: string) => {
        dispatch<any>(deleteUser(id)).then(() => {
            dispatch<any>(fetchUsers());
        });
    };

    // Kullanıcı oluşturma modalını açma/kapatma fonksiyonları
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        form.resetFields();
        setIsModalOpen(false);
    };

    // Yeni kullanıcı oluşturma işlemi
    const handleCreateUser = async () => {
        try {
            const values = await form.validateFields(); // Form doğrulama
            await dispatch<any>(register(values)); // Yeni kullanıcı oluşturma
            dispatch<any>(fetchUsers()); // Listeyi güncelle
            closeModal(); // Modalı kapat
            message.success("User created successfully!");
        } catch (error) {
            console.error("Failed to create user:", error);
            message.error("Failed to create user");
        }

    };

    // Tabloyu render etmek için kolonları tanımla
    const columns = [
        {
            title: "Name",
            dataIndex: "username",
            key: "Username",
            render: (text: string,) => (
                <h2 className="font-medium text-base tracking-wide pl-6 hover:text-blue-800 "
                >{text}</h2>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (text: string) => <span className="hover:text-blue-800 font-normal text-base tracking-wider transition-all duration-300">{text}</span>,

        },
        {
            title: "Action",
            key: "action",
            render: (record: { _id: string }) => (
                <Space size="middle">
                    <Link to={`/user/${record._id}`}
                        className="flex border p-2 text-white hover:bg-transparent hover:border-transparent
                         hover:text-blue-400 bg-blue-400 rounded-xl space-x-2 transition-all duration-500">

                        <RiUser6Line size={20} className="" />
                        <span className="">Show User Details</span>
                    </Link>
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => {
                            handleDelete(record._id);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <div
                            className="cursor-pointer flex border p-2 text-white hover:bg-transparent hover:border-transparent
                             hover:text-red-600 bg-red-600 rounded-xl space-x-2 transition-all duration-500">
                            <MdDelete size={20} className="" />
                            <a href="#" className="hover:text-red-600">Delete</a>
                        </div>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="flex min-h-screen bg-white">
            <SideBar />
            {/* Main Content Area */}
            <div className="flex-1 p-8 overflow-y-auto bg-white rounded-lg shadow-md">
                <h3 className="text-3xl font-semibold text-slate-600 mb-8">User Management</h3>
                <Button
                    type="primary"
                    onClick={openModal}
                    className="
            z-10 p-4 bg-gradient-to-br from-blue-400 to-blue-700
             text-white rounded-xl mb-5 shadow-lg transition-all 
             hover:scale-110 duration-300 transform hover:translate-x-2">
                    Create User
                </Button>
                <div className="bg-gradient-to-br from-gray-900/5 via-gray-800/5 to-gray-900/5 
      backdrop-blur-lg backdrop-filter rounded-xl shadow-lg p-6">
                    <div className="overflow-x-hidden">
                        <Table
                            columns={columns}
                            dataSource={users}
                            rowKey="_id"
                            loading={loading}
                            pagination={{ pageSize: 10 }}
                            bordered
                            footer={() => (
                                <div className="flex justify-end">
                                    <p className="text-gray-600">
                                        Total Users: <span className="font-semibold">{users.length}</span>
                                    </p>
                                </div>
                            )}
                            style={{
                                borderRadius: '12px',
                                boxShadow: '0 8px 10px rgba(0, 0, 0, 0.1)',
                            }}
                            className="bg-gray-100"
                            rowClassName="text-gray-800 hover:scale-[1.035] transition-all duration-500 "

                        />
                    </div>
                </div>
                <Modal
                    title="Create New User"
                    visible={isModalOpen}
                    onOk={handleCreateUser}
                    onCancel={closeModal}
                    okText="Create"
                    cancelText="Cancel"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="username"
                            label="Name"
                            rules={[{ required: true, message: "Please enter a username" }]}
                        >
                            <Input
                                style={{
                                    borderRadius: '12px',
                                    padding: '12px',
                                }}
                                className="bg-gray-100"
                            />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Please enter an email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input
                                style={{
                                    borderRadius: '12px',
                                    padding: '12px',
                                }}
                                className="bg-gray-100"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: "Please enter a password" }]}
                        >
                            <Input.Password
                                style={{
                                    borderRadius: '12px',
                                    padding: '12px',
                                }}
                                className="bg-gray-100"

                            />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>

    );
};

export default UserList;
