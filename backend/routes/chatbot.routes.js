const express = require('express');
const router = express.Router();

const chatbotHandler = require('../utils/chatbotHandler');
const chatbotController = require('../controllers/chatbot.controller'); // ✅ Quan trọng
const auth = require('../middlewares/auth.middleware'); // ✅ Bảo vệ route


router.use(auth);

router.post('/chatbot', chatbotController); 
router.post('/', chatbotHandler);           

module.exports = router;
