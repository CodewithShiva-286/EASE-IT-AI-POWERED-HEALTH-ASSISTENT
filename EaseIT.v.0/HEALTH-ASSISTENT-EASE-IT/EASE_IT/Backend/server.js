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
const ocrRoutes = require('./routes/ocrRoutes'); // Import OCR route

const app = express();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.DB_URI;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));  // ✅ Allow larger payloads for images
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

// Serve static frontend files from the "public" folder
app.use(express.static(path.join(__dirname, '../public')));

// Default route: Serve the landing page (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/healthdata', healthDataRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/ocr', ocrRoutes); // New OCR API endpoint

// Debug Logging Middleware (Optional - for debugging API calls)
app.use((req, res, next) => {
  console.log(`📌 ${req.method} Request to ${req.url}`);
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

