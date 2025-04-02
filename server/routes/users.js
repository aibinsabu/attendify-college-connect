
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search students
router.get('/search/students', async (req, res) => {
  try {
    const { name, studentClass, batch, rollNo } = req.query;
    
    const query = { role: 'student' };
    
    if (name) {
      query.name = { $regex: name, $options: 'i' };
    }
    
    if (studentClass) {
      query.studentClass = studentClass;
    }
    
    if (batch) {
      query.batch = batch;
    }
    
    if (rollNo) {
      query.rollNo = rollNo;
    }
    
    const students = await User.find(query).select('-password');
    
    res.status(200).json(students);
  } catch (error) {
    console.error('Error searching students:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update student
router.put('/student/:id', async (req, res) => {
  try {
    const updatedStudent = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-password');
    
    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
