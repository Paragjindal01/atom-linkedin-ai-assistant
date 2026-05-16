import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:bg-white/[0.05] transition-colors"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-500">
        <Icon className="w-24 h-24 text-cyan-400" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="text-sm font-medium text-slate-400">{title}</h3>
        </div>
        <div className="text-4xl font-bold text-white tracking-tight">{value}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;
