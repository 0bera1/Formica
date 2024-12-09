import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/TaskDetail';
import TaskCreate from './pages/TaskCreate';
import TaskUpdate from './pages/TaskUpdate';
import UserList from './pages/UserList';
import UserDetail from './pages/UserDetail';
import UserUpdate from './pages/UserUpdate';


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
        <Route path="/user/update/:id" element={<UserUpdate />} />

      </Routes>
    </Router>
  );
};

export default App;
