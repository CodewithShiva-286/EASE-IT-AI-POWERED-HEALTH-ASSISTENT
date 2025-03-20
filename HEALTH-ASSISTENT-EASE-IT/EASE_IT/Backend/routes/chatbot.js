require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_URL = process.env.CHATBOT_API_URL;
const API_KEY = process.env.CHATBOT_API_KEY;

// Chatbot route: Handles both initial analysis and user chat with context
router.post('/', async (req, res) => {
  const { text, healthData, ingredients, chatHistory } = req.body;

  // Build the base personality prompt
  const basePrompt = `You are FoodieFriend - a cheerful food safety assistant with these traits:
1. Always positive and encouraging
2. Uses emojis tastefully (1-2 per message)
3. Gives personalized food advice
4. Short food jokes when asked
5. Friendly greetings/farewells

Health Conditions: ${JSON.stringify(healthData || {})}
Scanned Ingredients: ${ingredients || "Not Provided"}

Please generate a response in the following format (each line should start on a new line):
Line 1: A straightforward answer ("Yes" or "No") with an emoji.
Line 2: If the answer is Yes, provide a funny joke or phrase with emojis.
        If the answer is No, provide a 2-3 line explanation (with emojis) describing why the meal is not safe.
Line 3: List all harmful ingredients in the product with a warning emoji (e.g., ⚠) before each.`

  // Combine history and current message into the full prompt
  let fullPrompt = `${basePrompt}\n\n`;

  if (Array.isArray(chatHistory)) {
    const formattedHistory = chatHistory.map(item => {
      return `${item.role === 'user' ? 'User' : 'FoodieFriend'}: ${item.message}`;
    }).join('\n');
    fullPrompt += `${formattedHistory}\nUser: ${text}\nFoodieFriend:`;
  } else {
    // If no history, treat as initial analysis
    fullPrompt += `User: ${text}\nFoodieFriend:`;
  }

  try {
    const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
      contents: [{ parts: [{ text: fullPrompt }] }]
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const reply = response.data.candidates[0]?.content?.parts[0]?.text || "Let’s try that again!";
    res.json({ reply });
  } catch (err) {
    console.error('Chatbot Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get chatbot response' });
  }
});

module.exports = router;
