import React, { useState, useContext } from 'react';
import logo from '../assets/l2dd2.jpg';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import { UserContext } from '../context/UserContext';

const PDangnhap = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUserName } = useContext(UserContext);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      const res = await authApi.login({ email, password });

      const user = res.data.user;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', user.name);
      setUserName(user.name);

      alert('Đăng nhập thành công!');
      navigate('/tongquan');
    } catch (err) {
      console.error('Đăng nhập lỗi:', err);
      alert('Sai email hoặc mật khẩu hoặc lỗi server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">

        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-300 mb-4">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Đăng nhập hệ thống</h2>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <input 
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password"
            placeholder="Mật khẩu"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 transition"
          >
            Đăng nhập
          </button>
        </form>

        <div className="flex justify-between items-center w-full mt-6 text-sm">
          <button 
            className="text-blue-600 hover:underline"
            onClick={() => navigate('/dangky')}
          >
            Tạo tài khoản
          </button>
          <button
            onClick={() => navigate('/quenmatkhau')}
            className="text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDangnhap;
