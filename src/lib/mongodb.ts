
import mongoose from 'mongoose';
import { toast } from 'sonner';

const MONGODB_URI = 'mongodb://localhost:27017/college_management';

// Global variable to track connection status
let isConnected = false;
// Create a shared connection variable
let dbConnection: mongoose.Connection | null = null;

export async function connectToDatabase() {
  if (isConnected && dbConnection) {
    console.log('Using existing database connection');
    return dbConnection;
  }

  try {
    // Create a new connection
    await mongoose.connect(MONGODB_URI);
    
    // Get the default connection
    dbConnection = mongoose.connection;
    
    isConnected = true;
    console.log('New database connection established');
    
    // Set up connection event handlers
    dbConnection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      toast.error('Database connection error');
      isConnected = false;
      dbConnection = null;
    });
    
    dbConnection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
      dbConnection = null;
    });
    
    return dbConnection;
  } catch (error) {
    console.error('Database connection error:', error);
    toast.error('Failed to connect to database');
    throw error;
  }
}

export function getConnectionStatus() {
  return isConnected;
}

export function getDbConnection() {
  return dbConnection;
}
