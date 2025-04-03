
const mongoose = require('mongoose');

// Define the schema for route stop
const stopSchema = new mongoose.Schema({
  name: String,
  time: String,
  coordinates: {
    lat: Number,
    lng: Number
  }
});

// Define the schema for route announcement
const announcementSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  read: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

const busRouteSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
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

// Index for faster queries
busRouteSchema.index({ routeNumber: 1 }, { unique: true });
busRouteSchema.index({ active: 1 });

// Pre-save middleware to update the 'updatedAt' field
busRouteSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('BusRoute', busRouteSchema);
