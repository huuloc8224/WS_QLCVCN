import React, { useState } from 'react';
import logo from '../assets/l2dd2.jpg'; // Import logo
import authApi from '../api/authApi';

const PQuenmatkhau = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authApi.forgotPassword({ email });
      setMessage('Đã gửi mã xác nhận tới email của bạn!');
      setError('');
    } catch {
      setError('Có lỗi xảy ra khi gửi email!');
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-blue-200">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src={logo}
            alt="Logo"
            className="h-16 w-16 object-cover rounded-full shadow-md"
          />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Quên mật khẩu
        </h2>

        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium text-gray-700">
            Email đăng nhập:
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
            placeholder="Nhập email của bạn"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 mt-6 rounded-lg hover:bg-blue-700 transition"
          >
            Gửi mã xác nhận
          </button>
        </form>

        {message && (
          <p className="text-green-600 mt-4 text-sm text-center">{message}</p>
        )}
        {error && (
          <p className="text-red-600 mt-4 text-sm text-center">{error}</p>
        )}

        {/* Điều hướng */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <span>Bạn nhớ mật khẩu? </span>
          <a href="/" className="text-blue-600 hover:underline">
            Đăng nhập
          </a>
        </div>
      </div>
    </div>
  );
};

export default PQuenmatkhau;
