const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Token = require('../models/Token');
const router = express.Router();

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, nationalID, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({
      firstName,
      lastName,
      email,
      phone,
      nationalID,
      password, // Saving password as it is
    });

    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if passwords match
    if (user.password !== password) return res.status(400).json({ message: 'Invalid credentials' });

    // Create and save token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const newToken = new Token({ userId: user._id, token });
    await newToken.save();

    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Password reset route
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Reset password without hashing or salting
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
