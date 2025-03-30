import { connectToDatabase } from './mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

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
          const user = await User.findOne({ email, role }).exec();
          
          if (!user) {
            return new Response(
              JSON.stringify({ message: 'User not found' }),
              { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
          }
          
          // Compare hashed passwords
          const isPasswordValid = await bcrypt.compare(password, user.password);
          
          if (!isPasswordValid) {
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
              role: user.role
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
          const existingUser = await User.findOne({ email }).exec();
          
          if (existingUser) {
            return new Response(
              JSON.stringify({ message: 'User already exists' }),
              { status: 409, headers: { 'Content-Type': 'application/json' } }
            );
          }
          
          // Hash password before saving
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(password, saltRounds);
          
          // Create new user with hashed password
          const newUser = new User({
            ...body,
            password: hashedPassword
          });
          
          await newUser.save();
          
          // Return created user data
          return new Response(
            JSON.stringify({
              _id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role
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
