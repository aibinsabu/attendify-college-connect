
import { Schema, model, models, Model } from 'mongoose';

// Define the schema for timetable slot
const timeTableSlotSchema = new Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    type: String,
    required: true
  },
  class: {
    type: String,
    required: true
  },
  batch: String,
  section: String
});

// Define the timetable schema
const timeTableSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  semester: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  slots: [timeTableSlotSchema],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: true
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

// Create compound index for faster queries
timeTableSchema.index({ academicYear: 1, semester: 1, department: 1 });

// Create and export the TimeTable model
let TimeTable: Model<any>;
try {
  // Check if the model is already defined
  TimeTable = models.TimeTable || model('TimeTable', timeTableSchema);
} catch (error) {
  // If there's an error, create the model directly
  TimeTable = model('TimeTable', timeTableSchema);
}

export { TimeTable };
export default TimeTable;
