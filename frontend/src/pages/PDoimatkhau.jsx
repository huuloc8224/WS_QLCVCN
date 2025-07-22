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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center">
        
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-300 mb-4">
          <img src={logo} alt="Logo" className="w-full h-full object-cover" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-6">Đổi mật khẩu</h2>

        <form onSubmit={handleChangePassword} className="w-full space-y-4">
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded transition ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
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
