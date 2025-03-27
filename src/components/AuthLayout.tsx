
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  role: string;
  alternateAuthPath: string;
  alternateAuthText: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  role,
  alternateAuthPath,
  alternateAuthText
}) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="card-effect glass-effect p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/">
                <h2 className="text-2xl font-bold tracking-tight mb-1">Campus ID</h2>
              </Link>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{role} Portal</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold mt-6 mb-2">{title}</h1>
              <p className="text-muted-foreground">{subtitle}</p>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {children}
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-sm"
          >
            <Link 
              to={alternateAuthPath} 
              className="text-primary hover:underline button-transition"
            >
              {alternateAuthText}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
