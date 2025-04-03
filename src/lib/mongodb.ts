
import mongoose from 'mongoose';
import { toast } from 'sonner';
import getDatabaseConfig from '@/config/database';

// Get database configuration
const { mongodbUri } = getDatabaseConfig();

// Global variable to track connection status
let isConnected = false;
let dbConnection: mongoose.Connection | null = null;

export async function connectToDatabase() {
  // If we're already connected, return the existing connection
  if (isConnected && dbConnection) {
    console.log('✅ Using existing database connection');
    return dbConnection;
  }

  try {
    // Connect to MongoDB using mongoose
    const mongooseInstance = await mongoose.connect(mongodbUri);
    
    // Get the default connection
    dbConnection = mongooseInstance.connection;
    
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

// Function to use in browser environments for backward compatibility
export function useMongoDBorMock() {
  // If in browser, use mock database
  if (typeof window !== 'undefined') {
    console.log('🌐 Browser environment detected, using mock database');
    return null;
  }
  
  // If server-side, use real MongoDB
  return connectToDatabase();
}
