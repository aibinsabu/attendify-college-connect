
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB Connection URI - use auth if credentials are provided
const MONGODB_USER = process.env.VITE_MONGODB_USER || process.env.MONGODB_USER;
const MONGODB_PASSWORD = process.env.VITE_MONGODB_PASSWORD || process.env.MONGODB_PASSWORD;
let MONGODB_URI = process.env.VITE_MONGODB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/college_management';

// Add authentication if credentials are provided
if (MONGODB_USER && MONGODB_PASSWORD) {
  // Extract protocol and rest of the URI
  const [protocol, rest] = MONGODB_URI.split('://');
  MONGODB_URI = `${protocol}://${MONGODB_USER}:${MONGODB_PASSWORD}@${rest}`;
}

// Track connection status
let isConnected = false;
let connectionRetries = 0;
const MAX_RETRIES = 5;

/**
 * Connect to MongoDB with retry logic
 */
async function connectToDatabase() {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return mongoose.connection;
  }

  try {
    console.log(`🔄 Connecting to MongoDB at ${MONGODB_URI.replace(/\/\/(.+?):(.+?)@/, '//******:******@')}`);
    
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 2,  // Maintain at least 2 socket connections
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      retryWrites: true,
      serverSelectionTimeoutMS: 10000 // Timeout server selection after 10 seconds
    });

    // Set up connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      isConnected = false;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('❌ MongoDB disconnected');
      isConnected = false;
      
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

    isConnected = true;
    connectionRetries = 0;
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    // Implement retry logic with exponential backoff
    if (connectionRetries < MAX_RETRIES) {
      const timeout = Math.pow(2, connectionRetries) * 1000;
      console.log(`🔄 Retrying connection in ${timeout/1000} seconds...`);
      
      return new Promise((resolve, reject) => {
        setTimeout(async () => {
          connectionRetries++;
          try {
            const connection = await connectToDatabase();
            resolve(connection);
          } catch (err) {
            reject(err);
          }
        }, timeout);
      });
    }
    
    // If all retries failed, propagate the error
    console.error(`❌ Failed to connect after ${MAX_RETRIES} attempts. Exiting.`);
    process.exit(1);
  }
}

/**
 * Check if the database is healthy
 */
async function checkDatabaseHealth() {
  if (!isConnected) {
    return { status: 'disconnected', message: 'Not connected to database' };
  }
  
  try {
    // Simple ping to check if database is responsive
    await mongoose.connection.db.admin().ping();
    return { status: 'healthy', message: 'Database is responsive' };
  } catch (error) {
    return { status: 'unhealthy', message: error.message };
  }
}

/**
 * Create indexes for all collections
 */
async function createIndexes() {
  if (!isConnected) {
    await connectToDatabase();
  }
  
  try {
    console.log('🔄 Creating database indexes...');
    // No need to manually define indexes here as they are defined in the schema
    return true;
  } catch (error) {
    console.error('❌ Failed to create indexes:', error);
    return false;
  }
}

module.exports = {
  connectToDatabase,
  getConnectionStatus: () => isConnected,
  checkDatabaseHealth,
  createIndexes
};
