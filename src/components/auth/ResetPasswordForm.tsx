
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import authAPI from '@/services/authApi';

// Define form schema
const formSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const ResetPasswordForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!token) {
      toast.error('Invalid reset token');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Reset password with token
      await authAPI.resetPassword(token, data.password);
      
      // Mark as complete
      setResetComplete(true);
      toast.success('Password reset successfully');
    } catch (error) {
      console.error('Password reset error:', error);
      toast.error('Failed to reset password. Token may be invalid or expired.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBackToLogin = () => {
    navigate('/');
  };
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create New Password</CardTitle>
        <CardDescription>
          Enter a new password for your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {resetComplete ? (
          <Alert>
            <AlertDescription>
              Your password has been reset successfully. You can now log in with your new password.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                {...register('confirmPassword')}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
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

export default ResetPasswordForm;
