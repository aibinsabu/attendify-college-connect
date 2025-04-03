
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB Connection URI
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/college_management';

// Track connection status
let isConnected = false;

async function connectToDatabase() {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return mongoose.connection;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      // Connection options if needed
    });

    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = {
  connectToDatabase,
  getConnectionStatus: () => isConnected
};
