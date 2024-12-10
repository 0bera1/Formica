import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Spin, Input, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/store';
import { fetchTaskDetail, updateTask } from '../../redux/slices/taskSlice';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import SideBar from '../../components/SideBar';

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
    return (
      <>
      <div className="lg:fixed left-0 top-0">
        <SideBar />
      </div>
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Spin size="large" />
      </div>
      </>
    );
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <>
      <div className="lg:fixed left-0 top-0">
        <SideBar />
      </div>

      <div className="bg-gray-50 min-h-screen flex justify-center items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl lg:mt-0 mt-14 flex flex-col lg:flex-row bg-white shadow-xl rounded-xl overflow-hidden">
          {/* Sol Alan: Task Detail Form */}
          <div className="w-full lg:w-2/3 p-8 space-y-6">
            <h2 className="text-3xl font-semibold text-gray-900 mb-6">Task Detail</h2>

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

          {/* Sağ Alan: Sidebar (Assign Users) */}
          <div className="lg:w-1/3 bg-gray-50 p-8 space-y-6 rounded-r-xl flex flex-col justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Assign Users</h3>

            <div className="space-y-3">
              {assignees.map((assignee, index) => (
                <Button
                  key={index}
                  onClick={() => removeAssignee(assignee)}
                  type="default"
                  className="flex justify-between items-center px-5 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition ease-in-out duration-300">
                  {assignee} <span className="ml-2 text-xs font-semibold">X</span>
                </Button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <Input
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                placeholder="Add assignee"
                className="rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500 p-4 text-lg w-full"
              />
              <Button
                type="primary"
                onClick={addAssignee}
                className="custom-button-2">
                Add Assignee
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskDetail;
