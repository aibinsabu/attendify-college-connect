
import mongoose from 'mongoose';
import { toast } from 'sonner';
import getDatabaseConfig from '@/config/database';

// Get database configuration
const { mongodbUri } = getDatabaseConfig();

// Global variables to track connection status
let isConnected = false;
let connectionPromise: Promise<mongoose.Connection> | null = null;
let dbConnection: mongoose.Connection | null = null;

/**
 * Connect to MongoDB database with connection pooling support
 */
export async function connectToDatabase(): Promise<mongoose.Connection> {
  // Return existing connection if already established
  if (isConnected && dbConnection) {
    console.log('✅ Using existing database connection');
    return dbConnection;
  }

  // Return in-progress connection attempt if one exists
  if (connectionPromise) {
    console.log('🔄 Connection attempt in progress, waiting...');
    return connectionPromise;
  }

  try {
    console.log('🔄 Establishing new MongoDB connection...');
    // Create a new connection promise
    connectionPromise = new Promise(async (resolve, reject) => {
      try {
        // Set mongoose options for better connection handling
        mongoose.set('strictQuery', false);
        
        // Connect to MongoDB
        const mongooseInstance = await mongoose.connect(mongodbUri, {
          maxPoolSize: 10, // Maintain up to 10 socket connections
          minPoolSize: 2,  // Maintain at least 2 socket connections
          socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
          connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
          retryWrites: true,
          serverSelectionTimeoutMS: 10000 // Timeout server selection after 10 seconds
        });
        
        // Get the default connection
        dbConnection = mongooseInstance.connection;
        
        // Set up connection event handlers
        dbConnection.on('connected', () => {
          console.log('✅ Successfully connected to MongoDB');
          isConnected = true;
          toast.success('Connected to MongoDB');
        });
        
        dbConnection.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err);
          toast.error('Database connection failed');
          isConnected = false;
        });
        
        dbConnection.on('disconnected', () => {
          console.log('❌ MongoDB disconnected');
          isConnected = false;
          connectionPromise = null; // Reset the promise on disconnect
        });
        
        console.log('✅ New database connection established');
        isConnected = true;
        resolve(dbConnection);
      } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        connectionPromise = null;
        reject(error);
      }
    });
    
    return await connectionPromise;
  } catch (error) {
    connectionPromise = null;
    console.error('❌ Failed to connect to database:', error);
    toast.error('Could not connect to database');
    throw error;
  }
}

/**
 * Get the current connection status
 */
export function getConnectionStatus() {
  return isConnected;
}

/**
 * Get the current database connection
 */
export function getDbConnection() {
  return dbConnection;
}

/**
 * Function to use in browser environments for backward compatibility
 * If in browser, returns null, otherwise connects to MongoDB
 */
export function useMongoDBorMock() {
  // If in browser, use mock database
  if (typeof window !== 'undefined') {
    console.log('🌐 Browser environment detected, using mock database');
    return null;
  }
  
  // If server-side, use real MongoDB
  return connectToDatabase();
}

/**
 * Create appropriate indexes for all collections
 * This ensures optimal query performance
 */
export async function createIndexes() {
  try {
    const conn = await connectToDatabase();
    console.log('Creating database indexes...');
    // No need to manually create indexes as they are defined in the schema
    return true;
  } catch (error) {
    console.error('Failed to create indexes:', error);
    return false;
  }
}
