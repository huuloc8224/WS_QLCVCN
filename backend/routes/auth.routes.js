const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// ==== Auth Routes ====
router.post('/register', authController.register);
router.post('/login', authController.login);

// 🔐 Đổi mật khẩu khi đã đăng nhập
router.post('/change-password', authMiddleware, authController.changePassword);

// ✅ Thêm mới: Quên mật khẩu
router.post('/forgot-password', authController.forgotPassword); // Gửi mã xác nhận
router.post('/reset-password', authController.resetPassword);   // Đặt lại mật khẩu bằng mã

module.exports = router;
