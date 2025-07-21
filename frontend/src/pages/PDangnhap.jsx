import React, { useState, useContext } from 'react';
import logo from '../assets/l2dd2.jpg';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import { UserContext } from '../context/UserContext';

const PDangnhap = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUserName } = useContext(UserContext); // ← Lấy context để set tên

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      const res = await authApi.login({ email, password });

      // Backend trả về user.name → ta dùng đúng key này
      const user = res.data.user;

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userName', user.name); // ← DÙNG name thay vì fullname
      setUserName(user.name);                      // ← cập nhật UserContext

      alert('Đăng nhập thành công!');
      navigate('/tongquan');

      // Nếu cần cập nhật lại toàn bộ layout ngay sau login:
      // window.location.reload();
    } catch (err) {
      console.error('Đăng nhập lỗi:', err);
      alert('Sai email hoặc mật khẩu hoặc lỗi server');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-300">
      <div className="w-[350px] h-[500px] p-6 bg-white rounded-xl shadow-lg flex flex-col items-center">
        
        {/* Logo */}
        <div className="w-32 h-32 rounded-full flex items-center justify-center mb-6 overflow-hidden">
          <img 
            src={logo}
            alt="Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form đăng nhập */}
        <form onSubmit={handleLogin} className="w-full flex flex-col items-center">
          <input 
            type="email"
            placeholder="Email"
            className="border border-gray-400 rounded px-3 py-2 w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password"
            placeholder="Mật khẩu"
            className="border border-gray-400 rounded px-3 py-2 w-full mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-500 text-white font-semibold py-2 w-full rounded hover:bg-blue-600 transition mt-5"
          >
            Đăng nhập
          </button>
        </form>

        {/* Các nút điều hướng khác */}
        <div className="flex justify-between items-center w-full mt-20">
          <button 
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
            onClick={() => navigate('/dangky')}
          >
            Tạo tài khoản
          </button>
          <button
            onClick={() => navigate('/quenmatkhau')}
            className="text-sm text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </button>
        </div>

      </div>
    </div>
  );
};

export default PDangnhap;
