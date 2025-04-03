
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import authAPI from '@/services/authApi';

// Define form schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'faculty', 'student', 'busstaff'], {
    required_error: 'Please select a role',
  }),
});

const ForgotPasswordForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      role: 'student',
    },
  });
  
  const selectedRole = watch('role');
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Request password reset
      await authAPI.requestPasswordReset(data.email, data.role);
      
      // Mark as sent
      setEmailSent(true);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      console.error('Password reset request error:', error);
      toast.error('Failed to request password reset');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBackToLogin = () => {
    // Navigate to appropriate login page based on role
    switch (selectedRole) {
      case 'admin':
        navigate('/admin/login');
        break;
      case 'faculty':
        navigate('/faculty/login');
        break;
      case 'student':
        navigate('/student/login');
        break;
      case 'busstaff':
        navigate('/busstaff/login');
        break;
      default:
        navigate('/');
    }
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you instructions to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {emailSent ? (
          <Alert>
            <AlertDescription>
              If an account exists with this email address, you will receive password reset instructions.
              Please check your email and follow the instructions to reset your password.
              
              <div className="mt-4">
                <p className="text-sm text-muted-foreground mb-2">
                  Note: In development mode, check the console for the reset token.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Account Type</Label>
              <Select defaultValue="student" {...register('role')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="faculty">Faculty</SelectItem>
                  <SelectItem value="admin">Administrator</SelectItem>
                  <SelectItem value="busstaff">Bus Staff</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Reset Password'}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="ghost" onClick={handleBackToLogin}>
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
