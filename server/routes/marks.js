
const express = require('express');
const router = express.Router();
const Mark = require('../models/Mark');

// Add or update mark
router.post('/', async (req, res) => {
  try {
    const { student, subject, exam, marks, totalMarks } = req.body;
    
    // Calculate percentage and grade
    const percentage = (marks / totalMarks) * 100;
    
    // Determine grade based on percentage
    let grade = '';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B+';
    else if (percentage >= 60) grade = 'B';
    else if (percentage >= 50) grade = 'C';
    else if (percentage >= 40) grade = 'D';
    else grade = 'F';
    
    // Find and update or create new mark record
    const markRecord = await Mark.findOneAndUpdate(
      { student, subject, exam },
      { ...req.body, percentage, grade },
      { new: true, upsert: true }
    );
    
    res.status(201).json(markRecord);
  } catch (error) {
    console.error('Error saving marks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student marks
router.get('/student/:studentId', async (req, res) => {
  try {
    const marks = await Mark.find({ student: req.params.studentId });
    res.status(200).json(marks);
  } catch (error) {
    console.error('Error fetching marks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
