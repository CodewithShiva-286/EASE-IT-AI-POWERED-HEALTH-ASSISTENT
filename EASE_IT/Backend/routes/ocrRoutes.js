const express = require('express');
const { analyzeOCR } = require('../controllers/ocrController');
const router = express.Router();

// OCR Analysis Route
router.post('/analyze', async (req, res) => {
    try {
        const response = await analyzeOCR(req.body);
        res.json({ response });
    } catch (error) {
        console.error("❌ OCR Processing Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
