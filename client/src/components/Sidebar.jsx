import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Target, Bot, History, Settings, Sparkles, Share2 } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Company Context', path: '/business-profile', icon: Briefcase },
    { name: 'Campaigns', path: '/campaigns', icon: Target },
    { name: 'AI Assistant', path: '/ask-atom', icon: Bot },
    { name: 'Content History', path: '/content-history', icon: History },
    { name: 'LinkedIn Tools', path: '/linkedin-automation', icon: Share2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-white border-r border-slate-200 z-40 hidden lg:flex flex-col shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-800">
            AltaAI
          </span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="text-sm">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
