
// Configuration file to determine which database to use
const useMockDatabase = process.env.NODE_ENV === 'development' && typeof window !== 'undefined';

export const getDatabaseConfig = () => {
  return {
    useMockDatabase,
    // You can add more configuration options here
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/college_management'
  };
};

export default getDatabaseConfig;
