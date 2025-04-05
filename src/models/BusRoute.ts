
import { Schema, model, models, Model, Document } from 'mongoose';
import getDatabaseConfig from '@/config/database';

const { useMockDatabase } = getDatabaseConfig();

interface IStop {
  name: string;
  time: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface IAnnouncement {
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  createdBy: Schema.Types.ObjectId;
  createdAt: Date;
  read: Schema.Types.ObjectId[];
}

export interface IBusRoute extends Document {
  routeName: string;
  routeNumber: string;
  driverName: string;
  driverContact: string;
  startLocation: string;
  endLocation: string;
  stops: IStop[];
  active: boolean;
  busCapacity: number;
  assignedStudents: Schema.Types.ObjectId[];
  departureTime: string;
  arrivalTime: string;
  operationDays: string[];
  announcements: IAnnouncement[];
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for route stop
const stopSchema = new Schema<IStop>({
  name: String,
  time: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});

// Define the schema for route announcement
const announcementSchema = new Schema<IAnnouncement>({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  read: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
});

// Define the bus route schema
const busRouteSchema = new Schema<IBusRoute>({
  routeName: {
    type: String,
    required: true,
    trim: true
  },
  routeNumber: {
    type: String,
    required: true,
    unique: true
  },
  driverName: {
    type: String,
    required: true
  },
  driverContact: {
    type: String,
    required: true
  },
  startLocation: {
    type: String,
    required: true
  },
  endLocation: {
    type: String,
    required: true
  },
  stops: [stopSchema],
  active: {
    type: Boolean,
    default: true
  },
  busCapacity: {
    type: Number,
    required: true
  },
  assignedStudents: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  departureTime: {
    type: String,
    required: true,
    default: '08:00 AM'
  },
  arrivalTime: {
    type: String,
    required: true,
    default: '05:00 PM'
  },
  operationDays: {
    type: [String],
    default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  },
  announcements: [announcementSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Skip all mongoose model operations if we're in a browser environment
// This prevents mongoose from running Node.js specific code in the browser
let BusRoute: Model<IBusRoute>;

if (typeof window !== 'undefined') {
  // Create a minimal mock model for client-side
  BusRoute = {} as Model<IBusRoute>;
} else {
  try {
    // Only add indexes and middleware if we're in a Node.js environment
    // Index for faster queries
    busRouteSchema.index({ routeNumber: 1 }, { unique: true });
    busRouteSchema.index({ active: 1 });

    // Pre-save middleware to update the 'updatedAt' field
    busRouteSchema.pre('save', function(next) {
      this.updatedAt = new Date();
      next();
    });

    // Check if the model is already defined
    BusRoute = models.BusRoute || model<IBusRoute>('BusRoute', busRouteSchema);
  } catch (error) {
    // If there's an error, create the model directly
    console.error('Error initializing BusRoute model:', error);
    BusRoute = {} as Model<IBusRoute>; // Fallback to empty model
  }
}

export { BusRoute };
export default BusRoute;
