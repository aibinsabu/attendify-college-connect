
import { connectToDatabase } from '@/lib/mongodb';
import TimeTable from '@/models/TimeTable';
import mockDb from '@/lib/mockDb';
import getDatabaseConfig from '@/config/database';

const { useMockDatabase } = getDatabaseConfig();

// TimeTable related API functions
export const timeTableAPI = {
  // Create new timetable
  createTimeTable: async (timeTableData: any) => {
    try {
      if (useMockDatabase) {
        return mockDb.addToCollection('timetables', {
          ...timeTableData,
          _id: `mock_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      const newTimeTable = new TimeTable({
        ...timeTableData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const savedTimeTable = await newTimeTable.save();
      return savedTimeTable.toObject();
    } catch (error) {
      console.error('Error creating timetable:', error);
      throw error;
    }
  },
  
  // Get all timetables
  getAllTimeTables: async () => {
    try {
      if (useMockDatabase) {
        const timetables = mockDb.getCollection('timetables');
        return timetables.filter(t => t.active === true);
      }
      
      await connectToDatabase();
      return await TimeTable.find({ active: true }).lean();
    } catch (error) {
      console.error('Error fetching timetables:', error);
      throw error;
    }
  },
  
  // Get timetable by ID
  getTimeTableById: async (id: string) => {
    try {
      if (useMockDatabase) {
        const timetables = mockDb.getCollection('timetables');
        return timetables.find(t => t._id === id);
      }
      
      await connectToDatabase();
      return await TimeTable.findById(id).lean();
    } catch (error) {
      console.error('Error fetching timetable:', error);
      throw error;
    }
  },
  
  // Get timetables by department
  getTimeTablesByDepartment: async (department: string) => {
    try {
      if (useMockDatabase) {
        const timetables = mockDb.getCollection('timetables');
        return timetables.filter(t => t.department === department && t.active === true);
      }
      
      await connectToDatabase();
      return await TimeTable.find({ department, active: true }).lean();
    } catch (error) {
      console.error('Error fetching timetables by department:', error);
      throw error;
    }
  },
  
  // Get timetables by faculty
  getTimeTablesByFaculty: async (facultyId: string) => {
    try {
      if (useMockDatabase) {
        const timetables = mockDb.getCollection('timetables');
        return timetables.filter(t => 
          t.active === true && 
          t.slots.some((slot: any) => slot.faculty === facultyId)
        );
      }
      
      await connectToDatabase();
      return await TimeTable.find({ 
        active: true,
        'slots.faculty': facultyId 
      }).lean();
    } catch (error) {
      console.error('Error fetching timetables by faculty:', error);
      throw error;
    }
  },
  
  // Update timetable
  updateTimeTable: async (id: string, timeTableData: any) => {
    try {
      if (useMockDatabase) {
        return mockDb.updateInCollection('timetables', id, {
          ...timeTableData,
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      return await TimeTable.findByIdAndUpdate(
        id,
        { ...timeTableData, updatedAt: new Date() },
        { new: true }
      ).lean();
    } catch (error) {
      console.error('Error updating timetable:', error);
      throw error;
    }
  },
  
  // Add slot to timetable
  addSlotToTimeTable: async (id: string, slotData: any) => {
    try {
      if (useMockDatabase) {
        const timetables = mockDb.getCollection('timetables');
        const timetable = timetables.find(t => t._id === id);
        
        if (!timetable) {
          throw new Error('Timetable not found');
        }
        
        if (!timetable.slots) {
          timetable.slots = [];
        }
        
        timetable.slots.push(slotData);
        
        return mockDb.updateInCollection('timetables', id, {
          ...timetable,
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      return await TimeTable.findByIdAndUpdate(
        id,
        { 
          $push: { slots: slotData },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      ).lean();
    } catch (error) {
      console.error('Error adding slot to timetable:', error);
      throw error;
    }
  },
  
  // Remove slot from timetable
  removeSlotFromTimeTable: async (id: string, slotId: string) => {
    try {
      if (useMockDatabase) {
        const timetables = mockDb.getCollection('timetables');
        const timetable = timetables.find(t => t._id === id);
        
        if (!timetable || !timetable.slots) {
          throw new Error('Timetable or slots not found');
        }
        
        timetable.slots = timetable.slots.filter((slot: any) => slot._id !== slotId);
        
        return mockDb.updateInCollection('timetables', id, {
          ...timetable,
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      return await TimeTable.findByIdAndUpdate(
        id,
        { 
          $pull: { slots: { _id: slotId } },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      ).lean();
    } catch (error) {
      console.error('Error removing slot from timetable:', error);
      throw error;
    }
  },
  
  // Delete timetable (soft delete)
  deleteTimeTable: async (id: string) => {
    try {
      if (useMockDatabase) {
        return mockDb.updateInCollection('timetables', id, {
          active: false,
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      return await TimeTable.findByIdAndUpdate(
        id,
        { active: false, updatedAt: new Date() },
        { new: true }
      ).lean();
    } catch (error) {
      console.error('Error deleting timetable:', error);
      throw error;
    }
  }
};

// Export the API
export default timeTableAPI;
