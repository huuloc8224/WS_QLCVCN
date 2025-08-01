const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('🧪 Authorization header:', authHeader); // LOG 1

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.warn('⚠️ Token không tồn tại hoặc sai định dạng');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🔐 Token:', token); // LOG 2

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token hợp lệ, payload:', decoded); // LOG 3
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token sai hoặc hết hạn:', err.message); // LOG 4
    return res.status(403).json({ message: 'Invalid token' });
  }
};
