
import mongoose from 'mongoose';
import { toast } from 'sonner';

const MONGODB_URI = 'mongodb://localhost:27017/college_management';

// Global variable to track connection status
let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI);
    
    isConnected = true;
    console.log('New database connection established');
    
    // Set up connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      toast.error('Database connection error');
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });
    
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    toast.error('Failed to connect to database');
    throw error;
  }
}

export function getConnectionStatus() {
  return isConnected;
}
