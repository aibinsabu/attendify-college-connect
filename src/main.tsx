
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import apiHandler from './lib/apiHandler.ts';
import { connectToDatabase } from './lib/mongodb.ts';

// Initialize the API handler (simulated API endpoints)
apiHandler.initializeRoutes();

// Initialize database connection
connectToDatabase().catch(console.error);

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(<App />);
