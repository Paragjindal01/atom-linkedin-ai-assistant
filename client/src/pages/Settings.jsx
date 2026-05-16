import React from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { Settings as SettingsIcon, User, Shield, Server, Activity, LogOut, CheckCircle2, Cpu, LayoutDashboard, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const Settings = () => {
  const { user, logout } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-cyan-400" />
            Platform Settings
          </h1>
          <p className="text-slate-400">
            Manage your account preferences and view platform configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Account & Security */}
          <div className="lg:col-span-7 space-y-8">

            {/* Account Information Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Account Information</h2>
                  <p className="text-sm text-slate-400">Your personal identity details</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
                    <div className="text-white font-medium bg-black/40 border border-white/5 rounded-xl py-3 px-4">
                      {user?.name || "Not available"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
                    <div className="text-white font-medium bg-black/40 border border-white/5 rounded-xl py-3 px-4">
                      {user?.email || "Not available"}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <p className="text-sm text-slate-500">You are securely authenticated.</p>
                  <Button variant="secondary" onClick={logout} className="flex items-center gap-2 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Application Settings (Placeholder) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Application Settings</h2>
                  <p className="text-sm text-slate-400">Preferences and security</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="font-medium text-white mb-1">Dark Mode Interface</p>
                    <p className="text-sm text-slate-400">Atom defaults to a dark futuristic theme.</p>
                  </div>
                  <div className="w-12 h-6 bg-cyan-500 rounded-full relative cursor-not-allowed opacity-80">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="font-medium text-white mb-1">Email Notifications</p>
                    <p className="text-sm text-slate-400">Receive campaign summary reports.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-not-allowed opacity-80">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-slate-400 rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div>
                    <p className="font-medium text-white mb-1">Change Password</p>
                    <p className="text-sm text-slate-400">Update your account password.</p>
                  </div>
                  <Button variant="secondary" className="px-4 py-2 text-sm" disabled>Update</Button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: System & Branding */}
          <div className="lg:col-span-5 space-y-8">

            {/* API Status Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-pink-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">System Status</h2>
                  <p className="text-sm text-slate-400">Platform connection details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Backend API</p>
                      <p className="text-sm text-white font-mono">http://localhost:5001</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Frontend Client</p>
                      <p className="text-sm text-white font-mono">http://localhost:5174</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">OpenAI Engine</p>
                      <p className="text-sm text-amber-400">Pending API Key</p>
                    </div>
                  </div>
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </motion.div>

            {/* Branding Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel rounded-3xl p-8 relative overflow-hidden text-center"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[50px] rounded-full"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full"></div>

              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(170,59,255,0.4)]">
                  <Cpu className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-2">Atom</h3>
                <p className="text-cyan-400 font-medium tracking-wide text-sm mb-4">AI MARKETING SAAS PLATFORM</p>
                <div className="w-12 h-1 bg-white/10 mx-auto rounded-full mb-6"></div>

                <p className="text-slate-400 text-sm">
                  Version 1.0.0 (Enterprise)<br />
                  © {new Date().getFullYear()} Atom Engine Inc.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
