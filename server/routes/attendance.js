
const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');

// Mark attendance by scanner
router.post('/mark/scanner', async (req, res) => {
  try {
    const { studentId, classId, subjectId } = req.body;
    
    const attendance = new Attendance({
      student: studentId,
      class: classId,
      subject: subjectId,
      status: 'present',
      markedVia: 'scanner',
      markedAt: new Date()
    });
    
    const savedAttendance = await attendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark attendance by code
router.post('/mark/code', async (req, res) => {
  try {
    const { studentId, classId, subjectId, verificationMedia } = req.body;
    
    const attendance = new Attendance({
      student: studentId,
      class: classId,
      subject: subjectId,
      status: 'present',
      markedVia: 'code',
      verificationMedia,
      markedAt: new Date()
    });
    
    const savedAttendance = await attendance.save();
    res.status(201).json(savedAttendance);
  } catch (error) {
    console.error('Error marking attendance by code:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get student attendance
router.get('/student/:studentId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ student: req.params.studentId });
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error fetching attendance:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Calculate attendance percentage
router.get('/percentage/:studentId/:classId', async (req, res) => {
  try {
    const { studentId, classId } = req.params;
    
    const totalClasses = await Attendance.countDocuments({ class: classId });
    const attendedClasses = await Attendance.countDocuments({
      student: studentId,
      class: classId,
      status: 'present'
    });
    
    const percentage = totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
    
    res.status(200).json({ percentage });
  } catch (error) {
    console.error('Error calculating attendance percentage:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
