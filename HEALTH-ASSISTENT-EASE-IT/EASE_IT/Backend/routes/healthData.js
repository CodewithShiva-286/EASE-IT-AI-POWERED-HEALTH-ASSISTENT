const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route: Update health data for the authenticated user
router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId; // Extracted from the JWT via authMiddleware
  const { healthData } = req.body;

  try {
    const user = await User.findById(userId);
    if (user) {
      // Update each category based on the received healthData
      for (let category in healthData) {
        for (let condition in healthData[category]) {
          user.healthData[category][condition] = healthData[category][condition];
        }
      }
      await user.save();
      res.json({ message: 'Health data updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating health data:', error);
    res.status(400).json({ error: 'Error updating health data' });
  }
});

// Protected route: Get health data for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.userId; // Use the userId from the token
  try {
    const user = await User.findById(userId);
    if (user) {
      res.json({ conditions: user.healthData });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching health data:', error);
    res.status(400).json({ error: 'Error fetching health data' });
  }
});

module.exports = router;
