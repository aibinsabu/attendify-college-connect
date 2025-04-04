
import { connectToDatabase } from '@/lib/mongodb';
import mockDb from '@/lib/mockDb';
import getDatabaseConfig from '@/config/database';

const { useMockDatabase } = getDatabaseConfig();

// Timetable related API functions
const timeTableAPI = {
  // Get all timetables
  getAllTimetables: async () => {
    try {
      if (useMockDatabase) {
        return mockDb.getCollection('timetables');
      }
      
      // This would use the real MongoDB in a production environment
      // For now we're just returning mock data
      return mockDb.getCollection('timetables');
    } catch (error) {
      console.error('Error fetching timetables:', error);
      throw error;
    }
  },
  
  // Get timetable by class
  getTimetableByClass: async (className: string) => {
    try {
      if (useMockDatabase) {
        const timetables = mockDb.getCollection('timetables');
        return timetables.filter(t => t.class === className);
      }
      
      // This would use the real MongoDB in a production environment
      const timetables = mockDb.getCollection('timetables');
      return timetables.filter(t => t.class === className);
    } catch (error) {
      console.error('Error fetching timetable by class:', error);
      throw error;
    }
  },
  
  // Get timetable by day and class
  getTimetableByDayAndClass: async (day: string, className: string) => {
    try {
      if (useMockDatabase) {
        const timetables = mockDb.getCollection('timetables');
        return timetables.find(t => t.day === day && t.class === className);
      }
      
      // This would use the real MongoDB in a production environment
      const timetables = mockDb.getCollection('timetables');
      return timetables.find(t => t.day === day && t.class === className);
    } catch (error) {
      console.error('Error fetching timetable by day and class:', error);
      throw error;
    }
  },
  
  // Create new timetable
  createTimetable: async (timetableData: any) => {
    try {
      if (useMockDatabase) {
        return mockDb.addToCollection('timetables', {
          ...timetableData,
          _id: `mock_timetable_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      // This would use the real MongoDB in a production environment
      return mockDb.addToCollection('timetables', {
        ...timetableData,
        _id: `mock_timetable_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error creating timetable:', error);
      throw error;
    }
  },
  
  // Update timetable
  updateTimetable: async (id: string, timetableData: any) => {
    try {
      if (useMockDatabase) {
        return mockDb.updateInCollection('timetables', id, {
          ...timetableData,
          updatedAt: new Date()
        });
      }
      
      // This would use the real MongoDB in a production environment
      return mockDb.updateInCollection('timetables', id, {
        ...timetableData,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating timetable:', error);
      throw error;
    }
  },
  
  // Delete timetable
  deleteTimetable: async (id: string) => {
    try {
      if (useMockDatabase) {
        return mockDb.deleteFromCollection('timetables', id);
      }
      
      // This would use the real MongoDB in a production environment
      return mockDb.deleteFromCollection('timetables', id);
    } catch (error) {
      console.error('Error deleting timetable:', error);
      throw error;
    }
  }
};

export default timeTableAPI;
