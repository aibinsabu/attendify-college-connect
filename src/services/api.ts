
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import Attendance from '@/models/Attendance';
import BusRoute from '@/models/BusRoute';
import Mark from '@/models/Mark';

// Initialize database connection
export const initDatabase = async () => {
  try {
    await connectToDatabase();
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
};

// User related API functions
export const userAPI = {
  // Get user by ID
  getById: async (id: string) => {
    try {
      await connectToDatabase();
      // Use lean() for better performance and proper typing
      return await User.findById(id).select('-password').lean().exec();
    } catch (error) {
      console.error('Error fetching user:', error);
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
      
      // Using lean() for better performance and proper typing
      return await User.find(query).select('-password').lean().exec();
    } catch (error) {
      console.error('Error searching students:', error);
      throw error;
    }
  },
  
  // Update student details
  updateStudent: async (id: string, data: any) => {
    try {
      await connectToDatabase();
      // Using lean() for better performance and proper typing
      return await User.findByIdAndUpdate(
        id, 
        data, 
        { new: true }
      ).select('-password').lean().exec();
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
      await connectToDatabase();
      
      const attendance = new Attendance({
        student: studentId,
        class: classId,
        subject: subjectId,
        status: 'present',
        markedVia: 'scanner',
        markedAt: new Date()
      });
      
      return await attendance.save();
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
      await connectToDatabase();
      
      const attendance = new Attendance({
        student: studentId,
        class: classId,
        subject: subjectId,
        status: 'present',
        markedVia: 'code',
        verificationMedia,
        markedAt: new Date()
      });
      
      return await attendance.save();
    } catch (error) {
      console.error('Error marking attendance by code:', error);
      throw error;
    }
  },
  
  // Get student attendance
  getStudentAttendance: async (studentId: string) => {
    try {
      await connectToDatabase();
      // Using lean() for better performance and proper typing
      return await Attendance.find({ student: studentId }).lean().exec();
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },
  
  // Calculate attendance percentage
  getAttendancePercentage: async (studentId: string, classId: string) => {
    try {
      await connectToDatabase();
      // Calculate manually since we're not using the static method
      const totalClasses = await Attendance.countDocuments({ class: classId }).exec();
      const attendedClasses = await Attendance.countDocuments({ 
        student: studentId, 
        class: classId,
        status: 'present'
      }).exec();
      
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
      
      // Update the approach for findOneAndUpdate
      const markRecord = await Mark.findOneAndUpdate(
        { student, subject, exam },
        { ...markData, percentage, grade },
        { new: true, upsert: true }
      ).lean().exec();
      
      return markRecord;
    } catch (error) {
      console.error('Error saving marks:', error);
      throw error;
    }
  },
  
  // Get student marks
  getStudentMarks: async (studentId: string) => {
    try {
      await connectToDatabase();
      // Using lean() for better performance and proper typing
      return await Mark.find({ student: studentId }).lean().exec();
    } catch (error) {
      console.error('Error fetching marks:', error);
      throw error;
    }
  }
};

// Bus routes related API functions
export const busRouteAPI = {
  // Get all bus routes
  getAllRoutes: async () => {
    try {
      await connectToDatabase();
      // Using lean() for better performance and proper typing
      return await BusRoute.find({ active: true }).lean().exec();
    } catch (error) {
      console.error('Error fetching bus routes:', error);
      throw error;
    }
  },
  
  // Update bus route
  updateRoute: async (id: string, routeData: any) => {
    try {
      await connectToDatabase();
      // Using lean() for better performance and proper typing
      return await BusRoute.findByIdAndUpdate(
        id, 
        routeData, 
        { new: true }
      ).lean().exec();
    } catch (error) {
      console.error('Error updating bus route:', error);
      throw error;
    }
  },
  
  // Create new bus route
  createRoute: async (routeData: any) => {
    try {
      await connectToDatabase();
      const newRoute = new BusRoute(routeData);
      return await newRoute.save();
    } catch (error) {
      console.error('Error creating bus route:', error);
      throw error;
    }
  }
};
