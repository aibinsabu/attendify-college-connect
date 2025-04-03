import mockDb from './mockDb';
import bcrypt from 'bcryptjs';

class APIHandler {
  initializeRoutes() {
    this.setupLoginEndpoint();
    this.setupSignupEndpoint();
    this.setupAuthStatusEndpoint();
    this.setupDashboardDataEndpoints();
  }
  
  setupLoginEndpoint() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      if (typeof input === 'string' && input === '/api/auth/login' && init?.method === 'POST') {
        try {
          await mockDb.connect();
          const body = JSON.parse(init.body.toString());
          const { email, password, role } = body;
          
          const users = mockDb.getCollection('users');
          const user = users.find(u => u.email === email && u.role === role);
          
          if (!user) {
            return new Response(
              JSON.stringify({ message: 'User not found' }),
              { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
          }
          
          const isPasswordValid = await bcrypt.compare(password, user.password);
          
          if (!isPasswordValid) {
            return new Response(
              JSON.stringify({ message: 'Invalid credentials' }),
              { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
          }
          
          return new Response(
            JSON.stringify({
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              department: user.department,
              studentClass: user.studentClass,
              batch: user.batch,
              rollNo: user.rollNo
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Login error:', error);
          return new Response(
            JSON.stringify({ message: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
      
      return originalFetch.call(window, input, init);
    };
  }
  
  setupSignupEndpoint() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      if (typeof input === 'string' && input === '/api/auth/signup' && init?.method === 'POST') {
        try {
          await mockDb.connect();
          const body = JSON.parse(init.body.toString());
          const { email, password, role } = body;
          
          const users = mockDb.getCollection('users');
          const existingUser = users.find(u => u.email === email);
          
          if (existingUser) {
            return new Response(
              JSON.stringify({ message: 'User already exists' }),
              { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
          }
          
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          
          const newUser = {
            ...body,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          const savedUser = mockDb.addToCollection('users', newUser);
          
          return new Response(
            JSON.stringify({
              _id: savedUser._id,
              name: savedUser.name,
              email: savedUser.email,
              role: savedUser.role,
              department: savedUser.department,
              studentClass: savedUser.studentClass,
              batch: savedUser.batch,
              rollNo: savedUser.rollNo
            }),
            { status: 201, headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Signup error:', error);
          return new Response(
            JSON.stringify({ message: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
      
      return originalFetch.call(window, input, init);
    };
  }
  
  setupAuthStatusEndpoint() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      if (typeof input === 'string' && input === '/api/auth/status') {
        try {
          await mockDb.connect();
          const currentUser = localStorage.getItem('currentUser');
          
          return new Response(
            JSON.stringify({
              isAuthenticated: !!currentUser,
              user: currentUser ? JSON.parse(currentUser) : null
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Auth status error:', error);
          return new Response(
            JSON.stringify({ message: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
      
      return originalFetch.call(window, input, init);
    };
  }
  
  setupDashboardDataEndpoints() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      if (typeof input === 'string' && input.startsWith('/api/attendance/student/')) {
        try {
          await mockDb.connect();
          const studentId = input.split('/').pop();
          
          const attendance = mockDb.getCollection('attendance');
          if (attendance.length === 0 || !attendance.some(a => a.student === studentId)) {
            const subjects = ['Introduction to Programming', 'Data Structures', 'Computer Networks'];
            const statuses = ['present', 'absent', 'late'];
            
            for (let i = 0; i < 15; i++) {
              const date = new Date();
              date.setDate(date.getDate() - i);
              
              subjects.forEach(subject => {
                const status = statuses[Math.floor(Math.random() * statuses.length)];
                mockDb.addToCollection('attendance', {
                  student: studentId,
                  subject,
                  date: date.toISOString().split('T')[0],
                  status,
                  class: 'Computer Science',
                  markedVia: 'manual',
                  markedAt: new Date()
                });
              });
            }
          }
          
          const studentAttendance = mockDb.findInCollection('attendance', { student: studentId });
          
          return new Response(
            JSON.stringify(studentAttendance),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Error fetching attendance:', error);
          return new Response(
            JSON.stringify({ message: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
      
      if (typeof input === 'string' && input.startsWith('/api/marks/student/')) {
        try {
          await mockDb.connect();
          const studentId = input.split('/').pop();
          
          const marks = mockDb.getCollection('marks');
          if (marks.length === 0 || !marks.some(m => m.student === studentId)) {
            const subjects = ['Introduction to Programming', 'Data Structures', 'Computer Networks'];
            
            subjects.forEach(subject => {
              const midterm = Math.floor(Math.random() * 30) + 60;
              const assignment = Math.floor(Math.random() * 20) + 70;
              const final = Math.floor(Math.random() * 25) + 65;
              
              const totalMarks = 100;
              const marks = Math.round((midterm + assignment + final) / 3);
              const percentage = (marks / totalMarks) * 100;
              
              let grade = '';
              if (percentage >= 90) grade = 'A+';
              else if (percentage >= 80) grade = 'A';
              else if (percentage >= 70) grade = 'B+';
              else if (percentage >= 60) grade = 'B';
              else if (percentage >= 50) grade = 'C';
              else if (percentage >= 40) grade = 'D';
              else grade = 'F';
              
              mockDb.addToCollection('marks', {
                student: studentId,
                subject,
                midterm,
                assignment,
                final,
                marks,
                totalMarks,
                percentage,
                grade,
                exam: 'Semester 1',
                remarks: '',
                addedBy: 'system',
                createdAt: new Date(),
                updatedAt: new Date()
              });
            });
          }
          
          const studentMarks = mockDb.findInCollection('marks', { student: studentId });
          
          return new Response(
            JSON.stringify(studentMarks),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Error fetching marks:', error);
          return new Response(
            JSON.stringify({ message: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
      
      if (typeof input === 'string' && input === '/api/busroutes') {
        try {
          await mockDb.connect();
          
          const busRoutes = mockDb.getCollection('busroutes');
          if (busRoutes.length === 0) {
            mockDb.addToCollection('busroutes', {
              routeName: 'Campus Main Route',
              routeNumber: 'Route A',
              driverName: 'John Smith',
              driverContact: '555-1234',
              startLocation: 'Central Station',
              endLocation: 'University Campus',
              stops: [
                { name: 'Central Station', time: '8:00 AM', coordinates: { lat: 40.7128, lng: -74.0060 } },
                { name: 'North Residence', time: '8:15 AM', coordinates: { lat: 40.7200, lng: -74.0100 } },
                { name: 'Library', time: '8:25 AM', coordinates: { lat: 40.7250, lng: -74.0150 } },
                { name: 'Science Block', time: '8:35 AM', coordinates: { lat: 40.7300, lng: -74.0200 } },
                { name: 'Sports Complex', time: '8:45 AM', coordinates: { lat: 40.7350, lng: -74.0250 } }
              ],
              active: true,
              busCapacity: 40,
              assignedStudents: [],
              createdAt: new Date(),
              updatedAt: new Date()
            });
          }
          
          const routes = mockDb.getCollection('busroutes');
          
          return new Response(
            JSON.stringify(routes),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          );
        } catch (error) {
          console.error('Error fetching bus routes:', error);
          return new Response(
            JSON.stringify({ message: 'Server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }
      }
      
      return originalFetch.call(window, input, init);
    };
  }
}

export const apiHandler = new APIHandler();
export default apiHandler;
