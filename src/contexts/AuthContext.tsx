
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'faculty' | 'student' | 'busstaff';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  // Additional fields based on role
  department?: string;
  studentClass?: string;
  batch?: string;
  rollNo?: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  department?: string;
  studentClass?: string;
  batch?: string;
  rollNo?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (userData: SignupData) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize MongoDB connection
  useEffect(() => {
    const initMongoDB = async () => {
      try {
        await connectToDatabase();
      } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        toast.error('Database connection failed');
      }
    };
    
    initMongoDB();
  }, []);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await connectToDatabase();
      
      // In a production app, we would make a fetch call to a secure API endpoint
      // For demo purposes, we're doing a simplified version
      
      // Simulate user lookup and password verification
      // In real production code, this would be a server-side API call
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      const userData = await response.json();
      
      const newUser: User = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role as UserRole,
        department: userData.department,
        studentClass: userData.studentClass,
        batch: userData.batch,
        rollNo: userData.rollNo
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast.success('Login successful!');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials or user not found');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (userData: SignupData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await connectToDatabase();
      
      // In a production app, we would make a fetch call to a secure API endpoint
      // For demo purposes, we're doing a simplified version
      
      // Simulate user creation
      // In real production code, this would be a server-side API call
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      
      const newUserData = await response.json();
      
      const newUser: User = {
        id: newUserData._id,
        name: newUserData.name,
        email: newUserData.email,
        role: newUserData.role as UserRole,
        department: newUserData.department,
        studentClass: newUserData.studentClass,
        batch: newUserData.batch,
        rollNo: newUserData.rollNo
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      toast.success('Account created successfully!');
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
    navigate('/');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
