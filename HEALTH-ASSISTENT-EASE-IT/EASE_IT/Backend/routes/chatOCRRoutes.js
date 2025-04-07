// chatOCRRoutes.js (updated)
const express = require('express');
const { analyzeChatImage } = require('../controllers/chatOCRController');
const router = express.Router();

router.post('/scan/text', async (req, res) => {
    try {
        const imageFile = req.files?.image;
        if (!imageFile) return res.status(400).json({ error: "No image provided." });

        const imageBuffer = imageFile.data;
        const result = await analyzeChatImage(imageBuffer, req.body.healthConditions);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
