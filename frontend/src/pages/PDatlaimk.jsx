import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import authApi from '../api/authApi';
import logo from '../assets/l2dd2.jpg';

const PDatlaimk = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      setError('Mật khẩu không khớp.');
      return;
    }

    try {
      await authApi.resetPassword({ token, password: newPassword });
      setMessage('Mật khẩu đã được đặt lại thành công.');
      setError('');
      setNewPassword('');
      setConfirm('');

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch {
      setError('Token không hợp lệ hoặc đã hết hạn.');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 relative">
        
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-300 mb-3">
            <img src={logo} alt="Logo" className="w-full h-full object-cover" />
          </div>

          <button
            onClick={() => navigate('/')}
            className="text-gray-500 hover:text-blue-600 transition"
            title="Quay lại trang chủ"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Đặt lại mật khẩu</h2>
        
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Mật khẩu mới:</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium text-gray-700">Xác nhận mật khẩu:</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Đặt lại mật khẩu
          </button>
        </form>

        {message && <p className="text-green-600 text-center mt-4">{message}</p>}
        {error && <p className="text-red-600 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default PDatlaimk;
