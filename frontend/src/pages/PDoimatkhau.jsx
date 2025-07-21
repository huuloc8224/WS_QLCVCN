import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authApi from '../api/authApi';
import logo from '../assets/l2dd2.jpg';

const PDoimatkhau = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      alert('Mật khẩu mới không khớp');
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      alert('Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
      localStorage.removeItem('token');
      navigate('/');
    } catch (err) {
      console.error('Lỗi đổi mật khẩu:', err);
      alert('Mật khẩu cũ không đúng hoặc lỗi máy chủ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-300">
      <div className="w-[350px] p-6 bg-white rounded-xl shadow-lg flex flex-col items-center">
        <div className="w-24 h-24 rounded-full mb-4 overflow-hidden">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>
        <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
        <form onSubmit={handleChangePassword} className="w-full flex flex-col">
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            className="border border-gray-400 rounded px-3 py-2 w-full mb-3"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="border border-gray-400 rounded px-3 py-2 w-full mb-3"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            className="border border-gray-400 rounded px-3 py-2 w-full mb-4"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-500 text-white font-semibold py-2 rounded transition ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
          >
            {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PDoimatkhau;
