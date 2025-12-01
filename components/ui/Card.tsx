import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, noPadding = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onClick={onClick}
      className={`
        bg-white dark:bg-slate-800 
        border border-border dark:border-slate-700
        shadow-looker hover:shadow-looker-hover
        transition-all duration-300
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};