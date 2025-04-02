
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import apiHandler from './lib/apiHandler.ts';
import { connectToDatabase } from './lib/mongodb.ts';
import mockDb from './lib/mockDb.ts';

// Initialize the API handler (simulated API endpoints)
apiHandler.initializeRoutes();

// Initialize database connection - always use mock DB in browser environment
// For server-side, the actual MongoDB connection is handled by the Express server
console.log('🌐 Running in browser environment, using mock database');
mockDb.connect().catch(console.error);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(<App />);
