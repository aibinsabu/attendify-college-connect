
import { Schema, model, models, Model } from 'mongoose';

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
    type: Schema.Types.ObjectId,
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
