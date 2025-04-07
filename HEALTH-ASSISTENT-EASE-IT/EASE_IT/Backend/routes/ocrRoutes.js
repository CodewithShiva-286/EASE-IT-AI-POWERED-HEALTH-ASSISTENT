const express = require('express');
const multer = require('multer');
const { analyzeOCR } = require('../controllers/ocrController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), async (req, res) => {
    console.log("📌 OCR API called with image upload!");

    try {
        const imageBuffer = req.file.buffer;
        const imageSrc = `data:image/png;base64,${imageBuffer.toString('base64')}`;

        const response = await analyzeOCR({ imageSrc });
        console.log("📌 OCR Analysis Success:", response);

        res.json({ text: response });
    } catch (error) {
        console.error("❌ OCR Processing Error:", error);
        res.status(500).json({ error: "OCR failed. Please try again." });
    }
});

module.exports = router;


