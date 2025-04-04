
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import apiHandler from './lib/apiHandler.ts';
import mockDb from './lib/mockDb.ts';
import { connectToDatabase, createIndexes } from './lib/mongodb.ts';
import getDatabaseConfig from './config/database.ts';
import { toast } from 'sonner';

// Determine which database to use
const { useMockDatabase, mongodbUri } = getDatabaseConfig();

// Log environment variables
console.log('Environment settings:');
console.log('VITE_USE_MOCK_DB:', import.meta.env.VITE_USE_MOCK_DB);
console.log('Using mock database:', useMockDatabase);
console.log('MongoDB URI:', mongodbUri ? mongodbUri.replace(/\/\/(.+?):(.+?)@/, '//******:******@') : 'Not configured');

// Initialize the appropriate database
async function initializeDatabase() {
  try {
    if (useMockDatabase) {
      console.log('🌐 Running with mock database');
      await mockDb.connect();
      toast.info('Connected to mock database');
    } else {
      console.log('🌐 Connecting to real MongoDB database');
      await connectToDatabase();
      await createIndexes();
      toast.success('Connected to MongoDB database');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    toast.error('Failed to connect to database. Using mock database as fallback.');
    // Fall back to mock database if MongoDB connection fails
    await mockDb.connect();
  }
}

// Initialize the API handler (simulated API endpoints)
apiHandler.initializeRoutes();

// Initialize the application
async function init() {
  // Initialize database
  await initializeDatabase();
  
  // Mount the React application
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error('Root element not found');

  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

// Start the application
init().catch(error => {
  console.error('Application initialization failed:', error);
});
