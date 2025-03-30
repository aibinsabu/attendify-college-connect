import mongoose from 'mongoose';
import { getDbConnection } from '@/lib/mongodb';

// Define the mark schema
const markSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  exam: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  percentage: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  remarks: String,
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create composite index for unique mark records per student per subject per exam
markSchema.index({ student: 1, subject: 1, exam: 1 }, { unique: true });

// Create and export the Mark model using the safe approach
let Mark;
try {
  // Check if the model already exists
  if (mongoose.models && mongoose.models.Mark) {
    Mark = mongoose.models.Mark;
  } else {
    // Get the connection - if not connected yet, will use default connection
    const conn = getDbConnection() || mongoose.connection;
    // Model doesn't exist yet, so create it
    Mark = conn.model('Mark', markSchema);
  }
} catch (error) {
  console.error("Error creating Mark model:", error);
  // Fallback - create the model on default connection
  Mark = mongoose.model('Mark', markSchema);
}

export { Mark };
export default Mark;
