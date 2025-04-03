
import mockDb from '@/lib/mockDb';
import bcrypt from 'bcryptjs';
import { toast } from 'sonner';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import getDatabaseConfig from '@/config/database';

const { useMockDatabase } = getDatabaseConfig();

// Authentication related API functions
export const authAPI = {
  // Login user
  login: async (email: string, password: string, role: string) => {
    try {
      if (useMockDatabase) {
        const users = mockDb.getCollection('users');
        const user = users.find(u => u.email === email && u.role === role);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }
        
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      
      await connectToDatabase();
      const user = await User.findOne({ email, role });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }
      
      // Convert to plain object and remove password
      const userObj = user.toObject();
      delete userObj.password;
      
      return userObj;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Register new user
  register: async (userData: any) => {
    try {
      if (useMockDatabase) {
        const users = mockDb.getCollection('users');
        const existingUser = users.find(u => u.email === userData.email);
        
        if (existingUser) {
          throw new Error('User already exists');
        }
        
        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        // Create user with hashed password
        const newUser = {
          ...userData,
          password: hashedPassword,
          _id: `mock_${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        mockDb.addToCollection('users', newUser);
        
        // Return user without password
        const { password, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
      }
      
      await connectToDatabase();
      
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        throw new Error('User already exists');
      }
      
      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
      
      // Create new user with hashed password
      const newUser = new User({
        ...userData,
        password: hashedPassword
      });
      
      const savedUser = await newUser.save();
      
      // Convert to plain object and remove password
      const userObj = savedUser.toObject();
      delete userObj.password;
      
      return userObj;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  // Reset password request
  requestPasswordReset: async (email: string, role: string) => {
    try {
      if (useMockDatabase) {
        const users = mockDb.getCollection('users');
        const user = users.find(u => u.email === email && u.role === role);
        
        if (!user) {
          throw new Error('User not found');
        }
        
        // In mock mode, simply generate a reset token and store it
        const resetToken = Math.random().toString(36).substring(2, 15);
        const resetExpires = new Date();
        resetExpires.setHours(resetExpires.getHours() + 1); // Token expires in 1 hour
        
        mockDb.updateInCollection('users', user._id, {
          passwordResetToken: resetToken,
          passwordResetExpires: resetExpires,
          updatedAt: new Date()
        });
        
        // In a real app, we would send an email with the reset link
        // For mock purposes, we'll just return the token
        toast.success('Password reset email sent (simulated in development)');
        console.log('DEVELOPMENT MODE: Password reset token:', resetToken);
        
        return { success: true, message: 'Password reset email sent' };
      }
      
      await connectToDatabase();
      
      const user = await User.findOne({ email, role });
      
      if (!user) {
        throw new Error('User not found');
      }
      
      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15);
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1); // Token expires in 1 hour
      
      // Store token and expiry in user document
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = resetExpires;
      await user.save();
      
      // In a real app, we would send an email with the reset link
      // For development, log the token to console
      toast.success('Password reset email sent (simulated)');
      console.log('DEVELOPMENT MODE: Password reset token:', resetToken);
      
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },
  
  // Reset password with token
  resetPassword: async (token: string, newPassword: string) => {
    try {
      if (useMockDatabase) {
        const users = mockDb.getCollection('users');
        const user = users.find(u => 
          u.passwordResetToken === token && 
          u.passwordResetExpires > new Date()
        );
        
        if (!user) {
          throw new Error('Invalid or expired reset token');
        }
        
        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        
        // Update user password and clear reset token
        mockDb.updateInCollection('users', user._id, {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpires: null,
          updatedAt: new Date()
        });
        
        return { success: true, message: 'Password reset successful' };
      }
      
      await connectToDatabase();
      
      // Find user with valid reset token
      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() }
      });
      
      if (!user) {
        throw new Error('Invalid or expired reset token');
      }
      
      // Hash new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      
      // Update user password and clear reset token
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      
      return { success: true, message: 'Password reset successful' };
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
};

// Export default API
export default authAPI;
