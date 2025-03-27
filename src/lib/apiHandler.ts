
import { connectToDatabase } from './mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Simulate the server-side API behavior on the client for the demo
class APIHandler {
  // Initialize API routes
  initializeRoutes() {
    this.setupLoginEndpoint();
    this.setupSignupEndpoint();
  }
  
  setupLoginEndpoint() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      if (typeof input === 'string' && input === '/api/auth/login' && init?.method === 'POST') {
        try {
          await connectToDatabase();
          const body = JSON.parse(init.body.toString());
          const { email, password, role } = body;
          
          // Find user in database
          // We need to use .exec() for proper promise resolution in Mongoose
          const user = await User.findOne({ email, role }).exec();
          
          if (!user) {
            return new Response(
              JSON.stringify({ message: 'User not found' }),
              { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
          }
          
          // Check password (in real app, use bcrypt.compare)
          if (user.password !== password) {  // Simplified for demo, should use bcrypt
            return new Response(
              JSON.stringify({ message: 'Invalid credentials' }),
              { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
          }
          
          // Return user data
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
      
      // Pass through other requests to the original fetch
      return originalFetch.call(window, input, init);
    };
  }
  
  setupSignupEndpoint() {
    const originalFetch = window.fetch;
    
    window.fetch = async function(input, init) {
      if (typeof input === 'string' && input === '/api/auth/signup' && init?.method === 'POST') {
        try {
          await connectToDatabase();
          const body = JSON.parse(init.body.toString());
          const { email, password, role } = body;
          
          // Check if user already exists
          // We need to use .exec() for proper promise resolution in Mongoose
          const existingUser = await User.findOne({ email }).exec();
          
          if (existingUser) {
            return new Response(
              JSON.stringify({ message: 'User already exists' }),
              { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
          }
          
          // Create new user
          // In a real app, hash the password before saving
          const newUser = new User({
            ...body,
            password: password // In production, use bcrypt.hash
          });
          
          await newUser.save();
          
          // Return created user data
          return new Response(
            JSON.stringify({
              _id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
              department: newUser.department,
              studentClass: newUser.studentClass,
              batch: newUser.batch,
              rollNo: newUser.rollNo
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
      
      // Pass through other requests to the original fetch
      return originalFetch.call(window, input, init);
    };
  }
}

export const apiHandler = new APIHandler();
export default apiHandler;
