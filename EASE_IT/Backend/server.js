const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: path.join(__dirname, '.env') });
}

// Import API routes
const authRoutes = require('./routes/auth');
const healthDataRoutes = require('./routes/healthData');
const chatbotRoutes = require('./routes/chatRoutes');
const ocrRoutes = require('./routes/ocrRoutes'); // OCR route

const app = express();
const PORT = process.env.PORT || 10000;  // ✅ Changed to port 3000
const DB_URI = process.env.DB_URI;

let cachedDbConnection = null;

// Middleware
app.use(cors({ origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:10000' }));
app.use(express.json({ limit: process.env.JSON_LIMIT || '8mb' }));
app.use(express.urlencoded({ limit: process.env.JSON_LIMIT || '8mb', extended: true }));

// Connect to MongoDB
async function connectToDatabase() {
  if (!DB_URI) {
    throw new Error('Missing DB_URI environment variable');
  }

  if (cachedDbConnection && mongoose.connection.readyState === 1) {
    return cachedDbConnection;
  }

  cachedDbConnection = mongoose.connect(DB_URI);
  await cachedDbConnection;
  console.log('✅ Connected to MongoDB!');
  return cachedDbConnection;
}

const databaseMiddleware = async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
};

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/html/index.html'));
});

// Mount API routes
app.use('/api', databaseMiddleware);
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
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;


