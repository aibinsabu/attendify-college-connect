
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DatabaseStatus from '@/components/DatabaseStatus';
import { School, UserCircle, BookOpen, Bus } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Gradient Background */}
      <header className="bg-gradient-to-r from-primary/90 to-primary py-8 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">College Management System</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
            A comprehensive platform for managing educational activities, staff, and students
          </p>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Welcome to Your Educational Hub</h2>
            <p className="text-muted-foreground mt-2">Access all your college resources in one place</p>
          </div>
          <DatabaseStatus />
        </div>
        
        {/* Portal Cards with improved styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover-scale overflow-hidden border-t-4 border-t-blue-500 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center">
                <School className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Admin Portal</h3>
              <p className="text-gray-600 mb-4">Manage the entire system, users, and settings</p>
              <Link to="/admin/login">
                <Button className="w-full">Admin Login</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover-scale overflow-hidden border-t-4 border-t-green-500 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                <UserCircle className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Faculty Portal</h3>
              <p className="text-gray-600 mb-4">Manage classes, attendance, and student marks</p>
              <Link to="/faculty/login">
                <Button variant="secondary" className="w-full">Faculty Login</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover-scale overflow-hidden border-t-4 border-t-yellow-500 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center">
                <BookOpen className="text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Student Portal</h3>
              <p className="text-gray-600 mb-4">View attendance, marks, and manage profile</p>
              <Link to="/student/login">
                <Button variant="outline" className="w-full">Student Login</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="hover-scale overflow-hidden border-t-4 border-t-purple-500 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center">
                <Bus className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Bus Staff Portal</h3>
              <p className="text-gray-600 mb-4">Manage transportation and routes</p>
              <Link to="/busstaff/login">
                <Button variant="ghost" className="w-full border">Bus Staff Login</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="font-medium text-lg mb-2">Streamlined Management</h3>
              <p className="text-muted-foreground">Efficiently manage all aspects of your educational institution</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="font-medium text-lg mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground">Get instant access to attendance, grades, and important notices</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="font-medium text-lg mb-2">Comprehensive Reporting</h3>
              <p className="text-muted-foreground">Generate detailed reports on student performance and attendance</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} College Management System. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-4">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
