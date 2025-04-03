
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/components/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Add real-time query to check authentication status
  const { data: authStatus } = useQuery({
    queryKey: ['authStatus'],
    queryFn: async () => {
      const response = await fetch('/api/auth/status');
      if (!response.ok) {
        throw new Error('Failed to fetch auth status');
      }
      return response.json();
    },
    refetchInterval: 5000, // Refetch every 5 seconds
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(email, password, 'admin');
      if (success) {
        toast.success('Login successful!');
        navigate('/admin/dashboard');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (authStatus?.isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [authStatus, navigate]);

  return (
    <AuthLayout 
      title="Admin Login" 
      subtitle="Sign in to your admin account"
      role="Admin"
      alternateAuthPath="/admin/signup"
      alternateAuthText="Don't have an account? Sign up"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-focus"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="#" className="text-xs text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-focus"
          />
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
