
import { Schema, model, models, Model, Document } from 'mongoose';

export interface IMark extends Document {
  student: Schema.Types.ObjectId;
  subject: string;
  exam: string;
  marks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  addedBy: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Define the mark schema
const markSchema = new Schema<IMark>({
  student: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
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

// Pre-save middleware to calculate percentage and grade
markSchema.pre('save', function(next) {
  // Calculate percentage
  if (this.isModified('marks') || this.isModified('totalMarks')) {
    this.percentage = (this.marks / this.totalMarks) * 100;
    
    // Determine grade based on percentage
    if (this.percentage >= 90) this.grade = 'A+';
    else if (this.percentage >= 80) this.grade = 'A';
    else if (this.percentage >= 70) this.grade = 'B+';
    else if (this.percentage >= 60) this.grade = 'B';
    else if (this.percentage >= 50) this.grade = 'C';
    else if (this.percentage >= 40) this.grade = 'D';
    else this.grade = 'F';
  }
  
  // Update the 'updatedAt' field
  this.updatedAt = new Date();
  next();
});

// Create and export the Mark model
let Mark: Model<IMark>;
try {
  // Check if the model is already defined
  Mark = models.Mark || model<IMark>('Mark', markSchema);
} catch (error) {
  // If there's an error, create the model directly
  Mark = model<IMark>('Mark', markSchema);
}

export { Mark };
export default Mark;
