import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Target, Bot, History, Settings, Sparkles, Share2 } from 'lucide-react';

const Sidebar = () => {
  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Business Profile', path: '/business-profile', icon: Briefcase },
    { name: 'Campaigns', path: '/campaigns', icon: Target },
    { name: 'Ask Atom', path: '/ask-atom', icon: Bot },
    { name: 'Content History', path: '/content-history', icon: History },
    { name: 'LinkedIn Auto', path: '/linkedin-automation', icon: Share2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 fixed inset-y-0 left-0 bg-[#0a0f25]/80 backdrop-blur-2xl border-r border-white/10 z-40 hidden lg:flex flex-col">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(170,59,255,0.4)]">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            Atom
          </span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-white/10 shadow-[0_0_15px_rgba(170,59,255,0.1)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <link.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{link.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
