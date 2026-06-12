import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer overflow-hidden relative";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm px-6 py-3",
    secondary: "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 px-6 py-3",
    ghost: "text-slate-600 hover:text-slate-800 hover:bg-slate-100 px-4 py-2",
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </motion.button>
  );
};

export default Button;
