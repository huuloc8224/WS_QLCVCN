import React, { useState, useContext } from 'react';
import logo from '../assets/l2dd2.jpg';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import authApi from '../api/authApi';
import { UserContext } from '../context/UserContext';

const PDangky = () => {
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const { setUserName } = useContext(UserContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!fullname || !password || !confirmPassword || !email) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      alert('Mật khẩu nhập lại không khớp');
      return;
    }

    try {
      const res = await authApi.register({
        name: fullname,
        email,
        password,
      });

      if (res?.data?.user?.name) {
        localStorage.setItem('userName', res.data.user.name);
        setUserName(res.data.user.name);
      }

      if (res?.data?.token) {
        localStorage.setItem('token', res.data.token);
      }

      alert('Tạo tài khoản thành công!');
      navigate('/');
    } catch (error) {
      console.error('Đăng ký lỗi:', error);
      alert('Email đã tồn tại hoặc lỗi server');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-gray-500 hover:text-blue-600 transition"
          title="Quay lại"
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-300 mb-3">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center">Tạo tài khoản mới</h2>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email đăng nhập"
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
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded hover:bg-blue-600 transition"
          >
            Tạo tài khoản
          </button>
        </form>
      </div>
    </div>
  );
};

export default PDangky;
