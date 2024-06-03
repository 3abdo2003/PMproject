const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Token = require('../models/Token');
const router = express.Router();

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, country, nationalID, passportNumber, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !country || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate nationalID or passportNumber based on country
    if (country.toUpperCase() === 'EG' && !nationalID) {
      return res.status(400).json({ message: 'National ID is required for users from Egypt' });
    }
    if (country.toUpperCase() !== 'EG' && !passportNumber) {
      return res.status(400).json({ message: 'Passport number is required for users not from Egypt' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = {
      firstName,
      lastName,
      email,
      phone,
      country,
      password: hashedPassword,
    };

    // Conditionally add nationalID or passportNumber
    if (country.toUpperCase() === 'EG') {
      newUser.nationalID = nationalID;
    } else {
      newUser.passportNumber = passportNumber;
    }

    // Save the user to the database
    const user = new User(newUser);
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !await bcrypt.compare(password, user.password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      userId: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    const newToken = new Token({ token, userId: user._id });
    await newToken.save(); // Save the token with userId to the database

    res.json({ token, user: { userId: user._id, role: user.role, email: user.email } });
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

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword; // Save the hashed password
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
