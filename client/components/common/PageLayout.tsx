import React from 'react';
import { Navbar } from './Navbar';
import { motion } from 'framer-motion';

interface PageLayoutProps {
  children: React.ReactNode;
  noTopPadding?: boolean;
  fullWidth?: boolean;
}

export function PageLayout({ 
  children, 
  noTopPadding = false,
  fullWidth = false 
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${noTopPadding ? '' : 'pt-12'} pb-12 ${fullWidth ? '' : 'px-4 sm:px-6 lg:px-8'}`}
      >
        <div className={fullWidth ? 'w-full' : 'max-w-4xl mx-auto'}>
          {children}
        </div>
      </motion.div>
    </div>
  );
} 