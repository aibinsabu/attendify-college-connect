
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
    // Fix: Use createConnection or connection.openUri instead of connect directly
    const db = await mongoose.createConnection(MONGODB_URI).asPromise();
    
    isConnected = true;
    console.log('New database connection established');
    
    // Set up connection event handlers
    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      toast.error('Database connection error');
      isConnected = false;
    });
    
    db.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });
    
    // Set the default connection
    mongoose.connection = db;
    
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
