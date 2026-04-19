const express = require('express');
const { generateChatResponse } = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/ask', authMiddleware, async (req, res) => {
    const { prompt, chatHistory, lastScanResult } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'User prompt is required' });
    }

    try {
        const response = await generateChatResponse({ prompt, chatHistory, lastScanResult, userId: req.user.userId });
        res.json({ response });
    } catch (error) {
        console.error("❌ Chatbot Error:", error);
        res.status(500).json({ error: 'Failed to generate response' });
    }
});

module.exports = router;














