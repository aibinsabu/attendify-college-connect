import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Bus } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gradient-to-r from-primary to-primary/80 py-6 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">College Management System</h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary/90 to-purple-500 bg-clip-text text-transparent">
            Welcome to College Management System
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
            <div className="h-2 bg-blue-500"></div>
            <CardHeader className="bg-gradient-to-b from-blue-50 to-white pt-6">
              <div className="mb-2 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Users size={24} />
              </div>
              <CardTitle className="text-xl font-semibold">Admin Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Manage the entire system, users, and settings
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 pb-6">
              <Link to="/admin/login" className="w-full">
                <Button className="w-full group">
                  Admin Login
                  <span className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
            <div className="h-2 bg-green-500"></div>
            <CardHeader className="bg-gradient-to-b from-green-50 to-white pt-6">
              <div className="mb-2 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <BookOpen size={24} />
              </div>
              <CardTitle className="text-xl font-semibold">Faculty Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Manage classes, attendance, and student marks
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 pb-6">
              <Link to="/faculty/login" className="w-full">
                <Button variant="secondary" className="w-full bg-green-100 text-green-700 hover:bg-green-200 group">
                  Faculty Login
                  <span className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
            <div className="h-2 bg-yellow-500"></div>
            <CardHeader className="bg-gradient-to-b from-yellow-50 to-white pt-6">
              <div className="mb-2 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <GraduationCap size={24} />
              </div>
              <CardTitle className="text-xl font-semibold">Student Portal</CardTitle>
              <CardDescription className="text-gray-600">
                View attendance, marks, and manage profile
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 pb-6">
              <Link to="/student/login" className="w-full">
                <Button variant="outline" className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 group">
                  Student Login
                  <span className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
            <div className="h-2 bg-purple-500"></div>
            <CardHeader className="bg-gradient-to-b from-purple-50 to-white pt-6">
              <div className="mb-2 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Bus size={24} />
              </div>
              <CardTitle className="text-xl font-semibold">Bus Staff Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Manage transportation and routes
              </CardDescription>
            </CardHeader>
            <CardFooter className="pt-2 pb-6">
              <Link to="/busstaff/login" className="w-full">
                <Button variant="ghost" className="w-full border border-purple-200 text-purple-700 hover:bg-purple-50 group">
                  Bus Staff Login
                  <span className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-12 p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-gray-100 hover:border-primary/30 transition-all">
              <h4 className="font-medium text-lg mb-2 text-gray-800">Easy Attendance Tracking</h4>
              <p className="text-gray-600">Streamlined attendance management for students and staff</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-100 hover:border-primary/30 transition-all">
              <h4 className="font-medium text-lg mb-2 text-gray-800">Marks Management</h4>
              <p className="text-gray-600">Comprehensive system for recording and analyzing academic performance</p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-gray-100 hover:border-primary/30 transition-all">
              <h4 className="font-medium text-lg mb-2 text-gray-800">Transportation Tracking</h4>
              <p className="text-gray-600">Real-time bus route management and scheduling</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gradient-to-r from-gray-50 to-gray-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 font-medium">&copy; {new Date().getFullYear()} College Management System. All rights reserved.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-primary transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
