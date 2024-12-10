import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import TaskDetail from './pages/tasks/TaskDetail';
import TaskCreate from './pages/tasks/TaskCreate';
import TaskUpdate from './pages/tasks/TaskUpdate';
import UserList from './pages/users/UserList';
import UserDetail from './pages/users/UserDetail';
import NotFound from './pages/NotFound'; // NotFound bileşenini içe aktarın
import Register from './pages/auth/Register';

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = !!localStorage.getItem('token');
  return isAuthenticated ? element : <Navigate to="/" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/task/:id" element={<PrivateRoute element={<TaskDetail />} />} />
        <Route path="/task/create" element={<PrivateRoute element={<TaskCreate />} />} />
        <Route path="/users" element={<PrivateRoute element={<UserList />} />} />
        <Route path="/user/:id" element={<PrivateRoute element={<UserDetail />} />} />
        <Route path='/register' element={<Register />} />
        <Route path="*" element={<NotFound />} /> {/* Tüm olmayan sayfalar için NotFound bileşenine yönlendirme */}
      </Routes>
    </Router>
  );
};

export default App;
