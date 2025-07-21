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
        setUserName(res.data.user.name); // cập nhật context
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
    <div className="flex justify-center items-center h-screen bg-gray-300">
      <div className="w-[350px] h-[500px] p-6 bg-white rounded-xl shadow-lg flex flex-col items-center relative">
        <button
          onClick={() => navigate('/')}
          className="absolute top-4 left-4 text-gray-700 hover:text-black transition"
          title="Quay lại"
        >
          <ArrowLeftIcon className="w-6 h-6 cursor-pointer" />
        </button>

        <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 overflow-hidden">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>

        <form onSubmit={handleRegister} className="w-full flex flex-col items-center">
          <input 
            type="text"
            placeholder="Họ tên"
            className="border border-gray-400 rounded px-3 py-2 w-full mb-3"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
          />
          <input 
            type="email"
            placeholder="Email đăng nhập"
            className="border border-gray-400 rounded px-3 py-2 w-full mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password"
            placeholder="Mật khẩu"
            className="border border-gray-400 rounded px-3 py-2 w-full mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input 
            type="password"
            placeholder="Nhập lại mật khẩu"
            className="border border-gray-400 rounded px-3 py-2 w-full mb-3"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-3 mt-5 w-full rounded hover:bg-blue-600 transition"
          >
            Tạo tài khoản
          </button>
        </form>
      </div>
    </div>
  );
};

export default PDangky;
