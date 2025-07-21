import axiosClient from './axiosClient';

const authApi = {
  // Đăng ký tài khoản
  register: (data) => axiosClient.post('/api/auth/register', data),

  // Đăng nhập
  login: (data) => axiosClient.post('/api/auth/login', data),

  // Đổi mật khẩu (cần token)
  changePassword: (data) => axiosClient.post('/api/auth/change-password', data),

  // Gửi mã qua email để đặt lại mật khẩu
  forgotPassword: (data) => axiosClient.post('/api/auth/forgot-password', data),

  // Đặt lại mật khẩu (dùng email + mã + mật khẩu mới)
  resetPassword: (data) => axiosClient.post('/api/auth/reset-password', data),
};

export default authApi;
