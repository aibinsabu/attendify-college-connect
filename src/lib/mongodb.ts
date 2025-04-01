
import mongoose from 'mongoose';
import { toast } from 'sonner';

// In browser environments, we won't have process.env available
// so we'll set a fallback value that won't be used (the mockDb will be used instead)
const MONGODB_URI = typeof window === 'undefined' 
  ? (process.env.MONGODB_URI || 'mongodb://localhost:27017/college_management')
  : 'mongodb://localhost:27017/college_management';

// Global variable to track connection status
let isConnected = false;
let dbConnection: mongoose.Connection | null = null;

export async function connectToDatabase() {
  // In browser environments, we shouldn't try to connect to MongoDB directly
  if (typeof window !== 'undefined') {
    console.log('✅ Browser environment detected, skipping real MongoDB connection');
    return null;
  }

  if (isConnected && dbConnection) {
    console.log('✅ Using existing database connection');
    return dbConnection;
  }

  try {
    // Connect to MongoDB using mongoose
    await mongoose.connect(MONGODB_URI);
    
    // Get the default connection
    dbConnection = mongoose.connection;
    
    // Set up connection event handlers
    dbConnection.on('connected', () => {
      console.log('✅ Successfully connected to MongoDB');
      isConnected = true;
    });
    
    dbConnection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      toast.error('Database connection failed');
      isConnected = false;
    });
    
    dbConnection.on('disconnected', () => {
      console.log('❌ MongoDB disconnected');
      isConnected = false;
    });
    
    console.log('✅ New database connection established');
    isConnected = true;
    return dbConnection;
  } catch (error) {
    console.error('❌ Failed to connect to database:', error);
    toast.error('Could not connect to database');
    throw error;
  }
}

export function getConnectionStatus() {
  return isConnected;
}

export function getDbConnection() {
  return dbConnection;
}
