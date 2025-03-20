// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI;

// Debug log to verify DB_URI is loaded correctly
if (!DB_URI) {
  console.error("❌ DB_URI is undefined. Check your .env file.");
  process.exit(1);  // Exit app if DB_URI not loaded
}

// Middleware
app.use(express.json());   // Parse JSON bodies
app.use(cors());           // Allow CORS (optional, useful for dev)

console.log("✅ Loaded DB_URI:", DB_URI);

// Connect to MongoDB
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);  // Exit app if MongoDB fails
  });

// Serve static files (HTML, CSS, JS) from public/
app.use(express.static(path.join(__dirname, 'public')));

// Default route: Serve index.html from /html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/index.html'));
});

// API Routes
const authRoutes = require('./routes/auth');
const healthDataRoutes = require('./routes/healthdata');
const chatbotRoutes = require('./routes/chatbot');
const ocrRoutes = require('./routes/ocr');   // 👈 Add OCR route here

app.use('/api/auth', authRoutes);
app.use('/api/healthdata', healthDataRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ocr', ocrRoutes);              // 👈 Mount OCR route at /api/ocr

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});  