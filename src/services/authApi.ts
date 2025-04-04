
import { API } from '@/services/api';
import { toast } from 'sonner';
import mockDb from '@/lib/mockDb';
import getDatabaseConfig from '@/config/database';
import { v4 as uuidv4 } from 'uuid';

const { useMockDatabase } = getDatabaseConfig();

// Auth related API functions
const authAPI = {
  // Login user
  login: async (email: string, password: string, role: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password, role })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to login');
      }
      
      const userData = await response.json();
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  // Register user
  signup: async (userData: any) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to signup');
      }
      
      const user = await response.json();
      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  // Request password reset
  requestPasswordReset: async (email: string, role: string) => {
    try {
      // In a real app, this would call an API endpoint
      if (useMockDatabase) {
        // Mock implementation
        const users = mockDb.getCollection('users');
        const user = users.find(u => u.email === email && u.role === role);
        
        if (!user) {
          console.log('No user found with this email and role');
          // We still return success to avoid leaking info about registered emails
          return true;
        }
        
        // Generate a reset token
        const resetToken = uuidv4();
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1); // Token expires after 1 hour
        
        // Update user with reset token and expiry date
        mockDb.updateInCollection('users', user._id, {
          passwordResetToken: resetToken,
          passwordResetExpires: expiryDate
        });
        
        // In a real app, this would send an email
        console.log(`Password reset token for ${email}: ${resetToken}`);
        console.log(`Reset link would be: /reset-password/${resetToken}`);
        
        return true;
      } else {
        // Real API implementation
        const response = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, role })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to request password reset');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Password reset request error:', error);
      throw error;
    }
  },
  
  // Reset password with token
  resetPassword: async (token: string, newPassword: string) => {
    try {
      // In a real app, this would call an API endpoint
      if (useMockDatabase) {
        // Mock implementation
        const users = mockDb.getCollection('users');
        const user = users.find(u => 
          u.passwordResetToken === token && 
          u.passwordResetExpires && 
          new Date(u.passwordResetExpires) > new Date()
        );
        
        if (!user) {
          throw new Error('Invalid or expired reset token');
        }
        
        // Update user with new password and remove reset token
        mockDb.updateInCollection('users', user._id, {
          password: newPassword, // In a real app this would be hashed
          passwordResetToken: null,
          passwordResetExpires: null,
          updatedAt: new Date()
        });
        
        return true;
      } else {
        // Real API implementation
        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token, password: newPassword })
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to reset password');
        }
        
        return true;
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }
};

export default authAPI;
