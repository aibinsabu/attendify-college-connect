
// Configuration file to determine which database to use
const useMockDatabase = import.meta.env.DEV && typeof window !== 'undefined';

export const getDatabaseConfig = () => {
  return {
    useMockDatabase,
    // You can add more configuration options here
    mongodbUri: import.meta.env.VITE_MONGODB_URI || 'mongodb://localhost:27017/college_management'
  };
};

export default getDatabaseConfig;
