import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/tasks/TaskDetail';
import TaskCreate from './pages/tasks/TaskCreate';
import TaskUpdate from './pages/tasks/TaskUpdate';
import UserList from './pages/users/UserList';
import UserDetail from './pages/users/UserDetail';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/task/:id" element={<TaskDetail />} />
        <Route path="/task/create" element={<TaskCreate />} />
        <Route path="/task/update/:id" element={<TaskUpdate />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/user/:id" element={<UserDetail />} />

      </Routes>
    </Router>
  );
};

export default App;
