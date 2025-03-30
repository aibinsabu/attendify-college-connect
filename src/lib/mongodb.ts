
import mongoose from 'mongoose';
import { toast } from 'sonner';

const MONGODB_URI = 'mongodb://localhost:27017/college_management';

// Global variable to track connection status
let isConnected = false;
let dbConnection: mongoose.Connection | null = null;

export async function connectToDatabase() {
  if (isConnected && dbConnection) {
    console.log('✅ Using existing database connection');
    return dbConnection;
  }

  try {
    // Attempt to connect to MongoDB
    const connection = await mongoose.connect(MONGODB_URI, {
      // These options help with connection stability
      serverSelectionTimeoutMS: 5000,
      retryWrites: true
    });
    
    // Get the default connection
    dbConnection = connection.connection;
    
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
