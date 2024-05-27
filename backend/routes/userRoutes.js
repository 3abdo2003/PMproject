const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Route to get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to check if the user is an admin
router.get('/admin', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    res.json({ message: 'Welcome Admin!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;