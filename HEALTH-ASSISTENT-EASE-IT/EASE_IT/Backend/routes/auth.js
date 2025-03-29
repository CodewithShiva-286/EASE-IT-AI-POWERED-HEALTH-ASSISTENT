const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Hash the password and create the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword });
    await newUser.save();
    
    // Generate a JWT token upon successful registration
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username },
      process.env.JWT_SECRET || 'mySuperSecretKey123'
    );
    
    // Return success response with username and token
    res.status(201).json({ message: 'User registered successfully', username: newUser.username, token });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(400).json({ error: 'Error registering user' });
  }
});

// Login route remains unchanged...
router.post('/login', async (req, res) => {
  const { email, password } = req.body; // Using email for login
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        { userId: user._id, username: user.username },
        process.env.JWT_SECRET || 'mySuperSecretKey123'
      );
      res.json({ token, username: user.username });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(400).json({ error: 'Error during login' });
  }
});

module.exports = router;

