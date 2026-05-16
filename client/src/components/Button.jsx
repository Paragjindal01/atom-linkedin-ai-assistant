import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#020617] cursor-pointer overflow-hidden relative group";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(170,59,255,0.4)] px-6 py-3",
    secondary: "bg-white/5 text-white backdrop-blur-md border border-white/10 px-6 py-3",
    ghost: "text-slate-300 hover:text-white px-4 py-2",
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyle} ${variants[variant]} ${className}`} 
      {...props}
    >
      {/* Shine effect for primary button */}
      {variant === 'primary' && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
      )}
      {/* Hover glow for secondary button */}
      {variant === 'secondary' && (
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </motion.button>
  );
};

export default Button;
