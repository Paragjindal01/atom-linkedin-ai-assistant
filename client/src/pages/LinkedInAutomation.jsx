import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import Button from '../components/Button';
import { getLinkedInStatus, getAuthUrl, getScheduledPosts, getLinkedInOrganizations, selectLinkedInOrganization } from '../api/linkedin';
import { Share2, Link as LinkIcon, CalendarClock, MessageSquareText, AlertCircle, CheckCircle2, Bot, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LinkedInAutomation = () => {
  const [status, setStatus] = useState({ connected: false, loading: true, expired: false });
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [authError, setAuthError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [orgSuccessMsg, setOrgSuccessMsg] = useState('');
  
  const location = useLocation();

  useEffect(() => {
    // Parse URL params for OAuth callbacks
    const params = new URLSearchParams(location.search);
    if (params.get('error')) {
      if (params.get('error') === 'missing_config') {
        setAuthError("LinkedIn API is not configured yet. Missing Client ID/Secret.");
      } else {
        setAuthError("Failed to authenticate with LinkedIn.");
      }
    } else if (params.get('success')) {
      setSuccessMsg("Successfully connected to LinkedIn!");
    }

    fetchStatus();
  }, [location]);

  const fetchStatus = async () => {
    try {
      const data = await getLinkedInStatus();
      setStatus({ ...data, loading: false });
      if (data.connected && !data.expired) {
        fetchPosts();
        fetchOrgs();
      }
    } catch (err) {
      console.error(err);
      setStatus({ connected: false, loading: false });
    }
  };

  const fetchOrgs = async () => {
    try {
      setLoadingOrgs(true);
      const orgs = await getLinkedInOrganizations();
      setOrganizations(orgs);
    } catch (err) {
      console.error("Failed to load organizations", err);
    } finally {
      setLoadingOrgs(false);
    }
  };

  const handleSelectOrg = async (orgId, orgName) => {
    try {
      const res = await selectLinkedInOrganization(orgId, orgName);
      if (res.success) {
        setStatus(prev => ({
          ...prev,
          account: {
            ...prev.account,
            organizationId: orgId,
            organizationName: orgName
          }
        }));
        setOrgSuccessMsg(orgId ? `Selected ${orgName} as default publishing page.` : 'Reverted back to Personal Profile publishing.');
        setTimeout(() => setOrgSuccessMsg(''), 4000);
      }
    } catch (err) {
      setAuthError("Failed to select organization.");
    }
  };

  const fetchPosts = async () => {
    try {
      const posts = await getScheduledPosts();
      setScheduledPosts(posts);
    } catch (err) {
      console.error("Failed to load scheduled posts", err);
    }
  };

  const handleConnect = async () => {
    try {
      const { url } = await getAuthUrl();
      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      setAuthError("Failed to generate LinkedIn authentication URL.");
    }
  };

  if (status.loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Share2 className="w-8 h-8 text-cyan-400" />
            LinkedIn Automation
          </h1>
          <p className="text-slate-400">
            Connect your LinkedIn account to automate posting and comment replies.
          </p>
        </div>

        {authError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{authError}</p>
          </motion.div>
        )}

        {successMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{successMsg}</p>
          </motion.div>
        )}

        {/* Connection Status Card */}
        <div className="glass-panel rounded-3xl p-8 mb-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${status.connected && !status.expired ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-500 border border-white/10'}`}>
                <LinkIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  {status.account?.organizationId ? `${status.account.organizationName} (Page)` : 'LinkedIn Account'}
                </h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.connected && !status.expired ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-500'}`}></div>
                  <span className="text-sm text-slate-300">
                    {status.connected 
                      ? status.expired ? 'Token Expired - Please Reconnect' : 'Connected & Active' 
                      : 'Not Connected'}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <Button 
                variant={status.connected && !status.expired ? 'secondary' : 'primary'} 
                onClick={handleConnect}
              >
                {status.connected ? 'Reconnect LinkedIn' : 'Connect LinkedIn'}
              </Button>
            </div>
          </div>
        </div>

        {orgSuccessMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{orgSuccessMsg}</p>
          </motion.div>
        )}

        {status.connected && !status.expired && (
          <div className="glass-panel rounded-3xl p-8 mb-8 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                Publishing Target
              </h3>
            </div>
            
            <p className="text-sm text-slate-400 mb-6">
              Select where Atom should publish your content. You can publish to your personal profile or any company page you administer.
            </p>

            {loadingOrgs ? (
              <div className="text-center py-6">
                <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-slate-400 text-sm">Loading your pages...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => handleSelectOrg(null, null)}
                  className={`text-left p-4 rounded-2xl border transition-all ${!status.account?.organizationId ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    {!status.account?.organizationId && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <h4 className="font-bold text-white mb-1">Personal Profile</h4>
                  <p className="text-xs text-slate-400">Publish as yourself</p>
                </button>

                {organizations.map(org => (
                  <button
                    key={org.id}
                    onClick={() => handleSelectOrg(org.id, org.name)}
                    className={`text-left p-4 rounded-2xl border transition-all ${status.account?.organizationId === org.id ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'bg-black/40 border-white/5 hover:border-white/10'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-indigo-400" />
                      </div>
                      {status.account?.organizationId === org.id && <CheckCircle2 className="w-5 h-5 text-indigo-400" />}
                    </div>
                    <h4 className="font-bold text-white mb-1 line-clamp-1">{org.name}</h4>
                    <p className="text-xs text-slate-400">Company Page</p>
                  </button>
                ))}
              </div>
            )}
            {organizations.length === 0 && !loadingOrgs && (
              <p className="text-xs text-slate-500 mt-4 italic">
                No company pages found. Company page publishing may require additional LinkedIn API approval.
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scheduled Posts */}
          <div className="glass-panel rounded-3xl p-8 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-purple-400" />
                Scheduled Posts
              </h3>
            </div>
            
            {!status.connected ? (
              <div className="text-center py-10">
                <AlertCircle className="w-10 h-10 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Connect your LinkedIn account to view and manage scheduled posts.</p>
              </div>
            ) : scheduledPosts.length === 0 ? (
              <div className="text-center py-10">
                <CalendarClock className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No posts scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledPosts.map(post => (
                  <div key={post.id} className="bg-black/40 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-cyan-500/10 text-cyan-400 rounded-md uppercase tracking-wide">
                        {post.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(post.scheduled_for).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 line-clamp-2">{post.post_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Comment Automation */}
          <div className="glass-panel rounded-3xl p-8 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-amber-400" />
                Comment Automation
              </h3>
              <span className="px-3 py-1 bg-white/5 text-slate-400 text-xs rounded-full border border-white/10">Coming Soon</span>
            </div>
            
            <div className="text-center py-10">
              <Bot className="w-12 h-12 text-slate-600 mx-auto mb-4 opacity-50" />
              <p className="text-slate-300 font-medium mb-2">AI Reply Assistant</p>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Once connected, Atom will monitor your posts and suggest high-quality replies tailored to AltaAI's messaging.
              </p>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default LinkedInAutomation;
