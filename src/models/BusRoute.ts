
import mongoose from 'mongoose';

// Define the bus route schema
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
  stops: [{
    name: String,
    time: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  }],
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create and export the BusRoute model using the safe approach
let BusRoute;
try {
  // Check if the model already exists
  if (mongoose.models && mongoose.models.BusRoute) {
    BusRoute = mongoose.models.BusRoute;
  } else if (mongoose.connection.models && mongoose.connection.models.BusRoute) {
    BusRoute = mongoose.connection.models.BusRoute;
  } else {
    // Model doesn't exist yet, so create it
    BusRoute = mongoose.connection.model('BusRoute', busRouteSchema);
  }
} catch (error) {
  console.error("Error creating BusRoute model:", error);
  // Fallback - create the model but it might not be connected to the DB
  BusRoute = mongoose.model('BusRoute', busRouteSchema);
}

export { BusRoute };
export default BusRoute;
