import axiosClient from './axiosClient';

const authApi = {
  // Đăng ký tài khoản
  register: (data) => axiosClient.post('/auth/register', data),

  // Đăng nhập
  login: (data) => axiosClient.post('/auth/login', data),

  // Đổi mật khẩu (cần token)
  changePassword: (data) => axiosClient.post('/auth/change-password', data),

  // Gửi mã qua email để đặt lại mật khẩu
  forgotPassword: (data) => axiosClient.post('/auth/forgot-password', data),

  // Đặt lại mật khẩu (dùng email + mã + mật khẩu mới)
  resetPassword: (data) => axiosClient.post('/auth/reset-password', data),
};

export default authApi;
