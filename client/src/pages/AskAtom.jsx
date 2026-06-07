import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { generateContent } from '../api/content';
import { getBusinessProfile } from '../api/businessProfile';
import { getCampaigns } from '../api/campaigns';
import { Bot, Sparkles, AlertCircle, Copy, CheckCircle2, Loader2, Link as LinkIcon, Type, Hash, MessageSquare, TrendingUp, Database } from 'lucide-react';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const MODES = [
  {
    id: 'LinkedIn Post',
    label: 'LinkedIn Post',
    icon: TrendingUp,
    content_type: 'LinkedIn Post',
  },
  {
    id: 'Comment Reply',
    label: 'Comment Reply',
    icon: MessageSquare,
    content_type: 'LinkedIn Comment Reply',
  },
  {
    id: 'Sales Reply',
    label: 'Sales Reply',
    icon: TrendingUp,
    content_type: 'Sales Reply',
  },
  {
    id: 'Internal Knowledge',
    label: 'Internal Knowledge',
    icon: Database,
    content_type: 'Internal Knowledge Query',
  },
];

const MODE_META = {
  'LinkedIn Post': {
    textareaLabel: 'Topic / Instructions',
    textareaPlaceholder: 'What should this post be about? Be specific.',
    showContentType: true,
    showPlatform: true,
    showKeywords: true,
    showWordCount: true,
  },
  'Comment Reply': {
    textareaLabel: 'Paste LinkedIn Comment / Post Text',
    textareaPlaceholder: 'Paste the comment or post you want to reply to...',
    showContentType: false,
    showPlatform: false,
    showKeywords: false,
    showWordCount: false,
  },
  'Sales Reply': {
    textareaLabel: 'Paste Prospect Message or Context',
    textareaPlaceholder: 'Paste the prospect message or describe the sales context...',
    showContentType: false,
    showPlatform: false,
    showKeywords: false,
    showWordCount: false,
  },
  'Internal Knowledge': {
    textareaLabel: 'Your Question or Query',
    textareaPlaceholder: 'Ask anything about your business, market, or strategy...',
    showContentType: false,
    showPlatform: false,
    showKeywords: false,
    showWordCount: false,
  },
};

const modeAccentMap = {
  'LinkedIn Post': 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10',
  'Comment Reply': 'border-purple-500/30 text-purple-400 bg-purple-500/10',
  'Sales Reply': 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
  'Internal Knowledge': 'border-amber-500/30 text-amber-400 bg-amber-500/10',
};

const AskAtom = () => {
  const [profiles, setProfiles] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const [mode, setMode] = useState('LinkedIn Post');

  const [formData, setFormData] = useState({
    business_profile_id: '',
    campaign_id: '',
    content_type: 'LinkedIn Post',
    platform: 'LinkedIn',
    tone: 'Professional',
    topic: '',
    keywords: '',
    word_count: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profilesData, campaignsData] = await Promise.all([
          getBusinessProfile(),
          getCampaigns(),
        ]);
        setProfiles(profilesData);
        setCampaigns(campaignsData);
        if (profilesData && profilesData.length > 0) {
          setFormData(prev => ({ ...prev, business_profile_id: profilesData[0].id }));
        }
      } catch (err) {
        console.error('Failed to load setup data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleModeSwitch = (newMode) => {
    const modeConfig = MODES.find(m => m.id === newMode);
    setMode(newMode);
    setResult(null);
    setErrorMsg('');
    setFormData(prev => ({
      ...prev,
      content_type: modeConfig?.content_type || newMode,
      topic: '',
      keywords: '',
      word_count: '',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setErrorMsg('');
    setResult(null);

    const modeConfig = MODES.find(m => m.id === mode);
    const payload = {
      ...formData,
      content_type: modeConfig?.content_type || mode,
    };

    if (!payload.campaign_id) delete payload.campaign_id;
    if (!payload.keywords) delete payload.keywords;
    if (!payload.word_count) delete payload.word_count;

    // Remove fields not relevant to non-post modes
    const meta = MODE_META[mode];
    if (!meta.showPlatform) delete payload.platform;
    if (!meta.showKeywords) delete payload.keywords;
    if (!meta.showWordCount) delete payload.word_count;

    try {
      const data = await generateContent(payload);
      setResult(data.content || data.result);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to generate content.');
    } finally {
      setGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse">Initializing AI Assistant...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (profiles.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center mt-20">
          <div className="glass-panel rounded-3xl p-12 border border-amber-500/20">
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">Set up company context first.</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Before AltaAI Assistant can generate targeted content, it needs company context configured.
            </p>
            <Link to="/business-profile">
              <Button variant="primary">Configure Company Context</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const inputClass = 'w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all';
  const labelClass = 'block text-sm font-medium text-slate-300 mb-2 ml-1';

  const contentTypes = ['LinkedIn Post', 'Instagram Caption', 'Cold Email', 'Ad Copy', 'Blog Intro', 'Hashtags', 'Call To Action'];
  const platforms = ['LinkedIn', 'Instagram', 'Email', 'Google Ads', 'Facebook', 'Blog'];
  const tones = ['Professional', 'Friendly', 'Luxury', 'Casual', 'Witty', 'Urgent'];

  const meta = MODE_META[mode];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Bot className="w-8 h-8 text-cyan-400" />
              AltaAI Assistant
            </h1>
            <p className="text-slate-400">
              Internal workspace for sales, marketing, LinkedIn content, and company knowledge.
            </p>
          </div>
        </div>

        {/* Mode Tabs — full-width above the two-column layout */}
        <div className="flex bg-[#0f172a] p-1 rounded-2xl mb-8 border border-white/10 gap-1">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => handleModeSwitch(m.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
                  ? `${modeAccentMap[m.id]} border`
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{m.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Form */}
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            className="lg:col-span-5 glass-panel rounded-3xl p-8"
          >
            <form onSubmit={handleGenerate} className="space-y-6">
              {/* Connection Context */}
              <div className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl">
                <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-purple-400" /> Workspace Context
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-4 py-3 bg-[#0f172a] border border-white/10 rounded-xl">
                    <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                    <span className="text-sm text-slate-300">AltaAI company context active</span>
                  </div>
                  <div>
                    <label className={labelClass}>Campaign (Optional)</label>
                    <select
                      name="campaign_id"
                      value={formData.campaign_id}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none bg-[#0f172a]`}
                    >
                      <option value="">No Campaign</option>
                      {campaigns.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Content Type + Platform — LinkedIn Post only */}
              {meta.showContentType && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Content Type</label>
                    <select name="content_type" value={formData.content_type} onChange={handleChange} className={`${inputClass} appearance-none bg-[#0f172a]`}>
                      {contentTypes.map(ct => <option key={ct} value={ct}>{ct}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Platform</label>
                    <select name="platform" value={formData.platform} onChange={handleChange} className={`${inputClass} appearance-none bg-[#0f172a]`}>
                      {platforms.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Tone */}
              <div>
                <label className={labelClass}>Tone of Voice</label>
                <select name="tone" value={formData.tone} onChange={handleChange} className={`${inputClass} appearance-none bg-[#0f172a]`}>
                  {tones.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Dynamic Textarea */}
              <div>
                <label className={labelClass}>{meta.textareaLabel}</label>
                <textarea
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  className={`${inputClass} min-h-[100px] resize-y`}
                  placeholder={meta.textareaPlaceholder}
                  required
                />
              </div>

              {/* Keywords + Word Count — LinkedIn Post only */}
              {meta.showKeywords && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Keywords (Optional)</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        name="keywords"
                        value={formData.keywords}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`}
                        placeholder="AI, SaaS..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Word Count (Opt)</label>
                    <div className="relative">
                      <Type className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                      <input
                        type="number"
                        name="word_count"
                        value={formData.word_count}
                        onChange={handleChange}
                        className={`${inputClass} pl-10`}
                        placeholder="e.g. 200"
                      />
                    </div>
                  </div>
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full py-4 text-lg mt-4 group" disabled={generating}>
                {generating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Generate with AI
                    <Sparkles className="w-5 h-5 text-white group-hover:rotate-12 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          </motion.div>

          {/* Output Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7"
          >
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-6 flex items-start gap-4"
              >
                <AlertCircle className="w-8 h-8 text-red-400 shrink-0" />
                <div>
                  <h3 className="text-red-400 font-bold mb-1">Generation Failed</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{errorMsg}</p>
                </div>
              </motion.div>
            )}

            <div className="glass-panel rounded-3xl h-full min-h-[500px] flex flex-col relative overflow-hidden border border-white/5">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-cyan-500"></div>

              <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Bot className="w-5 h-5 text-purple-400" />
                  AI Assistant Output
                </h3>
                {result && (
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                )}
              </div>

              <div className="p-6 flex-1 overflow-y-auto">
                <AnimatePresence mode="wait">
                  {generating ? (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-slate-500 space-y-6"
                    >
                      <div className="relative">
                        <div className="w-20 h-20 rounded-full border-2 border-white/10 border-t-cyan-400 animate-spin"></div>
                        <Bot className="w-8 h-8 text-cyan-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div className="text-center space-y-2">
                        <p className="text-cyan-400 font-medium animate-pulse">Analyzing business profile...</p>
                        <p className="text-sm">Synthesizing {formData.tone.toLowerCase()} response...</p>
                      </div>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="prose prose-invert max-w-none"
                    >
                      <div className="whitespace-pre-wrap text-slate-300 leading-relaxed font-medium">
                        {result}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-slate-500 text-center max-w-md mx-auto"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <Sparkles className="w-8 h-8 text-slate-600" />
                      </div>
                      <p>Select a mode, fill out the parameters, and click "Generate with AI" to get started.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AskAtom;
