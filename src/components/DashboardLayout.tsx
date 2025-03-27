
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface NavItemProps {
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ title, icon, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${
      active 
        ? 'bg-primary text-primary-foreground' 
        : 'hover:bg-secondary text-foreground'
    } transition-all duration-200`}
  >
    <div className="mr-3">{icon}</div>
    <span className="font-medium">{title}</span>
  </div>
);

const roleColors: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-800',
  faculty: 'bg-blue-100 text-blue-800',
  student: 'bg-green-100 text-green-800',
  busstaff: 'bg-amber-100 text-amber-800'
};

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  currentTab: string;
  navigation: Array<{
    title: string;
    icon: React.ReactNode;
    key: string;
    onClick: () => void;
  }>;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  currentTab,
  navigation
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Mobile menu toggle */}
      <button
        className="lg:hidden fixed z-50 top-4 left-4 p-2.5 rounded-lg bg-background shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <motion.div
        className={`fixed lg:relative z-40 h-full w-[260px] bg-card shadow-xl overflow-hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b">
            <div className="font-bold text-xl">Campus ID</div>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <span className="font-medium">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
              </div>
            </div>
            <div className={`text-xs font-medium uppercase px-2 py-1 rounded mt-3 inline-block ${roleColors[user.role]}`}>
              {user.role}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 py-4 px-3 space-y-1">
            {navigation.map((item) => (
              <NavItem
                key={item.key}
                title={item.title}
                icon={item.icon}
                active={currentTab === item.key}
                onClick={item.onClick}
              />
            ))}
          </div>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button 
              variant="outline" 
              className="w-full justify-start text-muted-foreground"
              onClick={logout}
            >
              <LogOut size={18} className="mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-card shadow-sm z-10">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
