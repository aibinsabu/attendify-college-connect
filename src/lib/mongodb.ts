
import mongoose from 'mongoose';
import { toast } from 'sonner';
import getDatabaseConfig from '@/config/database';

// Get database configuration
const { mongodbUri, useMockDatabase } = getDatabaseConfig();

// Global variables to track connection status
let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;
let connectionRetries = 0;
const MAX_RETRIES = 3;

/**
 * Connect to MongoDB database with connection pooling and retry logic
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // If using mock database or in browser environment, return null
  if (useMockDatabase || typeof window !== 'undefined') {
    console.log('🚫 Using mock database or running in browser, no MongoDB connection needed');
    isConnected = true;
    return mongoose;
  }

  // Return existing connection if already established
  if (isConnected) {
    console.log('✅ Using existing database connection');
    return mongoose;
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
        
        // Connect to MongoDB using the correct syntax for mongoose v8+
        await mongoose.connect(mongodbUri);
        
        // Set up connection event handlers
        mongoose.connection.on('connected', () => {
          console.log('✅ Successfully connected to MongoDB');
          isConnected = true;
          if (typeof window !== 'undefined') {
            toast.success('Connected to MongoDB');
          }
          connectionRetries = 0;
        });
        
        mongoose.connection.on('error', (err) => {
          console.error('❌ MongoDB connection error:', err);
          if (typeof window !== 'undefined') {
            toast.error('Database connection error');
          }
          isConnected = false;
        });
        
        mongoose.connection.on('disconnected', () => {
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
        resolve(mongoose);
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
    if (typeof window !== 'undefined') {
      toast.error('Could not connect to database');
    }
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
  return mongoose.connection;
}

/**
 * Check if the database is healthy
 */
export async function checkDatabaseHealth() {
  if (useMockDatabase || typeof window !== 'undefined') {
    return { status: 'mock', message: 'Using mock database or running in browser' };
  }
  
  if (!isConnected) {
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
  if (useMockDatabase || typeof window !== 'undefined') {
    console.log('Using mock database or running in browser, skipping index creation');
    return true;
  }
  
  try {
    await connectToDatabase();
    console.log('Creating database indexes...');
    // No need to manually create indexes as they are defined in the schema
    return true;
  } catch (error) {
    console.error('Failed to create indexes:', error);
    return false;
  }
}
