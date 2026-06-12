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
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Share2 className="w-8 h-8 text-indigo-600" />
            LinkedIn Automation
          </h1>
          <p className="text-slate-500">
            Connect your LinkedIn account to automate posting and comment replies.
          </p>
        </div>

        {authError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{authError}</p>
          </motion.div>
        )}

        {successMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 text-green-600 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{successMsg}</p>
          </motion.div>
        )}

        <div className="bg-white rounded-xl p-8 mb-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${status.connected && !status.expired ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                <LinkIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">
                  {status.account?.organizationId ? `${status.account.organizationName} (Page)` : 'LinkedIn Account'}
                </h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status.connected && !status.expired ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                  <span className="text-sm text-slate-500">
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{orgSuccessMsg}</p>
          </motion.div>
        )}

        {status.connected && !status.expired && (
          <div className="bg-white rounded-xl p-8 mb-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-500" />
                Publishing Target
              </h3>
            </div>
            
            <p className="text-sm text-slate-500 mb-6">
              Select where Atom should publish your content. You can publish to your personal profile or any company page you administer.
            </p>

            {loadingOrgs ? (
              <div className="text-center py-6">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-2"></div>
                <p className="text-slate-400 text-sm">Loading your pages...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => handleSelectOrg(null, null)}
                  className={`text-left p-4 rounded-xl border transition-all ${!status.account?.organizationId ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <LinkIcon className="w-5 h-5 text-slate-400" />
                    </div>
                    {!status.account?.organizationId && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                  </div>
                  <h4 className="font-bold text-slate-800 mb-1">Personal Profile</h4>
                  <p className="text-xs text-slate-400">Publish as yourself</p>
                </button>

                {organizations.map(org => (
                  <button
                    key={org.id}
                    onClick={() => handleSelectOrg(org.id, org.name)}
                    className={`text-left p-4 rounded-xl border transition-all ${status.account?.organizationId === org.id ? 'bg-indigo-50 border-indigo-200 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                        <Building2 className="w-5 h-5 text-indigo-500" />
                      </div>
                      {status.account?.organizationId === org.id && <CheckCircle2 className="w-5 h-5 text-indigo-500" />}
                    </div>
                    <h4 className="font-bold text-slate-800 mb-1 line-clamp-1">{org.name}</h4>
                    <p className="text-xs text-slate-400">Company Page</p>
                  </button>
                ))}
              </div>
            )}
            {organizations.length === 0 && !loadingOrgs && (
              <p className="text-xs text-slate-400 mt-4 italic">
                No company pages found. Company page publishing may require additional LinkedIn API approval.
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-indigo-500" />
                Scheduled Posts
              </h3>
            </div>
            
            {!status.connected ? (
              <div className="text-center py-10">
                <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Connect your LinkedIn account to view and manage scheduled posts.</p>
              </div>
            ) : scheduledPosts.length === 0 ? (
              <div className="text-center py-10">
                <CalendarClock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No posts scheduled yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scheduledPosts.map(post => (
                  <div key={post.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium px-2 py-1 bg-indigo-50 text-indigo-600 rounded-md uppercase tracking-wide">
                        {post.status}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(post.scheduled_for).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{post.post_text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <MessageSquareText className="w-5 h-5 text-amber-500" />
                Comment Automation
              </h3>
              <span className="px-3 py-1 bg-slate-100 text-slate-400 text-xs rounded-full border border-slate-200">Coming Soon</span>
            </div>
            
            <div className="text-center py-10">
              <Bot className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 font-medium mb-2">AI Reply Assistant</p>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
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
