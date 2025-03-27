
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'faculty' | 'student' | 'busstaff';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
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
      // In a real app, this would be an API call to your backend
      // Simulated login for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate network delay
      
      // Simplified validation - in a real app, this would be server-side
      if (email && password) {
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9), // generate random ID
          name: email.split('@')[0], // extract name from email
          email,
          role
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        toast.success('Login successful!');
        setIsLoading(false);
        return true;
      } else {
        toast.error('Invalid credentials');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      // Simulated signup for demonstration purposes
      await new Promise(resolve => setTimeout(resolve, 1000)); // simulate network delay
      
      if (name && email && password) {
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name,
          email,
          role
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        toast.success('Account created successfully!');
        setIsLoading(false);
        return true;
      } else {
        toast.error('Please fill in all required fields');
        setIsLoading(false);
        return false;
      }
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
