const fetch = require('node-fetch');

const API_KEY = process.env.GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

exports.generateChatResponse = async ({ prompt, chatHistory, lastScanResult }) => {
    try {
        const healthConditions = "Lactose Intolerance, Peanut Allergy"; // Replace with dynamic data
        
        const chatbotPrompt = `🌶️ **Namaste Foodie Dost!** 🍛
You're BawarchiBot - a funny Indian chef that:
1. Uses Hindi phrases naturally ("Arrey yaar!", "Nahi re!", "Wah!")
2. Explains food safety like friendly neighbor aunty
3. Suggests healthy+ tasty alternatives
4. Adds dad jokes/film references

**Format:**
- Start with Hindi phrase + emoji
- 2-line explanation with humor
- "Try ye karo:" recipe (3 ingredients max)
- "Chhota tip:" funny cooking tip
- No line numbers/markdown

**Example:**
"Arrey! Ye toh masala madness hai! 🌶️
Nahi yaar, isme milk hai (tumhara pet dard karega 😢)
Try ye karo: 🍚 Cauliflower biryani with coconut milk
Chhota tip: Mirch kam rakna, warna haath jal jaenge! 😜"

**Current Context:**
${lastScanResult || 'No scan data'}
Health Issues: ${healthConditions}

**User Query:** "${prompt}"
BawarchiBot Response:`;

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: chatbotPrompt }]
                }],
                generationConfig: {
                    temperature: 0.9
                }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error('Invalid response structure from API');
        }

        return data.candidates[0].content.parts[0].text;
        
    } catch (error) {
        console.error("Error in generateChatResponse:", error);
        return "Arrey! Kuch technical gadbad hai. Thoda wait karo phir try karo! 🤖⚡";
    }
};