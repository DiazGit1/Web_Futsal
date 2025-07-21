import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

// Definisikan tipe untuk struktur error dari Axios
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const RegisterPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post('/users/register', {
        fullName,
        email,
        password,
      });

      console.log('Registrasi berhasil:', response.data);
      alert('Registrasi berhasil! Silakan login.');
      navigate('/login');
    } catch (err) {
      // Sekarang kita gunakan tipe ApiError yang sudah kita buat
      const apiError = err as ApiError;
      console.error('Error registrasi:', apiError);
      
      const errorMessage = 
        apiError.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.';
      setError(errorMessage);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Full Name:</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 15px' }}>
          Register
        </button>
      </form>
       <p>
        Sudah punya akun? <a href="/login">Login di sini</a>
      </p>
    </div>
  );
};

export default RegisterPage;