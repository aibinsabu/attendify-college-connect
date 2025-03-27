
import mongoose from 'mongoose';

// Define the bus route schema
const busRouteSchema = new mongoose.Schema({
  routeNumber: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  stops: [{
    name: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    }
  }],
  assignedStaff: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
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

// Create and export the BusRoute model
export const BusRoute = mongoose.models.BusRoute || mongoose.model('BusRoute', busRouteSchema);

export default BusRoute;
