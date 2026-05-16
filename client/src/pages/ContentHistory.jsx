import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { getContentHistory, deleteContent, updateContentStatus } from '../api/content';
import { getLinkedInStatus, publishPostToLinkedIn } from '../api/linkedin';
import { History, Copy, Trash2, CheckCircle2, AlertCircle, Calendar, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [copiedId, setCopiedId] = useState(null);
  const [linkedinConnected, setLinkedinConnected] = useState(false);
  const [failedPublishes, setFailedPublishes] = useState(new Set());

  useEffect(() => {
    fetchHistory();
    checkLinkedIn();
  }, []);

  const checkLinkedIn = async () => {
    try {
      const status = await getLinkedInStatus();
      setLinkedinConnected(status.connected && !status.expired);
    } catch (err) {
      console.error("Failed to check LinkedIn status", err);
    }
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getContentHistory();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch history", err);
      showMessage('error', 'Failed to load content history.');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this generated content?")) return;
    try {
      await deleteContent(id);
      showMessage('success', 'Content deleted successfully.');
      setHistory(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      showMessage('error', 'Failed to delete content.');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateContentStatus(id, status);
      setHistory(prev => prev.map(item => item.id === id ? { ...item, publishing_status: status } : item));
      showMessage('success', `Content marked as ${status}.`);
    } catch (err) {
      showMessage('error', `Failed to mark content as ${status}.`);
    }
  };

  const handlePublishToLinkedIn = async (id) => {
    try {
      setLoading(true);
      await publishPostToLinkedIn(id);
      setHistory(prev => prev.map(item => item.id === id ? { ...item, publishing_status: 'posted' } : item));
      showMessage('success', 'Successfully published to LinkedIn!');
      setFailedPublishes(prev => { const n = new Set(prev); n.delete(id); return n; });
    } catch (err) {
      showMessage('error', err.response?.data?.error || err.message || 'Failed to publish to LinkedIn.');
      setFailedPublishes(prev => new Set(prev).add(id));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse">Loading Content History...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <History className="w-8 h-8 text-cyan-400" />
            Content History
          </h1>
          <p className="text-slate-400">
            View, copy, or delete previously generated marketing content.
          </p>
        </div>

        {statusMsg.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-xl flex items-start gap-3 ${
              statusMsg.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
            <p className="text-sm font-medium">{statusMsg.text}</p>
          </motion.div>
        )}

        {history.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center border border-white/5 mt-10">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-6">
              <Bot className="w-10 h-10 text-cyan-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No content generated yet</h3>
            <p className="text-slate-400 max-w-lg mx-auto mb-8">
              Head over to "Ask Atom" to generate your first piece of AI-powered marketing copy.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {history.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-panel p-6 rounded-3xl relative group border border-white/5 overflow-hidden flex flex-col md:flex-row gap-6 items-start"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-500 to-purple-500"></div>
                  
                  {/* Metadata Column */}
                  <div className="w-full md:w-1/3 shrink-0 space-y-4">
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.created_at).toLocaleString()}
                    </div>

                    <div>
                      <h4 className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Topic</h4>
                      <p className="text-white font-medium">{item.topic}</p>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="px-3 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {item.content_type}
                      </span>
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        {item.platform}
                      </span>
                      <span className="px-3 py-1 text-xs rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
                        {item.tone}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full border ${
                        item.publishing_status === 'posted' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        item.publishing_status === 'approved' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                        'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {(item.publishing_status || 'draft').toUpperCase()}
                      </span>
                    </div>

                    <div className="pt-4 flex flex-wrap gap-3">
                      <button 
                        onClick={() => copyToClipboard(item.id, item.result)}
                        className="flex items-center gap-2 text-sm text-white bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl transition-colors border border-white/10"
                      >
                        {copiedId === item.id ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                        {copiedId === item.id ? 'Copied!' : 'Copy'}
                      </button>

                      {(!item.publishing_status || item.publishing_status === 'draft') && (
                        <button 
                          onClick={() => handleUpdateStatus(item.id, 'approved')}
                          className="flex items-center gap-2 text-sm bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl transition-colors border border-blue-500/20"
                        >
                          Approve
                        </button>
                      )}

                      {item.publishing_status === 'approved' && (
                        <div className="flex gap-2">
                          {item.content_type === 'LinkedIn Post' && linkedinConnected && (
                            <button 
                              onClick={() => handlePublishToLinkedIn(item.id)}
                              disabled={loading}
                              className="flex items-center gap-2 text-sm bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-4 py-2 rounded-xl transition-colors border border-cyan-500/20 disabled:opacity-50"
                            >
                              Publish to LinkedIn
                            </button>
                          )}
                          
                          {(item.content_type !== 'LinkedIn Post' || !linkedinConnected || failedPublishes.has(item.id)) && (
                            <button 
                              onClick={() => handleUpdateStatus(item.id, 'posted')}
                              className="flex items-center gap-2 text-sm bg-green-500/10 hover:bg-green-500/20 text-green-400 px-4 py-2 rounded-xl transition-colors border border-green-500/20"
                            >
                              Mark Posted
                            </button>
                          )}
                        </div>
                      )}

                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="flex items-center justify-center text-slate-400 hover:text-red-400 hover:bg-red-500/10 px-3 py-2 rounded-xl transition-colors"
                        title="Delete Content"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content Column */}
                  <div className="w-full md:w-2/3 bg-black/40 rounded-2xl p-5 border border-white/5">
                    <div className="prose prose-invert max-w-none text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {item.result}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ContentHistory;
