import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');

  // Jika ada token, tampilkan konten halaman (menggunakan <Outlet />).
  // Jika tidak, arahkan ke halaman login.
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;