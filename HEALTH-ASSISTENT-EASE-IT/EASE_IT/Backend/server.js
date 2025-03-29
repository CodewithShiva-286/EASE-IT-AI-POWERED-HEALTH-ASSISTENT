// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import API routes
const authRoutes = require('./routes/auth');
const healthDataRoutes = require('./routes/healthdata');
const chatbotRoutes = require('./routes/chatRoutes');
const ocrRoutes = require('./routes/ocrRoutes'); // OCR route

const app = express();
const PORT = process.env.PORT || 3000;  // ✅ Changed to port 3000
const DB_URI = process.env.DB_URI;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;  // ✅ Load Gemini API Key

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));  // ✅ Allows frontend requests
app.use(express.json({ limit: '50mb' }));  
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
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

app.get('/api/get-key', (req, res) => {
  res.json({ apiKey: process.env.GEMINI_API_KEY || null });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/healthdata', healthDataRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ocr', ocrRoutes);

// Debug Logging Middleware
app.use((req, res, next) => {
  console.log(`📌 ${req.method} Request to ${req.url}`);
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


