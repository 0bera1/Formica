import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Spin, Input, message, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchTaskDetail, updateTask } from '../../redux/slices/taskSlice';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

const { TextArea } = Input;

const TaskDetail: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const { task, loading, error } = useSelector((state: RootState) => state.tasks);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [assignees, setAssignees] = useState<string[]>([]);
  const [newAssignee, setNewAssignee] = useState<string>('');

  useEffect(() => {
    if (id) {
      dispatch(fetchTaskDetail(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setAssignees(task.assignees || []);
    }
  }, [task]);

  const handleSaveChanges = () => {
    if (id && (title !== task?.title || description !== task?.description || assignees !== task?.assignees)) {
      dispatch(updateTask({ id, title, description, assignees }))
        .then(() => {
          message.success('Changes saved successfully!');
        })
        .catch(() => {
          message.error('Failed to save changes.');
        });
    }
  };

  const addAssignee = () => {
    if (newAssignee && !assignees.includes(newAssignee)) {
      setAssignees((prevAssignees) => [...prevAssignees, newAssignee]);
      setNewAssignee('');
    }
  };

  const removeAssignee = (assignee: string) => {
    setAssignees((prevAssignees) => prevAssignees.filter(a => a !== assignee));
  };

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-6 flex">
      <div className="flex-1">
        <h2 className="text-2xl font-semibold mb-6">Task Detail</h2>

        <div className="mb-4">
          <strong>Title:</strong>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
            className="mb-4"
          />
        </div>

        <div className="mb-4">
          <strong>Description:</strong>
          <TextArea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
            className="border-2 p-2 rounded-md"
          />
        </div>

        <div className="mt-6 space-y-3 mb-6">
          <p><strong>Created At:</strong> {dayjs(task?.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
          <p><strong>Updated At:</strong> {dayjs(task?.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</p>
        </div>

        <Button type="primary" className="mr-4" onClick={handleSaveChanges}>
          Save Changes
        </Button>

        <Link to="/dashboard">
          <Button>Back to Dashboard</Button>
        </Link>
      </div>

      <div className="ml-6 w-80">
        <div className="bg-gray-100 p-4 rounded-md">
          <strong>Assignees:</strong>
          <div className="mt-2">
            {assignees.map((assignee, index) => (
              <Tag key={index} closable onClose={() => removeAssignee(assignee)}>
                {assignee}
              </Tag>
            ))}
          </div>
          <Input
            value={newAssignee}
            onChange={(e) => setNewAssignee(e.target.value)}
            placeholder="Add new assignee"
            className="mt-4"
          />
          <Button type="primary" onClick={addAssignee} className="mt-2 w-full">
            Add Assignee
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
