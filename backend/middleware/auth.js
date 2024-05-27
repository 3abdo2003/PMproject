const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

module.exports = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Authentication token missing or invalid');
    }

    // Extract token from Authorization header
    const token = authHeader.replace('Bearer ', '');
  
    // Query the database for the token
    const tokenRecord = await Token.findOne({ token });
    if (!tokenRecord) {
      throw new Error('Invalid token');
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET);

    // Set the decoded user object on the request for further processing
    req.user = { userId: tokenRecord.userId };
    next();
  } catch (error) {
    // Send more specific error messages based on the error type
    let errorMessage = 'Authentication balabizo';
    if (error.name === 'JsonWebTokenError') {
      errorMessage = 'Invalid token';
    } else if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token expired';
    }

    res.status(401).json({ message: errorMessage });
  }
};
