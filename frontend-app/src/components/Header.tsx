// src/components/Header.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css'; // 1. Impor CSS Module

interface User {
  fullName: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const userString = localStorage.getItem('user');
  const user: User | null = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

   return (
    <header className="header">
      <h1 className="logo">ReservasiApp</h1>
      <div className="user-info">
        {user && <span>Halo, {user.fullName}</span>}
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
    </header>
  );
};

// 3. Hapus semua objek style dari sini

export default Header;