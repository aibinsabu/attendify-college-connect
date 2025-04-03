import mockDb from './mockDb';
import bcrypt from 'bcryptjs';

class APIHandler {
  initializeRoutes() {
    this.setupLoginEndpoint();
    this.setupSignupEndpoint();
    this.setupAuthStatusEndpoint();
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
}

export const apiHandler = new APIHandler();
export default apiHandler;
