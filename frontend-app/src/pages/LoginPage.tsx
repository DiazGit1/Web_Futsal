import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { Link } from 'react-router-dom';
import '../styles/AuthForm.css';

// Definisikan tipe untuk struktur error dari Axios
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // 2. Inisialisasi hook navigate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.post('/users/login', {
        email,
        password,
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));

      console.log('Login berhasil:', response.data);
      
      // 3. Arahkan ke halaman dashboard setelah login berhasil
      navigate('/dashboard'); 

    } catch (err) {
      const apiError = err as ApiError;
      console.error('Error login:', apiError);

      const errorMessage = 
        apiError.response?.data?.message || 'Login gagal. Periksa kembali email dan password.';
      setError(errorMessage);
    }
  };

return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p className="switch-link">
        Sudah punya akun? <Link to="/login">Login di sini</Link>
      </p>
    </div>
  );
};

export default LoginPage;