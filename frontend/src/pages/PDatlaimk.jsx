import React, { useState } from 'react';
import authApi from '../api/authApi';
import { useSearchParams, useNavigate } from 'react-router-dom';



const PDatlaimk = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const token = searchParams.get('token'); // 👈 Lấy token từ URL

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirm) {
      setError('Mật khẩu không khớp.');
      return;
    }

    try {
      await authApi.resetPassword({ token, password: newPassword }); // 👈 Gửi token và password
      setMessage('Mật khẩu đã được đặt lại thành công.');
      setError('');

      setTimeout(() => {
        navigate('/');
      }, 2000);   
    } catch {
      setError('Token không hợp lệ hoặc đã hết hạn.');
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Đặt lại mật khẩu</h2>
      <form onSubmit={handleReset}>
        <label className="block mb-2 font-medium">Mật khẩu mới:</label>
        <input
          type="password"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-3"
        />

        <label className="block mb-2 font-medium">Xác nhận mật khẩu:</label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
        />

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
          Đặt lại mật khẩu
        </button>
      </form>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default PDatlaimk;
