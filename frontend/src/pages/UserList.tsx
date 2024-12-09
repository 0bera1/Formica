/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Button, Space, Popconfirm } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { fetchUsers, deleteUser, User } from "../redux/slices/userSlice"; // Redux işlemleri
import { RootState } from "../redux/store"; // Store importu


const UserList = () => {
    const dispatch = useDispatch();
    const users = useSelector((state: RootState) => state.users.users); // Kullanıcı listesine erişim
    const loading = useSelector((state: RootState) => state.users.loading); // Yükleniyor durumu
    const navigate = useNavigate();
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
            render: (text: string, record: {_id:string}) => (
                <Space size="middle">
                    <Link to={`/user/${record._id}`}>Edit</Link>
                    <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => {
                            handleDelete(record._id)
                        }}
                        okText="Yes"
                        cancelText="No"
                    >
                        <a href="#">Delete</a>
                    </Popconfirm>
                </Space >
            ),
        },
    ];

    return (
        <div>
            <Button
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={() => (window.location.href = "/users/create")}
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
        </div>
    );
};

export default UserList;
