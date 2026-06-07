import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { getBusinessProfile, createBusinessProfile, updateBusinessProfile } from '../api/businessProfile';
import { Briefcase, Loader2, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import Button from '../components/Button';
import { motion } from 'framer-motion';

const BusinessProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    business_name: '',
    industry: '',
    product_service_description: '',
    target_audience: '',
    brand_tone: '',
    marketing_goal: '',
    website_url: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getBusinessProfile();
        if (data && data.length > 0) {
          setProfile(data[0]);
          setFormData({
            business_name: data[0].business_name || '',
            industry: data[0].industry || '',
            product_service_description: data[0].product_service_description || '',
            target_audience: data[0].target_audience || '',
            brand_tone: data[0].brand_tone || '',
            marketing_goal: data[0].marketing_goal || '',
            website_url: data[0].website_url || ''
          });
        }
      } catch (err) {
        console.error("No profile found or error fetching", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      if (profile && profile.id) {
        const updated = await updateBusinessProfile(profile.id, formData);
        setProfile(updated);
        setStatusMsg({ type: 'success', text: 'Company context successfully updated.' });
      } else {
        const created = await createBusinessProfile(formData);
        setProfile(created);
        setStatusMsg({ type: 'success', text: 'Company context successfully created.' });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: err.response?.data?.error || 'Failed to save company context.' });
    } finally {
      setSaving(false);
      setTimeout(() => {
        setStatusMsg((prev) => prev.type === 'success' ? { type: '', text: '' } : prev);
      }, 3000);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse">Loading company context...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all";
  const labelClass = "block text-sm font-medium text-slate-300 mb-2 ml-1";

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Briefcase className="w-8 h-8 text-cyan-400" />
            Company Context
          </h1>
          <p className="text-slate-400">
            Configure AltaAI's internal company context. This information powers the AI assistant across sales, marketing, LinkedIn, and knowledge workflows.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-8 md:p-10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500"></div>

          {statusMsg.text && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
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

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className={labelClass}>Company Name</label>
                <input 
                  type="text" 
                  name="business_name" 
                  value={formData.business_name} 
                  onChange={handleChange} 
                  className={inputClass} 
                  placeholder="e.g. Acme Corp" 
                  required 
                />
              </div>
              
              <div>
                <label className={labelClass}>Industry</label>
                <input 
                  type="text" 
                  name="industry" 
                  value={formData.industry} 
                  onChange={handleChange} 
                  className={inputClass} 
                  placeholder="e.g. B2B SaaS" 
                  required 
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelClass}>Product / Service Description</label>
                <textarea 
                  name="product_service_description" 
                  value={formData.product_service_description} 
                  onChange={handleChange} 
                  className={`${inputClass} min-h-[120px] resize-y`} 
                  placeholder="Describe what you sell and the main value proposition..." 
                  required 
                />
              </div>

              <div>
                <label className={labelClass}>Target Audience</label>
                <input 
                  type="text" 
                  name="target_audience" 
                  value={formData.target_audience} 
                  onChange={handleChange} 
                  className={inputClass} 
                  placeholder="e.g. Marketing Managers, SMB Owners" 
                  required 
                />
              </div>

              <div>
                <label className={labelClass}>Brand Tone</label>
                <select 
                  name="brand_tone" 
                  value={formData.brand_tone} 
                  onChange={handleChange} 
                  className={`${inputClass} appearance-none bg-black/40`}
                  required
                >
                  <option value="" disabled>Select a tone</option>
                  <option value="Professional">Professional & Authoritative</option>
                  <option value="Casual">Casual & Friendly</option>
                  <option value="Humorous">Humorous & Witty</option>
                  <option value="Excited">Excited & Energetic</option>
                  <option value="Empathetic">Empathetic & Supportive</option>
                  <option value="Luxurious">Luxurious & Premium</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Primary Marketing Goal</label>
                <input 
                  type="text" 
                  name="marketing_goal" 
                  value={formData.marketing_goal} 
                  onChange={handleChange} 
                  className={inputClass} 
                  placeholder="e.g. Lead Generation, Brand Awareness" 
                  required 
                />
              </div>

              <div>
                <label className={labelClass}>Website URL (Optional)</label>
                <input 
                  type="url" 
                  name="website_url" 
                  value={formData.website_url} 
                  onChange={handleChange} 
                  className={inputClass} 
                  placeholder="https://example.com" 
                />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-end">
              <Button type="submit" variant="primary" className="min-w-[200px]" disabled={saving}>
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="w-5 h-5" />
                    {profile ? 'Update Context' : 'Save Context'}
                  </span>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default BusinessProfile;
