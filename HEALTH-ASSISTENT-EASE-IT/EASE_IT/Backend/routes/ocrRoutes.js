const express = require('express');
const { analyzeOCR } = require('../controllers/ocrController');
const router = express.Router();

// OCR Analysis Route
router.post('/analyze', async (req, res) => {
    console.log("📌 OCR Analyze API Called!");  
    console.log("📌 Request Body:", req.body);

    try {
        const response = await analyzeOCR(req.body);
        console.log("📌 OCR Analysis Response:", response);
        res.json({ response });
    } catch (error) {
        console.error("❌ OCR Processing Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
