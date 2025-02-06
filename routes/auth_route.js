const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const { generateToken, hashPassword, comparePassword, setTokenCookie } = require('../middlewares/Auth');
const Joi = require('joi');

// Joi schema for registration
const registrationSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
  
  
});

// Joi schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Registration Route
router.post('/register', async (req, res) => {
  try {
    // Validate input
    const { error, value } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user already exists
    const checkUser = await User.findOne({ email: value.email });
    if (checkUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password
    //const hashedPassword = await hashPassword(value.password);
    
    // Create new user
    const newUser = new User({
      name: value.name,
      email: value.email,
      password: value.password,
      role: value.role,
    });

    // Save user to database
    await newUser.save();
    
    // Send success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    // Validate input
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Find user by email
    const user = await User.findOne({ email: value.email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await comparePassword(value.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    // Set token in cookie
    setTokenCookie(res, token);

    // Send success response
    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  res.clearCookie('access_token');
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;
