
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  class: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    required: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  markedAt: {
    type: Date,
    default: Date.now
  },
  markedVia: {
    type: String,
    enum: ['scanner', 'manual', 'code'],
    default: 'manual'
  },
  verificationMedia: {
    type: String,
    required: function() { return this.markedVia === 'code'; }
  },
  note: String
});

// Create composite index for unique attendance records
attendanceSchema.index({ student: 1, date: 1, subject: 1 }, { unique: true });

// Method to calculate attendance percentage
attendanceSchema.statics.calculateAttendancePercentage = async function(studentId, classId) {
  const totalClasses = await this.countDocuments({ class: classId });
  const presentClasses = await this.countDocuments({ 
    student: studentId,
    class: classId,
    status: 'present'
  });
  
  if (totalClasses === 0) return 0;
  return (presentClasses / totalClasses) * 100;
};

module.exports = mongoose.model('Attendance', attendanceSchema);
