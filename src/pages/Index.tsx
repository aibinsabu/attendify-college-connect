
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DatabaseStatus from '@/components/DatabaseStatus';

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-white">College Management System</h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Welcome to College Management System</h2>
          <DatabaseStatus />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-blue-100">
              <h3 className="text-xl font-semibold mb-2">Admin Portal</h3>
              <p className="text-gray-600 mb-4">Manage the entire system, users, and settings</p>
              <Link to="/admin/login">
                <Button className="w-full">Admin Login</Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-green-100">
              <h3 className="text-xl font-semibold mb-2">Faculty Portal</h3>
              <p className="text-gray-600 mb-4">Manage classes, attendance, and student marks</p>
              <Link to="/faculty/login">
                <Button variant="secondary" className="w-full">Faculty Login</Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-yellow-100">
              <h3 className="text-xl font-semibold mb-2">Student Portal</h3>
              <p className="text-gray-600 mb-4">View attendance, marks, and manage profile</p>
              <Link to="/student/login">
                <Button variant="outline" className="w-full">Student Login</Button>
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-purple-100">
              <h3 className="text-xl font-semibold mb-2">Bus Staff Portal</h3>
              <p className="text-gray-600 mb-4">Manage transportation and routes</p>
              <Link to="/busstaff/login">
                <Button variant="ghost" className="w-full border">Bus Staff Login</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-100 py-4 border-t">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} College Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
