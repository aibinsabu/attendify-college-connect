
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryProvider } from "./providers/QueryProvider";

// Pages
import HomePage from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";
import FacultyLogin from "./pages/faculty/FacultyLogin";
import FacultySignup from "./pages/faculty/FacultySignup";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import StudentLogin from "./pages/student/StudentLogin";
import StudentSignup from "./pages/student/StudentSignup";
import StudentDashboard from "./pages/student/StudentDashboard";
import BusStaffLogin from "./pages/busstaff/BusStaffLogin";
import BusStaffSignup from "./pages/busstaff/BusStaffSignup";
import BusStaffDashboard from "./pages/busstaff/BusStaffDashboard";

// Temporarily remove React Query to fix the initialization issue

function App() {
  return (
    <QueryProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              
              {/* Faculty Routes */}
              <Route path="/faculty/login" element={<FacultyLogin />} />
              <Route path="/faculty/signup" element={<FacultySignup />} />
              <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
              
              {/* Student Routes */}
              <Route path="/student/login" element={<StudentLogin />} />
              <Route path="/student/signup" element={<StudentSignup />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              
              {/* Bus Staff Routes */}
              <Route path="/busstaff/login" element={<BusStaffLogin />} />
              <Route path="/busstaff/signup" element={<BusStaffSignup />} />
              <Route path="/busstaff/dashboard" element={<BusStaffDashboard />} />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryProvider>
  );
}

export default App;
