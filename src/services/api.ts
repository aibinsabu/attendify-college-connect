
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Attendance from '@/models/Attendance';
import BusRoute from '@/models/BusRoute';
import Mark from '@/models/Mark';
import { toast } from 'sonner';
import mockDb from '@/lib/mockDb';
import getDatabaseConfig from '@/config/database';
import timeTableAPI from './timeTableApi';
import authAPI from './authApi';

const { useMockDatabase } = getDatabaseConfig();

// Initialize database connection
export const initDatabase = async () => {
  try {
    if (useMockDatabase) {
      console.log('Using mock database for development');
      await mockDb.connect();
      return true;
    } else {
      console.log('Connecting to MongoDB...');
      await connectToDatabase();
      return true;
    }
  } catch (error) {
    console.error('Failed to initialize database:', error);
    toast.error('Failed to connect to database');
    return false;
  }
};

// User related API functions
export const userAPI = {
  // Get user by ID
  getById: async (id: string) => {
    try {
      if (useMockDatabase) {
        const users = mockDb.getCollection('users');
        return users.find(u => u._id === id);
      }
      
      await connectToDatabase();
      return await User.findById(id).select('-password').lean();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },
  
  // Get all users (with optional role filter)
  getAllUsers: async (role?: string) => {
    try {
      if (useMockDatabase) {
        const users = mockDb.getCollection('users');
        return role ? users.filter(u => u.role === role) : users;
      }
      
      await connectToDatabase();
      const query = role ? { role } : {};
      return await User.find(query).select('-password').lean();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // Add new user
  addUser: async (userData: any) => {
    try {
      if (useMockDatabase) {
        return mockDb.addToCollection('users', {
          ...userData,
          _id: `mock_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      const newUser = new User(userData);
      const savedUser = await newUser.save();
      return savedUser.toObject();
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  },
  
  // Delete user
  deleteUser: async (id: string) => {
    try {
      if (useMockDatabase) {
        const users = mockDb.getCollection('users');
        const filteredUsers = users.filter(u => u._id !== id);
        mockDb.collections.set('users', filteredUsers);
        return { success: true, deletedCount: 1 };
      }
      
      await connectToDatabase();
      const result = await User.deleteOne({ _id: id });
      return { success: result.deletedCount > 0, deletedCount: result.deletedCount };
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
  
  // Search students by various criteria
  searchStudents: async (criteria: { 
    name?: string;
    studentClass?: string;
    batch?: string;
    rollNo?: string;
  }) => {
    try {
      if (useMockDatabase) {
        const users = mockDb.getCollection('users');
        return users.filter(u => {
          if (u.role !== 'student') return false;
          
          let matches = true;
          if (criteria.name && !u.name.toLowerCase().includes(criteria.name.toLowerCase())) {
            matches = false;
          }
          if (criteria.studentClass && u.studentClass !== criteria.studentClass) {
            matches = false;
          }
          if (criteria.batch && u.batch !== criteria.batch) {
            matches = false;
          }
          if (criteria.rollNo && u.rollNo !== criteria.rollNo) {
            matches = false;
          }
          return matches;
        });
      }
      
      await connectToDatabase();
      
      const query: any = { role: 'student' };
      
      if (criteria.name) {
        query['name'] = { $regex: criteria.name, $options: 'i' };
      }
      
      if (criteria.studentClass) {
        query['studentClass'] = criteria.studentClass;
      }
      
      if (criteria.batch) {
        query['batch'] = criteria.batch;
      }
      
      if (criteria.rollNo) {
        query['rollNo'] = criteria.rollNo;
      }
      
      return await User.find(query).select('-password').lean();
    } catch (error) {
      console.error('Error searching students:', error);
      throw error;
    }
  },
  
  // Update student details
  updateStudent: async (id: string, data: any) => {
    try {
      if (useMockDatabase) {
        return mockDb.updateInCollection('users', id, {
          ...data,
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      const updatedStudent = await User.findByIdAndUpdate(
        id, 
        { ...data, updatedAt: new Date() }, 
        { new: true }
      ).select('-password').lean();
      
      return updatedStudent;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }
};

// Attendance related API functions
export const attendanceAPI = {
  // Mark attendance using scanner
  markAttendanceByScanner: async (studentId: string, classId: string, subjectId: string) => {
    try {
      if (useMockDatabase) {
        return mockDb.addToCollection('attendance', {
          student: studentId,
          class: classId,
          subject: subjectId,
          status: 'present',
          markedVia: 'scanner',
          markedAt: new Date(),
          date: new Date()
        });
      }
      
      await connectToDatabase();
      
      const attendance = new Attendance({
        student: studentId,
        class: classId,
        subject: subjectId,
        status: 'present',
        markedVia: 'scanner',
        markedAt: new Date(),
        date: new Date()
      });
      
      const savedAttendance = await attendance.save();
      return savedAttendance.toObject();
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  },
  
  // Mark attendance using code (with verification media)
  markAttendanceByCode: async (
    studentId: string, 
    classId: string, 
    subjectId: string, 
    verificationMedia: string
  ) => {
    try {
      if (useMockDatabase) {
        return mockDb.addToCollection('attendance', {
          student: studentId,
          class: classId,
          subject: subjectId,
          status: 'present',
          markedVia: 'code',
          verificationMedia,
          markedAt: new Date(),
          date: new Date()
        });
      }
      
      await connectToDatabase();
      
      const attendance = new Attendance({
        student: studentId,
        class: classId,
        subject: subjectId,
        status: 'present',
        markedVia: 'code',
        verificationMedia,
        markedAt: new Date(),
        date: new Date()
      });
      
      const savedAttendance = await attendance.save();
      return savedAttendance.toObject();
    } catch (error) {
      console.error('Error marking attendance by code:', error);
      throw error;
    }
  },
  
  // Get all attendance records
  getAllAttendanceRecords: async () => {
    try {
      if (useMockDatabase) {
        return mockDb.getCollection('attendance');
      }
      
      await connectToDatabase();
      return await Attendance.find().populate('student', 'name rollNo studentClass').lean();
    } catch (error) {
      console.error('Error fetching all attendance records:', error);
      throw error;
    }
  },
  
  // Get student attendance
  getStudentAttendance: async (studentId: string) => {
    try {
      if (useMockDatabase) {
        const attendanceRecords = mockDb.getCollection('attendance');
        return attendanceRecords.filter(a => a.student === studentId);
      }
      
      await connectToDatabase();
      return await Attendance.find({ student: studentId }).lean();
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },
  
  // Update attendance record
  updateAttendance: async (id: string, data: any) => {
    try {
      if (useMockDatabase) {
        return mockDb.updateInCollection('attendance', id, {
          ...data,
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      return await Attendance.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      ).lean();
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  },
  
  // Calculate attendance percentage
  getAttendancePercentage: async (studentId: string, classId: string) => {
    try {
      if (useMockDatabase) {
        const attendanceRecords = mockDb.getCollection('attendance');
        const totalClassRecords = attendanceRecords.filter(a => a.class === classId);
        const attendedClasses = attendanceRecords.filter(
          a => a.student === studentId && a.class === classId && a.status === 'present'
        );
        
        return totalClassRecords.length > 0 ? 
          (attendedClasses.length / totalClassRecords.length) * 100 : 0;
      }
      
      await connectToDatabase();
      // Calculate manually since we're not using the static method
      const totalClasses = await Attendance.countDocuments({ class: classId });
      const attendedClasses = await Attendance.countDocuments({ 
        student: studentId, 
        class: classId,
        status: 'present'
      });
      
      return totalClasses > 0 ? (attendedClasses / totalClasses) * 100 : 0;
    } catch (error) {
      console.error('Error calculating attendance percentage:', error);
      throw error;
    }
  }
};

// Marks related API functions
export const marksAPI = {
  // Add or update marks
  addOrUpdateMark: async (markData: {
    student: string;
    subject: string;
    exam: string;
    marks: number;
    totalMarks: number;
    remarks?: string;
    addedBy: string;
  }) => {
    try {
      if (useMockDatabase) {
        const { student, subject, exam, marks, totalMarks } = markData;
        const percentage = (marks / totalMarks) * 100;
        
        // Determine grade based on percentage
        let grade = '';
        if (percentage >= 90) grade = 'A+';
        else if (percentage >= 80) grade = 'A';
        else if (percentage >= 70) grade = 'B+';
        else if (percentage >= 60) grade = 'B';
        else if (percentage >= 50) grade = 'C';
        else if (percentage >= 40) grade = 'D';
        else grade = 'F';
        
        const existingMarks = mockDb.findInCollection('marks', { 
          student, subject, exam 
        });
        
        if (existingMarks.length > 0) {
          return mockDb.updateInCollection('marks', existingMarks[0]._id, {
            ...markData,
            percentage,
            grade,
            updatedAt: new Date()
          });
        } else {
          return mockDb.addToCollection('marks', {
            ...markData,
            percentage,
            grade,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
      
      await connectToDatabase();
      
      const { student, subject, exam, marks, totalMarks } = markData;
      const percentage = (marks / totalMarks) * 100;
      
      // Determine grade based on percentage
      let grade = '';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B+';
      else if (percentage >= 60) grade = 'B';
      else if (percentage >= 50) grade = 'C';
      else if (percentage >= 40) grade = 'D';
      else grade = 'F';
      
      // Update approach to fix TypeScript error
      const markRecord = await Mark.findOneAndUpdate(
        { student, subject, exam },
        { ...markData, percentage, grade, updatedAt: new Date() },
        { new: true, upsert: true }
      ).lean();
      
      return markRecord;
    } catch (error) {
      console.error('Error saving marks:', error);
      throw error;
    }
  },
  
  // Get student marks
  getStudentMarks: async (studentId: string) => {
    try {
      if (useMockDatabase) {
        const marks = mockDb.getCollection('marks');
        return marks.filter(m => m.student === studentId);
      }
      
      await connectToDatabase();
      return await Mark.find({ student: studentId }).lean();
    } catch (error) {
      console.error('Error fetching marks:', error);
      throw error;
    }
  },
  
  // Get all marks
  getAllMarks: async () => {
    try {
      if (useMockDatabase) {
        return mockDb.getCollection('marks');
      }
      
      await connectToDatabase();
      return await Mark.find().populate('student', 'name rollNo studentClass').lean();
    } catch (error) {
      console.error('Error fetching all marks:', error);
      throw error;
    }
  },
  
  // Update mark
  updateMark: async (id: string, data: any) => {
    try {
      if (useMockDatabase) {
        return mockDb.updateInCollection('marks', id, {
          ...data,
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      return await Mark.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      ).lean();
    } catch (error) {
      console.error('Error updating mark:', error);
      throw error;
    }
  }
};

// Bus routes related API functions
export const busRouteAPI = {
  // Get all bus routes
  getAllRoutes: async () => {
    try {
      if (useMockDatabase) {
        const routes = mockDb.getCollection('busroutes');
        return routes.filter(r => r.active === true);
      }
      
      await connectToDatabase();
      return await BusRoute.find({ active: true }).lean();
    } catch (error) {
      console.error('Error fetching bus routes:', error);
      throw error;
    }
  },
  
  // Update bus route
  updateRoute: async (id: string, routeData: any) => {
    try {
      if (useMockDatabase) {
        return mockDb.updateInCollection('busroutes', id, {
          ...routeData,
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      return await BusRoute.findByIdAndUpdate(
        id, 
        { ...routeData, updatedAt: new Date() }, 
        { new: true }
      ).lean();
    } catch (error) {
      console.error('Error updating bus route:', error);
      throw error;
    }
  },
  
  // Create new bus route
  createRoute: async (routeData: any) => {
    try {
      if (useMockDatabase) {
        return mockDb.addToCollection('busroutes', {
          ...routeData,
          active: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      const newRoute = new BusRoute({
        ...routeData,
        active: true
      });
      const savedRoute = await newRoute.save();
      return savedRoute.toObject();
    } catch (error) {
      console.error('Error creating bus route:', error);
      throw error;
    }
  },
  
  // Add announcement to bus route
  addAnnouncement: async (routeId: string, announcement: {
    title: string;
    message: string;
    createdBy: string;
    priority?: 'low' | 'medium' | 'high';
  }) => {
    try {
      if (useMockDatabase) {
        const routes = mockDb.getCollection('busroutes');
        const route = routes.find(r => r._id === routeId);
        
        if (!route) {
          throw new Error('Bus route not found');
        }
        
        const announcementObj = {
          ...announcement,
          id: `ann_${Date.now()}`,
          createdAt: new Date(),
          read: []
        };
        
        if (!route.announcements) {
          route.announcements = [];
        }
        
        route.announcements.push(announcementObj);
        
        return mockDb.updateInCollection('busroutes', routeId, {
          ...route,
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      
      const announcementObj = {
        ...announcement,
        createdAt: new Date(),
        read: []
      };
      
      const updatedRoute = await BusRoute.findByIdAndUpdate(
        routeId,
        { 
          $push: { announcements: announcementObj },
          $set: { updatedAt: new Date() }
        },
        { new: true }
      );
      
      if (!updatedRoute) {
        throw new Error('Bus route not found');
      }
      
      return updatedRoute.toObject();
    } catch (error) {
      console.error('Error adding announcement to bus route:', error);
      throw error;
    }
  },
  
  // Get route by ID
  getRouteById: async (id: string) => {
    try {
      if (useMockDatabase) {
        const routes = mockDb.getCollection('busroutes');
        return routes.find(r => r._id === id);
      }
      
      await connectToDatabase();
      return await BusRoute.findById(id).lean();
    } catch (error) {
      console.error('Error fetching bus route:', error);
      throw error;
    }
  },
  
  // Delete route
  deleteRoute: async (id: string) => {
    try {
      if (useMockDatabase) {
        // Soft delete by setting active to false
        return mockDb.updateInCollection('busroutes', id, {
          active: false,
          updatedAt: new Date()
        });
      }
      
      await connectToDatabase();
      // Soft delete by setting active to false
      return await BusRoute.findByIdAndUpdate(
        id,
        { active: false, updatedAt: new Date() },
        { new: true }
      ).lean();
    } catch (error) {
      console.error('Error deleting bus route:', error);
      throw error;
    }
  }
};

// Expose a single API object with all functionality
export const API = {
  init: initDatabase,
  user: userAPI,
  attendance: attendanceAPI,
  marks: marksAPI,
  busRoute: busRouteAPI,
  timeTable: timeTableAPI,
  auth: authAPI
};

// Export default API object
export default API;
