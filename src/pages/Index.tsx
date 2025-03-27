
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  UserCircle, Users, BookOpen, Bus, ChevronRight
} from 'lucide-react';

const roleData = [
  {
    title: 'Admin',
    icon: <UserCircle className="h-8 w-8" />,
    description: 'Manage faculty, students, and bus staff records',
    path: '/admin/login',
    color: 'bg-purple-50 border-purple-200 text-purple-700'
  },
  {
    title: 'Faculty',
    icon: <BookOpen className="h-8 w-8" />,
    description: 'Take attendance, search students, and edit details',
    path: '/faculty/login',
    color: 'bg-blue-50 border-blue-200 text-blue-700'
  },
  {
    title: 'Student',
    icon: <Users className="h-8 w-8" />,
    description: 'Check attendance, marks, and bus routes',
    path: '/student/login',
    color: 'bg-green-50 border-green-200 text-green-700'
  },
  {
    title: 'Bus Staff',
    icon: <Bus className="h-8 w-8" />,
    description: 'Manage bus routes and schedules',
    path: '/busstaff/login',
    color: 'bg-amber-50 border-amber-200 text-amber-700'
  }
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold tracking-tight">
                Campus ID
              </h1>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button asChild>
              <Link to="/admin/login">
                Get Started
              </Link>
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Hero section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            College ID Management System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            A comprehensive solution for digital attendance marking, student information management, and campus services access.
          </p>
          <div className="space-x-4">
            <Button asChild size="lg">
              <Link to="/admin/login">
                Admin Portal
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/student/login">
                Student Login
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Roles section */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-muted/30">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Select Your Role
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            Access features tailored to your specific role within the institution.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roleData.map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to={role.path} className="block h-full">
                <div className={`rounded-xl border p-6 h-full flex flex-col hover:shadow-md transition-shadow ${role.color}`}>
                  <div className="mb-4">
                    {role.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
                  <p className="text-muted-foreground mb-4 flex-grow">{role.description}</p>
                  <div className="flex items-center text-sm font-medium">
                    Access Portal <ChevronRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-4"
          >
            Key Features
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-muted-foreground max-w-xl mx-auto"
          >
            Our system offers a comprehensive set of features designed to streamline campus operations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'ID Card Scanning',
              description: 'Mark attendance by scanning QR or barcode on ID cards',
              icon: <QrCode className="h-10 w-10 text-primary" />
            },
            {
              title: 'Attendance Management',
              description: 'Track and manage student attendance records',
              icon: <Users className="h-10 w-10 text-primary" />
            },
            {
              title: 'Student Information',
              description: 'Maintain comprehensive student profiles',
              icon: <BookOpen className="h-10 w-10 text-primary" />
            },
            {
              title: 'Bus Route Management',
              description: 'Manage and update campus bus routes',
              icon: <Bus className="h-10 w-10 text-primary" />
            },
            {
              title: 'Alternative Verification',
              description: 'Secondary verification with photo/video evidence',
              icon: <Camera className="h-10 w-10 text-primary" />
            },
            {
              title: 'Search Functionality',
              description: 'Quickly find student records and information',
              icon: <Search className="h-10 w-10 text-primary" />
            }
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Campus ID Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
