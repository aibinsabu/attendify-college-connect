
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Find user in database
    const user = await User.findOne({ email, role });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Compare hashed passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Return user data (without password)
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }
    
    // Hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create new user with hashed password
    const newUser = new User({
      ...req.body,
      password: hashedPassword
    });
    
    await newUser.save();
    
    // Return created user data (without password)
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
