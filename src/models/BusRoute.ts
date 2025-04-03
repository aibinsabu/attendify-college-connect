
import { Schema, model, models, Model } from 'mongoose';

// Define the schema for route stop
const stopSchema = new Schema({
  name: String,
  time: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});

// Define the schema for route announcement
const announcementSchema = new Schema({
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
const busRouteSchema = new Schema({
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

// Create and export the BusRoute model
let BusRoute: Model<any>;
try {
  // Check if the model is already defined
  BusRoute = models.BusRoute || model('BusRoute', busRouteSchema);
} catch (error) {
  // If there's an error, create the model directly
  BusRoute = model('BusRoute', busRouteSchema);
}

export { BusRoute };
export default BusRoute;
