const API_KEY = 'AIzaSyByN5LDr6NbjiyI6F5ab_5SxSvnuvm2VcU';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const micButton = document.getElementById('mic-btn');
const attachmentBtn = document.getElementById('attachment-btn');
const fileInput = document.getElementById('file-input');

// State Management
let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
let lastScanResult = localStorage.getItem("lastScanResult") || "";

// Retrieve User Health Data
function getUserHealthData() {
    return localStorage.getItem("userHealthData") || "No health data provided";
}

// Format Bot Response
function formatBotResponse(text) {
    return text
        .replace(/(Arrey|Nahi|Yaar|Wah|Bhai)/gi, '<span class="hindi-phrase">$1</span>')
        .replace(/(🍛|🌶️|🍴|💡|🚨)/g, '<span class="food-emoji">$1</span>')
        .replace(/(Try ye karo:|Chhota tip:)/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/Line \d+:/gi, '');
}

// Message Handling
function addMessage(message, isUser) {
    if (!chatMessages) return;
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');
    
    const content = document.createElement('div');
    content.classList.add('message-content');
    
    if (message.startsWith('📎')) {
        content.classList.add('file-attachment');
        content.innerHTML = `<i class="fas fa-paperclip"></i>${message}`;
    } else if (message.startsWith('🔍')) {
        content.classList.add('analysis-status');
        content.textContent = message;
    } else {
        content.innerHTML = isUser ? message : formatBotResponse(message);
    }

    if (!isUser) {
        const botIcon = document.createElement('i');
        botIcon.className = 'fas fa-robot';
        messageElement.appendChild(botIcon);
    }

    messageElement.appendChild(content);
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Voice Recognition
if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;

    micButton?.addEventListener('click', () => {
        recognition.start();
        micButton.style.backgroundColor = '#ff4d4d';
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        micButton.style.backgroundColor = '';
    };
}

// File Handling for OCR
fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        addMessage(`📎 ${file.name}`, true);
        addMessage('🔍 Analyzing attached file...', false);
        
        try {
            const formData = new FormData();
            formData.append('image', file);
            
            const response = await fetch('/api/ocr/analyze', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            lastScanResult = result.response;
            localStorage.setItem("lastScanResult", lastScanResult);
            addMessage(lastScanResult, false);
            
        } catch (error) {
            console.error("Error in file processing:", error);
            addMessage("Arrey! Image scan mein gadbad hai! 📵", false);
        }
    }
});

// Chat Functionality
async function generateResponse(prompt) {
    try {
        const healthConditions = getUserHealthData();
        
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `User Health Conditions: ${healthConditions}\n
                        ${lastScanResult ? `Last Scan: ${lastScanResult}\n` : ''}
                        User Query: ${prompt}\n
                         Respond in English script (A B C), but keep it in Hindi-English mix style. Use food emojis and simple words like "Arrey", "Wah", "Bhai", etc., without using Hindi script.`
                    }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "Arrey! Kuch gadbad hai. Thoda wait karo! 🤖⚡";

    } catch (error) {
        console.error("Error in API call:", error);
        return "Arrey! Network issue hai, thoda wait karo! ⚠️";
    }
}

async function handleUserInput() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, true);
    userInput.value = '';
    sendButton.disabled = true;

    try {
        const response = await generateResponse(message);
        addMessage(response, false);
        chatHistory.push({ user: message, bot: response });
        localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    } catch (error) {
        console.error("Error handling user input:", error);
    } finally {
        sendButton.disabled = false;
    }
}

// Event Listeners
sendButton?.addEventListener('click', handleUserInput);
userInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});

// Store User Health Data from Form
document.getElementById('health-form')?.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const healthData = Array.from(formData.entries())
        .map(([key, value]) => value)
        .join(', ');
    localStorage.setItem("userHealthData", healthData);
});

// Initialization
window.addEventListener('load', () => {
    if (lastScanResult) {
        addMessage("📋 Pichla Scan Result:", false);
        addMessage(lastScanResult, false);
    }
});