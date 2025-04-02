
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Bus, CalendarCheck, FileSpreadsheet, MapPin, Shield } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[length:20px_20px]"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-fadeIn">College Management System</h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl animate-slideIn">
            A comprehensive platform for managing all aspects of college operations - from student attendance to transportation.
          </p>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-10">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Welcome to Your All-in-One College Management Solution
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg">
            Streamline college administration, enhance faculty productivity, and improve student experience with our comprehensive management system.
          </p>
        </div>
        
        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="h-2 bg-blue-500 group-hover:h-3 transition-all"></div>
            <CardHeader className="bg-gradient-to-b from-blue-50 to-white pt-6">
              <div className="mb-3 w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <CardTitle className="text-xl font-semibold">Admin Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Manage the entire system, users, and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-gray-500">Complete control over all system functions and user management.</p>
            </CardContent>
            <CardFooter className="pt-2 pb-6">
              <Link to="/admin/login" className="w-full">
                <Button className="w-full group">
                  Admin Login
                  <span className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="h-2 bg-green-500 group-hover:h-3 transition-all"></div>
            <CardHeader className="bg-gradient-to-b from-green-50 to-white pt-6">
              <div className="mb-3 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <CardTitle className="text-xl font-semibold">Faculty Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Manage classes, attendance, and student marks
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-gray-500">Tools for teachers to track student performance and manage classes efficiently.</p>
            </CardContent>
            <CardFooter className="pt-2 pb-6">
              <Link to="/faculty/login" className="w-full">
                <Button variant="secondary" className="w-full bg-green-100 text-green-700 hover:bg-green-200 group">
                  Faculty Login
                  <span className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="h-2 bg-yellow-500 group-hover:h-3 transition-all"></div>
            <CardHeader className="bg-gradient-to-b from-yellow-50 to-white pt-6">
              <div className="mb-3 w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 group-hover:scale-110 transition-transform">
                <GraduationCap size={28} />
              </div>
              <CardTitle className="text-xl font-semibold">Student Portal</CardTitle>
              <CardDescription className="text-gray-600">
                View attendance, marks, and manage profile
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-gray-500">Students can access their academic records and personal information.</p>
            </CardContent>
            <CardFooter className="pt-2 pb-6">
              <Link to="/student/login" className="w-full">
                <Button variant="outline" className="w-full border-yellow-300 text-yellow-700 hover:bg-yellow-50 group">
                  Student Login
                  <span className="ml-2 transform translate-x-0 group-hover:translate-x-1 transition-transform">→</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group">
            <div className="h-2 bg-purple-500 group-hover:h-3 transition-all"></div>
            <CardHeader className="bg-gradient-to-b from-purple-50 to-white pt-6">
              <div className="mb-3 w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <Bus size={28} />
              </div>
              <CardTitle className="text-xl font-semibold">Bus Staff Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Manage transportation and routes
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-sm text-gray-500">Coordinate bus schedules, routes, and student transportation assignments.</p>
            </CardContent>
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
        
        {/* Main Features Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 h-8 w-1 mr-3 rounded-full"></span>
            Main System Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Attendance Management */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-blue-100">
              <div className="flex items-start mb-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600 mr-4">
                  <CalendarCheck size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Attendance Management</h4>
                  <p className="text-gray-600">
                    Faculty can easily mark and track student attendance for each class. The system provides 
                    comprehensive reports and notifications for absences.
                  </p>
                </div>
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="text-blue-600 p-0 h-auto">Learn more</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Attendance Features:</h5>
                    <ul className="text-sm text-gray-500 list-disc pl-4 space-y-1">
                      <li>Real-time attendance tracking</li>
                      <li>Multiple marking methods (manual, QR code, etc.)</li>
                      <li>Attendance reports and analytics</li>
                      <li>Absence notifications to parents/guardians</li>
                    </ul>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            
            {/* Marks Management */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-green-100">
              <div className="flex items-start mb-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-600 mr-4">
                  <FileSpreadsheet size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Marks Management</h4>
                  <p className="text-gray-600">
                    Comprehensive system for recording and analyzing academic performance. Faculty can add marks,
                    generate report cards, and track student progress over time.
                  </p>
                </div>
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="text-green-600 p-0 h-auto">Learn more</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Marks Features:</h5>
                    <ul className="text-sm text-gray-500 list-disc pl-4 space-y-1">
                      <li>Subject-wise mark entry</li>
                      <li>Automatic grade calculation</li>
                      <li>Performance trends and analytics</li>
                      <li>Customizable report card generation</li>
                    </ul>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            
            {/* Transportation Management */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-purple-100">
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 p-3 rounded-lg text-purple-600 mr-4">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">Transportation Management</h4>
                  <p className="text-gray-600">
                    Efficiently manage college transportation with route planning, vehicle tracking, and
                    student assignment to buses. Monitor bus locations and schedules.
                  </p>
                </div>
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="text-purple-600 p-0 h-auto">Learn more</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Transportation Features:</h5>
                    <ul className="text-sm text-gray-500 list-disc pl-4 space-y-1">
                      <li>Route planning and optimization</li>
                      <li>Student bus assignments</li>
                      <li>Driver information management</li>
                      <li>Stop scheduling and timing management</li>
                    </ul>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
            
            {/* User Management */}
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-yellow-100">
              <div className="flex items-start mb-4">
                <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600 mr-4">
                  <Shield size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">User Management</h4>
                  <p className="text-gray-600">
                    Secure user management system with role-based access control. Separate portals for
                    administrators, faculty, students, and bus staff.
                  </p>
                </div>
              </div>
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="link" className="text-yellow-600 p-0 h-auto">Learn more</Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">User Management Features:</h5>
                    <ul className="text-sm text-gray-500 list-disc pl-4 space-y-1">
                      <li>Role-based access control</li>
                      <li>User profile management</li>
                      <li>Secure authentication</li>
                      <li>Password recovery and account management</li>
                    </ul>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
        </div>
        
        {/* Stats and Benefits */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-sm mb-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Why Choose Our System?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]">
              <h4 className="font-semibold text-lg mb-2 text-gray-800">Streamlined Operations</h4>
              <p className="text-gray-600">Reduce administrative overhead by automating routine tasks and centralizing information.</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]">
              <h4 className="font-semibold text-lg mb-2 text-gray-800">Enhanced Communication</h4>
              <p className="text-gray-600">Improve communication between administration, faculty, students, and transportation staff.</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:translate-y-[-2px]">
              <h4 className="font-semibold text-lg mb-2 text-gray-800">Data-Driven Decisions</h4>
              <p className="text-gray-600">Make informed decisions with comprehensive reports and analytics across all modules.</p>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-600 italic">
              "Our management system has helped over 500 colleges streamline their operations and improve student experience."
            </p>
          </div>
        </div>
        
        {/* Getting Started */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Choose your portal from above and log in to access the full range of features tailored to your role.
          </p>
          <Separator className="max-w-md mx-auto" />
        </div>
      </main>
      
      <footer className="bg-gradient-to-r from-gray-50 to-gray-100 py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600 font-medium">&copy; {new Date().getFullYear()} College Management System. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
