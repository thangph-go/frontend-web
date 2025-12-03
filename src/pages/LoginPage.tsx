import React, { useState } from 'react';
import { login } from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import '../styles/forms.css';
import '../styles/LoginPage.css';

interface TokenPayload {
  id: number;
  vai_tro: 'ADMIN' | 'STAFF';
  iat: number;
  exp: number;
}

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); 

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(username, password);

      localStorage.setItem('authToken', data.token);
      const decodedToken = jwtDecode<TokenPayload>(data.token);
      localStorage.setItem('userRole', decodedToken.vai_tro);
      localStorage.setItem('username', username); 
      
      navigate('/admin/dashboard'); 

    }catch (err: any) {
  setError(err.message);

  // Giữ thông báo lỗi 4 giây rồi mới tắt
  setTimeout(() => {
    setError(null);
  }, 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2 className="login-title">Đăng Nhập</h2>

        {error && <p className="login-error">{error}</p>}

        <div className="form-group">
          <label className="form-label">Tên đăng nhập:</label>
          <input
            type="text"
            className="form-input" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Mật khẩu:</label>
          <input
            type="password"
            className="form-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button 
          type="submit" 
          className="form-button login-button"
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;