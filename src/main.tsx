
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import apiHandler from './lib/apiHandler.ts';
import mockDb from './lib/mockDb.ts';
import { connectToDatabase } from './lib/mongodb.ts';
import getDatabaseConfig from './config/database.ts';

// Determine which database to use
const { useMockDatabase } = getDatabaseConfig();

// Initialize the appropriate database
if (useMockDatabase) {
  console.log('🌐 Running in browser environment, using mock database');
  mockDb.connect().catch(console.error);
} else {
  console.log('🌐 Connecting to real MongoDB database');
  connectToDatabase().catch(console.error);
}

// Initialize the API handler (simulated API endpoints)
apiHandler.initializeRoutes();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
