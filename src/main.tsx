import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import apiHandler from './lib/apiHandler.ts';
import { connectToDatabase } from './lib/mongodb.ts';
import mockDb from './lib/mockDb.ts';

// Initialize the API handler (simulated API endpoints)
apiHandler.initializeRoutes();

// Initialize database connection - use mock DB in browser environment
if (typeof window !== 'undefined') {
  console.log('🌐 Running in browser environment, using mock database');
  mockDb.connect().catch(console.error);
} else {
  // This won't run in the browser, but we keep it for clarity
  console.log('🖥️ Running in Node.js environment, using real MongoDB');
  connectToDatabase().catch(console.error);
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(<App />);
