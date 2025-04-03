
import { Schema, model, models, Model, Document } from 'mongoose';

export interface IAttendance extends Document {
  student: Schema.Types.ObjectId;
  class: string;
  subject: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  markedBy?: Schema.Types.ObjectId;
  markedAt: Date;
  markedVia: 'scanner' | 'manual' | 'code';
  verificationMedia?: string;
  note?: string;
}

// Define the attendance schema
const attendanceSchema = new Schema<IAttendance>({
  student: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
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
    required: function(this: IAttendance) { return this.markedVia === 'code'; }
  },
  note: String
});

// Create composite index for unique attendance records per student per day per subject
attendanceSchema.index({ student: 1, date: 1, subject: 1 }, { unique: true });

// Static method to calculate attendance percentage
attendanceSchema.statics.calculateAttendancePercentage = async function(
  studentId: Schema.Types.ObjectId, 
  classId: string
) {
  const totalClasses = await this.countDocuments({ class: classId });
  const presentClasses = await this.countDocuments({ 
    student: studentId,
    class: classId,
    status: 'present'
  });
  
  if (totalClasses === 0) return 0;
  return (presentClasses / totalClasses) * 100;
};

// Pre-save middleware to update the 'markedAt' field
attendanceSchema.pre('save', function(next) {
  this.markedAt = new Date();
  next();
});

// Create and export the Attendance model
let Attendance: Model<IAttendance>;
try {
  // Check if the model is already defined
  Attendance = models.Attendance || model<IAttendance>('Attendance', attendanceSchema);
} catch (error) {
  // If there's an error, create the model directly
  Attendance = model<IAttendance>('Attendance', attendanceSchema);
}

export { Attendance };
export default Attendance;
