const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const chatbotController = require('../controllers/chatbot.controller');

router.use(auth);
router.post('/chatbot', chatbotController);

module.exports = router;
