const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const homeButton = document.getElementById('home-button');

// Load OCR text, health data, and initial chatbot reply from localStorage
const ingredients = localStorage.getItem('ocrText') || "No ingredients scanned";
const healthConditions = localStorage.getItem('healthData') || "No health conditions provided";
const initialResult = localStorage.getItem('chatbotReply');

let chatHistory = [];

// Initial personality and format prompt
const PERSONALITY_PROMPT = `You are FoodieFriend - a cheerful food safety assistant with these traits:
1. Always positive and encouraging
2. Uses emojis tastefully (1-2 per message)
3. Gives personalized food advice
4. Short food jokes when asked
5. Friendly greetings/farewells

Health Conditions: ${healthConditions}
Scanned Ingredients: ${ingredients}

Please generate a response in the following format (each line should start on a new line):
Line 1: A straightforward answer ("Yes" or "No") with an emoji.
Line 2: If the answer is Yes, provide a funny joke or phrase with emojis.
        If the answer is No, provide a 2-3 line explanation (with emojis) describing why the meal is not safe.
Line 3: List all harmful ingredients in the product with a warning emoji (e.g., ⚠) before each.`;

// Call backend to get Gemini AI response securely
async function generateResponse(promptText) {
    try {
        const fullPrompt = `${PERSONALITY_PROMPT}\n\n${formatHistory()}\nUser: ${promptText}\nFoodieFriend:`;

        const response = await fetch('/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: promptText,
                healthData: healthConditions,
                ingredients: ingredients,
                chatHistory: chatHistory
            })
        });

        const data = await response.json();
        return data.reply || "🥗 Let’s try that again!";
    } catch (err) {
        console.error("Chatbot Error:", err);
        return "🍴 Oops, something went wrong!";
    }
}

// Add a chat message bubble to the UI
function addMessage(msg, isUser) {
    const div = document.createElement('div');
    div.className = `p-3 rounded-xl shadow-sm max-w-[80%] ${isUser ? 'bg-green-200 self-end ml-auto' : 'bg-white bg-opacity-70 self-start'} border ${isUser ? 'border-green-400' : 'border-green-300'}`;
    div.innerHTML = msg.replace(/\n/g, '<br>');
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show initial OCR analysis result or get fresh analysis
async function displayInitialAnalysis() {
    if (initialResult) {
        addMessage("📋 Here's your food analysis:", false);
        addMessage(initialResult, false);
        chatHistory.push({ role: 'assistant', message: initialResult });
    } else {
        const analysis = await generateResponse(`Analyze these ingredients for ${healthConditions} and give 1 tip`);
        addMessage(analysis, false);
        chatHistory.push({ role: 'assistant', message: analysis });
    }
}

// Handle user sending message
async function handleUserInput() {
    const text = userInput.value.trim();
    if (!text) return;

    addMessage(text, true);
    chatHistory.push({ role: 'user', message: text });
    userInput.value = '';
    sendButton.disabled = true;

    const reply = await generateResponse(text);
    addMessage(reply, false);
    chatHistory.push({ role: 'assistant', message: reply });
    sendButton.disabled = false;
}

// Format chat history for Gemini prompt
function formatHistory() {
    return chatHistory.map(item => `${item.role === 'user' ? 'User' : 'FoodieFriend'}: ${item.message}`).join('\n');
}

// Navigation back to home
homeButton.addEventListener('click', () => {
    window.location.href = "home.html";
});

// Event listeners for send button and enter key
sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', e => {
    if (e.key === "Enter") handleUserInput();
});

// Run initial analysis on load
window.onload = displayInitialAnalysis;
