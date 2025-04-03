
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectToDatabase, createIndexes } = require('./lib/mongodb');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB and create indexes
async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log('✅ Connected to MongoDB');
    
    // Create indexes for all collections
    await createIndexes();
    console.log('✅ Database indexes created/verified');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}

// Initialize database
initializeDatabase();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/marks', require('./routes/marks'));
app.use('/api/busroutes', require('./routes/busRoutes'));

// Health check route
app.get('/api/health', async (req, res) => {
  const dbStatus = await require('./lib/mongodb').checkDatabaseHealth();
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    database: dbStatus
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
