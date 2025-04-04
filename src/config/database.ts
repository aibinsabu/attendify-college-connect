
// Configuration file to determine which database to use
const useMockDatabase = process.env.USE_MOCK_DB === 'true' || 
  import.meta.env.VITE_USE_MOCK_DB === 'true' || 
  (import.meta.env.DEV && typeof window !== 'undefined' && !import.meta.env.VITE_MONGODB_URI);

export const getDatabaseConfig = () => {
  const defaultUri = 'mongodb://localhost:27017/college_management';
  
  // Check for MongoDB credentials
  const user = process.env.MONGODB_USER || import.meta.env.VITE_MONGODB_USER;
  const password = process.env.MONGODB_PASSWORD || import.meta.env.VITE_MONGODB_PASSWORD;
  let uri = process.env.MONGODB_URI || import.meta.env.VITE_MONGODB_URI || defaultUri;
  
  // Add authentication if credentials are provided
  if (user && password) {
    // Extract protocol and rest of the URI
    const [protocol, rest] = uri.split('://');
    uri = `${protocol}://${user}:${password}@${rest}`;
  }
  
  return {
    useMockDatabase,
    // Use environment variable for MongoDB URI with fallback
    mongodbUri: uri,
    // Additional database config options
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      maxPoolSize: 10,
      minPoolSize: 2,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 10000
    }
  };
};

export default getDatabaseConfig;
