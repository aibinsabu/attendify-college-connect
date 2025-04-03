
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
const { useMockDatabase } = getDatabaseConfig();

// Initialize the appropriate database
async function initializeDatabase() {
  try {
    if (useMockDatabase) {
      console.log('🌐 Running in browser environment, using mock database');
      await mockDb.connect();
      toast.info('Connected to mock database');
    } else {
      console.log('🌐 Connecting to real MongoDB database');
      await connectToDatabase();
      await createIndexes();
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    toast.error('Failed to connect to database');
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
