import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../api/dashboard';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import { Target, Bot, Briefcase, Activity, Calendar, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse">Loading workspace...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="bg-white rounded-xl p-8 flex flex-col items-center text-center max-w-lg mx-auto mt-20 border border-red-200 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Failed to load stats</h3>
          <p className="text-slate-500">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  const isEmpty = stats.totalCampaigns === 0 && stats.totalBusinessProfiles === 0 && stats.totalGeneratedContent === 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Workspace Overview</h1>
          <p className="text-slate-500">Here is what is happening with your marketing campaigns today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <StatCard title="Total Campaigns" value={stats.totalCampaigns} icon={Target} delay={0.1} />
          <StatCard title="Active Campaigns" value={stats.activeCampaigns} icon={Activity} delay={0.2} />
          <StatCard title="Generated Content" value={stats.totalGeneratedContent} icon={Bot} delay={0.3} />
          <StatCard title="Business Profiles" value={stats.totalBusinessProfiles} icon={Briefcase} delay={0.4} />
        </div>

        {isEmpty ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-12 text-center mt-12 border border-slate-200 shadow-sm"
          >
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Your workspace is empty</h3>
            <p className="text-slate-500 max-w-lg mx-auto mb-8">
              Start by creating a business profile and your first marketing campaign. Atom is ready to generate content for you.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Target className="w-5 h-5 text-indigo-500" />
                  Recent Campaigns
                </h3>
              </div>

              {stats.recentCampaigns?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentCampaigns.map(campaign => (
                    <div key={campaign.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-700 mb-1">{campaign.name}</p>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                        campaign.status === 'active' ? 'bg-green-50 text-green-600 border border-green-200' :
                        campaign.status === 'draft' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                        'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  No recent campaigns found.
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-500" />
                  Recent Content
                </h3>
              </div>

              {stats.recentGeneratedContent?.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentGeneratedContent.map(content => (
                    <div key={content.id} className="p-4 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-indigo-600">{content.platform}</span>
                        <span className="text-xs text-slate-400">{new Date(content.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-2">{content.topic || content.prompt || 'Generated content'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-lg">
                  No generated content found.
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
