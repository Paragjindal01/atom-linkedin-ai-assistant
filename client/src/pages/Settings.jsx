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
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-indigo-600" />
            Platform Settings
          </h1>
          <p className="text-slate-500">
            Manage your account preferences and view platform configuration.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-7 space-y-8">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-8 relative overflow-hidden border border-slate-200 shadow-sm"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Account Information</h2>
                  <p className="text-sm text-slate-400">Your personal identity details</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                    <div className="text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-lg py-3 px-4">
                      {user?.name || "Not available"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                    <div className="text-slate-800 font-medium bg-slate-50 border border-slate-200 rounded-lg py-3 px-4">
                      {user?.email || "Not available"}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
                  <p className="text-sm text-slate-400">You are securely authenticated.</p>
                  <Button variant="secondary" onClick={logout} className="flex items-center gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-8 relative overflow-hidden border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Application Settings</h2>
                  <p className="text-sm text-slate-400">Preferences and security</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-700 mb-1">Light Mode Interface</p>
                    <p className="text-sm text-slate-400">AltaAI uses a clean professional theme.</p>
                  </div>
                  <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-not-allowed opacity-80">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-700 mb-1">Email Notifications</p>
                    <p className="text-sm text-slate-400">Receive campaign summary reports.</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-300 rounded-full relative cursor-not-allowed opacity-80">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <div>
                    <p className="font-medium text-slate-700 mb-1">Change Password</p>
                    <p className="text-sm text-slate-400">Update your account password.</p>
                  </div>
                  <Button variant="secondary" className="px-4 py-2 text-sm" disabled>Update</Button>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-5 space-y-8">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-8 relative overflow-hidden border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">System Status</h2>
                  <p className="text-sm text-slate-400">Platform connection details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Server className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Backend API</p>
                      <p className="text-sm text-slate-700 font-mono">http://localhost:5001</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">Frontend Client</p>
                      <p className="text-sm text-slate-700 font-mono">http://localhost:5174</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Cpu className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-0.5">OpenAI Engine</p>
                      <p className="text-sm text-amber-500">Pending API Key</p>
                    </div>
                  </div>
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-8 relative overflow-hidden text-center border border-slate-200 shadow-sm"
            >
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-xl bg-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-md">
                  <Cpu className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-slate-800 mb-2">AltaAI</h3>
                <p className="text-indigo-600 font-medium tracking-wide text-sm mb-4">INTERNAL ASSISTANT PLATFORM</p>
                <div className="w-12 h-1 bg-slate-200 mx-auto rounded-full mb-6"></div>

                <p className="text-slate-400 text-sm">
                  Version 1.0.0 (Enterprise)<br />
                  © {new Date().getFullYear()} AltaAI Inc.
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
