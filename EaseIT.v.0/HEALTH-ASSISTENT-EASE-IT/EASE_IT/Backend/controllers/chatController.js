const fetch = require('node-fetch');

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

exports.generateChatResponse = async ({ prompt, chatHistory, lastScanResult }) => {
  console.log("📌 Received Chatbot Request");
  console.log("📌 User Prompt:", prompt);
  console.log("📌 Chat History:", chatHistory);
  console.log("📌 Last Scan Result:", lastScanResult);

  try {
    // Build the full prompt including the last scan result if provided.
    const historyText = chatHistory.join('\n');
    const fullPrompt = `${lastScanResult ? `Last Scan Result: ${lastScanResult}\n` : ''}User: ${prompt}\n${historyText}\nFoodieFriend:`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed. Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("📌 Full Gemini API Response:", JSON.stringify(data, null, 2));

    const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!aiResponse) {
      throw new Error("Invalid AI response structure.");
    }
    return aiResponse;
  } catch (error) {
    console.error("❌ Error in Chatbot Processing:", error);
    return "🚨 My circuits got confused! Let's retry.";
  }
};





