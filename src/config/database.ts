
// Configuration file to determine which database to use
const useMockDatabase = import.meta.env.VITE_USE_MOCK_DB === 'true' || 
  (import.meta.env.DEV && typeof window !== 'undefined');

export const getDatabaseConfig = () => {
  const defaultUri = 'mongodb://localhost:27017/college_management';
  
  return {
    useMockDatabase,
    // Use environment variable for MongoDB URI with fallback
    mongodbUri: import.meta.env.VITE_MONGODB_URI || defaultUri,
    // Additional database config options
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true
    }
  };
};

export default getDatabaseConfig;
