import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { fetchTaskDetail } from '../redux/slices/taskSlice';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const TaskDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { task, loading, error } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskDetail(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }
  const assignees = task?.assignees || [];  // Eğer assignees undefined veya null ise boş dizi ile başla

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">{task?.title}</h2>

      <div className="mb-4">
        <strong>Description:</strong>
        <p>{task?.description}</p>
      </div>

      <div className="mb-4">
        <strong>Assignees:</strong>
        <p>{assignees.join(', ')}</p>
      </div>

      <div className="mt-6 space-y-3 mb-6">
        <p><strong>Created At:</strong> {dayjs(task?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
        <p><strong>Updated At:</strong> {dayjs(task?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</p>
      </div>

      <Link to={`/task/update/${id}`}>
        <Button type="primary" className="mr-4">Edit Task</Button>
      </Link>

      <Link to="/dashboard">
        <Button>Back to Dashboard</Button>
      </Link>
    </div>
  );
};

export default TaskDetail;
