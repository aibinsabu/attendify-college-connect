
import mongoose from 'mongoose';
import { toast } from 'sonner';
import getDatabaseConfig from '@/config/database';

// Get database configuration
const { mongodbUri, useMockDatabase } = getDatabaseConfig();

// Global variables to track connection status
let isConnected = false;
let connectionPromise: Promise<mongoose.Connection> | null = null;
let dbConnection: mongoose.Connection | null = null;
let connectionRetries = 0;
const MAX_RETRIES = 3;

/**
 * Connect to MongoDB database with connection pooling and retry logic
 */
export async function connectToDatabase(): Promise<mongoose.Connection> {
  // If using mock database, return null since we don't need a real connection
  if (useMockDatabase) {
    console.log('🚫 Using mock database, no MongoDB connection needed');
    isConnected = true;
    return null as any;
  }

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
        // Hide sensitive credentials in logs
        const displayUri = mongodbUri.includes('@') 
          ? mongodbUri.replace(/\/\/(.+?):(.+?)@/, '//******:******@') 
          : mongodbUri;
        console.log(`🔄 Connecting to MongoDB at ${displayUri}`);
        
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
          connectionRetries = 0;
        });
        
        dbConnection.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err);
          toast.error('Database connection error');
          isConnected = false;
        });
        
        dbConnection.on('disconnected', () => {
          console.log('❌ MongoDB disconnected');
          isConnected = false;
          connectionPromise = null; // Reset the promise on disconnect
          
          // Auto-reconnect with backoff if disconnected
          if (connectionRetries < MAX_RETRIES) {
            const timeout = Math.pow(2, connectionRetries) * 1000;
            console.log(`🔄 Attempting reconnection in ${timeout/1000} seconds...`);
            
            setTimeout(() => {
              connectionRetries++;
              connectToDatabase().catch(err => {
                console.error('❌ Reconnection attempt failed:', err);
              });
            }, timeout);
          }
        });
        
        console.log('✅ New database connection established');
        isConnected = true;
        resolve(dbConnection);
      } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        connectionPromise = null;
        
        // Implement retry logic with exponential backoff
        if (connectionRetries < MAX_RETRIES) {
          const timeout = Math.pow(2, connectionRetries) * 1000;
          console.log(`🔄 Retrying connection in ${timeout/1000} seconds...`);
          
          setTimeout(async () => {
            connectionRetries++;
            try {
              const conn = await connectToDatabase();
              resolve(conn);
            } catch (err) {
              reject(err);
            }
          }, timeout);
        } else {
          reject(error);
        }
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
  const { useMockDatabase } = getDatabaseConfig();
  
  // If using mock database, return null
  if (useMockDatabase) {
    console.log('🌐 Using mock database');
    return null;
  }
  
  // If client-side and not using mock DB, warn about potential issues
  if (typeof window !== 'undefined' && !useMockDatabase) {
    console.warn('⚠️ Attempting to use MongoDB in browser environment');
    return null;
  }
  
  // If server-side or explicitly allowed in browser, use real MongoDB
  return connectToDatabase();
}

/**
 * Check if the database is healthy
 */
export async function checkDatabaseHealth() {
  if (useMockDatabase) {
    return { status: 'mock', message: 'Using mock database' };
  }
  
  if (!isConnected || !dbConnection) {
    return { status: 'disconnected', message: 'Not connected to database' };
  }
  
  try {
    // Simple query to check if database is responsive
    await mongoose.connection.db.admin().ping();
    return { status: 'healthy', message: 'Database is responsive' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}

/**
 * Create appropriate indexes for all collections
 * This ensures optimal query performance
 */
export async function createIndexes() {
  if (useMockDatabase) {
    console.log('Using mock database, skipping index creation');
    return true;
  }
  
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
