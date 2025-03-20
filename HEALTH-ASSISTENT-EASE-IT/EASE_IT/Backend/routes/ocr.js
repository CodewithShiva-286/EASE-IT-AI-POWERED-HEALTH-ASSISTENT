require('dotenv').config();
const express = require('express');
const router = express.Router();
const multer = require('multer');
const Tesseract = require('tesseract.js');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const User = require('../models/User');

const upload = multer({ dest: 'uploads/' });

const JWT_SECRET = process.env.JWT_SECRET;
const CHATBOT_API_KEY = process.env.CHATBOT_API_KEY;
const CHATBOT_API_URL = process.env.CHATBOT_API_URL;

router.post('/', upload.single('image'), async (req, res) => {
  const imagePath = req.file?.path;

  if (!imagePath) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user || !user.healthData) return res.status(404).json({ error: 'Health data not found' });

    const healthData = user.healthData;

    const { data: { text } } = await Tesseract.recognize(imagePath, 'eng');
    const cleanedText = text.trim();

    // Updated prompt structure
    const prompt = `
You are FoodieFriend - a helpful nutrition assistant.
User Health Data: ${JSON.stringify(healthData)}
Ingredients from product: ${cleanedText}

Please analyze the ingredients for health safety based on the user's health data.

Please generate a response in the following format (each line should start on a new line):
Line 1: A straightforward answer ("Yes" or "No") with an emoji.
Line 2: If the answer is Yes, provide a funny joke or phrase with emojis.
        If the answer is No, provide a 2-3 line explanation (with emojis) describing why the meal is not safe.
Line 3: List all harmful ingredients in the product with a warning emoji (e.g., ⚠) before each.
`;

    const chatbotRes = await axios.post(`${CHATBOT_API_URL}?key=${CHATBOT_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    }, { headers: { 'Content-Type': 'application/json' } });

    const chatbotReply = chatbotRes.data.candidates[0]?.content?.parts[0]?.text || "Try again!";
    res.json({ reply: chatbotReply });

  } catch (err) {
    console.error('OCR/Chatbot Error:', err.message);
    res.status(500).json({ error: 'Failed to process image' });
  } finally {
    fs.unlink(imagePath, () => {});
  }
});

module.exports = router;
