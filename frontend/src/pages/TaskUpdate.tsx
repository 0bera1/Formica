import React, { useEffect } from 'react';
import { Button, Input, Form, Select, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTaskDetail, updateTask } from '../redux/slices/taskSlice';
import dayjs from 'dayjs';

interface TaskUpdateFormValues {
    title: string;
    description: string;
    assignees: string[];
}

const TaskUpdate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { task, loading, error } = useSelector((state: RootState) => state.tasks);

    const [form] = Form.useForm();

    useEffect(() => {
        if (id) {
            dispatch(fetchTaskDetail(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (task) {
            form.setFieldsValue({
                title: task.title,
                description: task.description,
                assignees: task.assignees,
            });
        }
    }, [task, form]);

    const onFinish = (values: TaskUpdateFormValues) => {
        if (id) {
            dispatch(updateTask({ id, ...values }));
            navigate(`/task/${id}`);
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
            <h2 className="text-2xl font-semibold mb-6">Update Task</h2>

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
                    >
                        <Select.Option value="user1">User 1</Select.Option>
                        <Select.Option value="user2">User 2</Select.Option>
                        <Select.Option value="user3">User 3</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">Update Task</Button>
                </Form.Item>
            </Form>
            {/* Date and Time Display */}
            {task && (
                <div className="mt-6">
                    <p><strong>Created At:</strong> {dayjs(task.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                    <p><strong>Updated At:</strong> {dayjs(task.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                </div>
            )}
        </div>
    );
};

export default TaskUpdate;
