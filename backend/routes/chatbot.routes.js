const express = require('express');
const router = express.Router();
const chatbotHandler = require('../utils/chatbotHandler');

router.post('/', chatbotHandler);

module.exports = router;
