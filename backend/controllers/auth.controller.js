const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// ========== ĐĂNG KÝ ==========
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email đã tồn tại' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== ĐĂNG NHẬP ==========
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ========== ĐỔI MẬT KHẨU ==========
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Lỗi đổi mật khẩu:', error);
    res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

// ========== QUÊN MẬT KHẨU ==========
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email không tồn tại' });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const resetLink = `${process.env.CLIENT_URL}/datlaimatkhau?token=${resetToken}`;

    await transporter.sendMail({
      from: `"Quản lý công việc" <${process.env.MAIL_USERNAME}>`,
      to: email,
      subject: 'Đặt lại mật khẩu',
      html: `<p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
             <p>Nhấn vào link bên dưới để đặt lại mật khẩu (hết hạn sau 15 phút):</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: 'Đã gửi email đặt lại mật khẩu' });
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    res.status(500).json({ message: 'Không thể gửi email' });
  }
};

// ========== ĐẶT LẠI MẬT KHẨU ==========
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

    const hashedNewPassword = await bcrypt.hash(password, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (error) {
    console.error('Lỗi đặt lại mật khẩu:', error);
    res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};
