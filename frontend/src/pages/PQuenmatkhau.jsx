import React, { useState } from 'react';
import authApi from '../api/authApi';

const PQuenmatkhau = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authApi.forgotPassword({ email }); // ✅ Không gán vào biến không dùng
      setMessage('Mã xác nhận đã được gửi đến email của bạn.');
      setError('');
    } catch {
      setError('Không thể gửi mã xác nhận. Vui lòng kiểm tra lại email.');
      setMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-4">Quên mật khẩu</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-medium">Email đăng nhập:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Nhập email của bạn"
        />
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Gửi mã xác nhận
        </button>
      </form>
      {message && <p className="text-green-600 mt-4">{message}</p>}
      {error && <p className="text-red-600 mt-4">{error}</p>}
    </div>
  );
};

export default PQuenmatkhau;
