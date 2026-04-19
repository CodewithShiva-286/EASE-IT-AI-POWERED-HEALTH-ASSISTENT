// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import API routes
const authRoutes = require('./routes/auth');
const healthDataRoutes = require('./routes/healthData');
const chatbotRoutes = require('./routes/chatRoutes');
const ocrRoutes = require('./routes/ocrRoutes'); // OCR route

const app = express();
const PORT = process.env.PORT || 10000;  // ✅ Changed to port 3000
const DB_URI = process.env.DB_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;  // ✅ Load Gemini API Key

// Middleware
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:10000' }));  // ✅ Allows frontend requests
app.use(express.json({ limit: '5mb' }));  
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Connect to MongoDB
if (!DB_URI) {
  console.error('Missing DB_URI environment variable');
  process.exit(1);
}
mongoose.connect(DB_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => {
    console.error('❌ Failed to connect to MongoDB:', err);
    process.exit(1);
  });

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/healthdata', healthDataRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ocr', ocrRoutes);

// Debug Logging Middleware (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`📌 ${req.method} Request to ${req.url}`);
    next();
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


