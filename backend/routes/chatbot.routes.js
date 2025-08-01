const express = require('express');
const router = express.Router();
const chatbotHandler = require('../utils/chatbotHandler');
const auth = require('../middlewares/auth.middleware');

router.use(auth);
router.post('/chatbot', chatbotController);
router.post('/', chatbotHandler);


module.exports = router;
