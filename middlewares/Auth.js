const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Load environment variables
require('dotenv').config();

const JWT_SECRET = process.env.AUTH_SECRET || 'another jwt_secret';
const TOKEN_EXPIRY = '1h'; // Token expires in 1 hour

// Generate JWT token
const generateToken = (user) => {
  if (!user || !user.id) {
    throw new Error('Invalid user object');
  }
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRY }
  );
};


// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return {message: "can't verify this token"};
  }
};

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(403).json({ error: 'Invalid token.' });
  }

  req.user = decoded;
  next();
};

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password with hashed password
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Set token in cookie
const setTokenCookie = (res, token) => {
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 3600000 // 1 hour in milliseconds
  });
};

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
  hashPassword,
  comparePassword,
  setTokenCookie
};
