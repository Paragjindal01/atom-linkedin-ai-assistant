import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow"
    >
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
        <Icon className="w-24 h-24 text-indigo-600" />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        </div>
        <div className="text-4xl font-bold text-slate-800 tracking-tight">{value}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;
