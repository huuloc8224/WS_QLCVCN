const express = require('express');
const router = express.Router();
const Log = require('../models/log');
const authMiddleware = require('../middlewares/auth.middleware');

// GET: Lấy lịch sử thay đổi của người dùng hiện tại
router.get('/', authMiddleware, async (req, res) => {
  try {
    const logs = await Log.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(logs);
  } catch (err) {
    console.error('❌ Lỗi khi lấy lịch sử:', err);
    res.status(500).json({ message: 'Lỗi khi lấy lịch sử' });
  }
});

module.exports = router;
