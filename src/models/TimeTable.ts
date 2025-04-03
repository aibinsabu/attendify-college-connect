
import { Schema, model, models, Model, Document } from 'mongoose';

interface ITimeTableSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
  subject: string;
  faculty: Schema.Types.ObjectId;
  location: string;
  class: string;
  batch?: string;
  section?: string;
}

export interface ITimeTable extends Document {
  name: string;
  academicYear: string;
  semester: string;
  department: string;
  slots: ITimeTableSlot[];
  createdBy: Schema.Types.ObjectId;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for timetable slot
const timeTableSlotSchema = new Schema<ITimeTableSlot>({
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
const timeTableSchema = new Schema<ITimeTable>({
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
timeTableSchema.index({ active: 1 });
timeTableSchema.index({ 'slots.faculty': 1 });

// Pre-save middleware to update the 'updatedAt' field
timeTableSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Create and export the TimeTable model
let TimeTable: Model<ITimeTable>;
try {
  // Check if the model is already defined
  TimeTable = models.TimeTable || model<ITimeTable>('TimeTable', timeTableSchema);
} catch (error) {
  // If there's an error, create the model directly
  TimeTable = model<ITimeTable>('TimeTable', timeTableSchema);
}

export { TimeTable };
export default TimeTable;
