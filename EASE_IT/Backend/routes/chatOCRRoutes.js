// chatOCRRoutes.js (updated)
const express = require('express');
const { analyzeChatImage } = require('../controllers/chatOCRController');
const router = express.Router();

router.post('/scan/text', async (req, res) => {
    try {
        const imageFile = req.files?.image;
        const healthConditions = req.body.healthConditions;
        
        if (!imageFile) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        if (!healthConditions || typeof healthConditions !== 'string') {
            return res.status(400).json({ error: 'Health conditions are required and must be a string' });
        }
        
        const result = await analyzeChatImage(
            imageFile,
            req.body.healthConditions
        );
        res.json(result);
    } catch (error) {
        console.error('Chat OCR error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;