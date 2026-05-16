import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, Menu } from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans flex">
      {/* Background Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none animate-orb" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-900/10 blur-[150px] pointer-events-none animate-orb-slow" />

      <Sidebar />

      <div className="flex-1 lg:ml-64 relative z-10 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 border-b border-white/5 backdrop-blur-xl bg-[#0a0f25]/50 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-400 hover:text-white">
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent hidden sm:block">
              Workspace Overview
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-slate-400 hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-purple-500 rounded-full border border-[#0a0f25]"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-white">{user?.name || "Not available"}</p>
                <p className="text-xs text-slate-400">{user?.email || "Not available"}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-cyan-400 font-bold">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <button onClick={logout} className="ml-2 text-slate-400 hover:text-red-400 transition-colors" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
