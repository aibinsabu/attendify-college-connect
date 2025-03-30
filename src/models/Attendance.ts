
import mongoose from 'mongoose';

// Define the attendance schema
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
    type: String, // URL to photo or video
    required: function() { return this.markedVia === 'code'; }
  },
  note: String
});

// Create composite index for unique attendance records per student per day per subject
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

// Create and export the Attendance model
// Fix the model creation to prevent errors
let Attendance;
try {
  // Check if the model already exists to prevent recompilation error
  Attendance = mongoose.model('Attendance');
} catch (error) {
  // Model doesn't exist yet, so create it
  Attendance = mongoose.model('Attendance', attendanceSchema);
}

export { Attendance };
export default Attendance;
