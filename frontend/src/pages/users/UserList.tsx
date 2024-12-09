import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Space, Popconfirm, Modal, Input, Form } from "antd";
import { Link, } from "react-router-dom";
import { fetchUsers, deleteUser, createUser, User } from "../../redux/slices/userSlice"; // Redux işlemleri
import { RootState } from "../../redux/store"; // Store importu

const UserList = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users); // Kullanıcı listesine erişim
    const loading = useSelector((state: RootState) => state.users.loading); // Yükleniyor durumu

    const [isModalOpen, setIsModalOpen] = useState(false); // Modal görünürlüğü
    const [form] = Form.useForm(); // Ant Design Form referansı

    // Kullanıcı verilerini al
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // Kullanıcı silme fonksiyonu
    const handleDelete = (id: string) => {
        dispatch<any>(deleteUser(id)).then(() => {
            dispatch(fetchUsers());
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
            await dispatch<any>(createUser(values)); // Yeni kullanıcı oluşturma
            dispatch(fetchUsers()); // Listeyi güncelle
            closeModal(); // Modalı kapat
        } catch (error) {
            console.error("Failed to create user:", error);
        }
    };

    // Tabloyu render etmek için kolonları tanımla
    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (text: string, record: User) => (
                <Link to={`/users/${record._id}`}>{text}</Link>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Action",
            key: "action",
            render: (text: string, record: { _id: string }) => (
                <Space size="middle">
                    <Link to={`/user/${record._id}`}>Show User Details</Link>
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => {
                            handleDelete(record._id);
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a href="#">Delete</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-10">
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={openModal}
            >
                Create User
            </Button>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
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
                        label="Username"
                        rules={[{ required: true, message: "Please enter a username" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Please enter an email" },
                            { type: "email", message: "Please enter a valid email" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: "Please enter a password" }]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UserList;
