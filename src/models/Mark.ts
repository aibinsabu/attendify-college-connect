
import { Schema, model, models, Model } from 'mongoose';

// Define the mark schema
const markSchema = new Schema({
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

// Create and export the Mark model
const Mark: Model<any> = models.Mark || model('Mark', markSchema);

export { Mark };
export default Mark;
