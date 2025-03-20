const API_KEY =process.env.GEMINI_API_KEY
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const homeButton = document.getElementById('home-button');

const urlParams = new URLSearchParams(window.location.search);
const ingredients = urlParams.get('ingredients') || "No ingredients scanned";
const healthConditions = urlParams.get('health') || "No health conditions provided";
const initialResult = urlParams.get('result'); // if redirected from scan

// Retrieve stored chat history if available; otherwise, start fresh.
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];

// Retrieve the last scan result from localStorage or URL parameter.
let lastScanResult = localStorage.getItem("lastScanResult") || initialResult || "";

// Personality prompt remains as in your reference.
const PERSONALITY_PROMPT = `You are FoodieFriend - a cheerful food safety assistant with these traits:
1. Always positive and encouraging
2. Uses emojis tastefully (1-2 per message)
3. Remembers user's health conditions
4. Gives personalized food advice
5. Tells short food-related jokes when asked
6. Uses friendly greetings and farewells
7. Shows genuine interest in user's well-being

Health Conditions: ${healthConditions}
Scanned Ingredients: ${ingredients}

Respond to non-food questions with:
"I'm your food buddy! 🥗 Let's talk about nutrition, recipes, or food safety. Ask me anything food-related or say 'joke' for a yummy joke!"`;

function addMessage(message, isUser) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');
  messageElement.innerHTML = message.replace(/\n/g, '<br>');
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function generateResponse(prompt) {
  try {
    // Build history text from the last 5 messages.
    const historyText = chatHistory.slice(-5)
      .map(entry => `${entry.role === 'user' ? 'You' : 'FoodieFriend'}: ${entry.message}`)
      .join('\n');
    // Include last scan result if available.
    const fullPrompt = `${PERSONALITY_PROMPT}\n\n${lastScanResult ? `Last Scan Result: ${lastScanResult}\n` : ''}${historyText}\nUser: ${prompt}\nFoodieFriend:`;

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }]
      })
    });

    if (!response.ok) throw new Error(`API request failed. Status: ${response.status}`);
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Oops! Let's try that again!";
  } catch (error) {
    console.error('Error:', error);
    return "🚨 My circuits got confused! Let's retry.";
  }
}

async function handleUserInput() {
  const message = userInput.value.trim();
  if (!message) return;

  addMessage(message, true);
  chatHistory.push({ role: 'user', message });
  userInput.value = '';
  sendButton.disabled = true;

  try {
    const response = await generateResponse(message);
    addMessage(response, false);
    chatHistory.push({ role: 'assistant', message: response });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  } catch (error) {
    addMessage("🚨 My recipe book fell! Let's try again?", false);
  } finally {
    sendButton.disabled = false;
  }
}

// If there's a previous scan result, display it as initial analysis.
if (lastScanResult) {
  setTimeout(() => {
    addMessage("📋 Here is your previous scan analysis:", false);
    addMessage(lastScanResult, false);
    chatHistory.push({ role: 'assistant', message: lastScanResult });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    // Clear the stored last scan result after using it.
    localStorage.removeItem("lastScanResult");
  }, 500);
}

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleUserInput();
  }
});

homeButton.addEventListener('click', () => {
  window.location.href = 'home.html';
});

window.addEventListener('load', () => {
  // Optionally clear chat history on fresh load if desired.
  // localStorage.removeItem("chatHistory");
});




