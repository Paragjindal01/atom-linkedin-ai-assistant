import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { getCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../api/campaigns';
import { getBusinessProfile } from '../api/businessProfile';
import { Target, Plus, Loader2, Edit2, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import Button from '../components/Button';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    business_profile_id: '',
    name: '',
    goal: '',
    description: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [campaignsData, profilesData] = await Promise.all([
        getCampaigns(),
        getBusinessProfile()
      ]);
      setCampaigns(campaignsData);
      setProfiles(profilesData);
      
      if (profilesData && profilesData.length > 0) {
        setFormData(prev => ({ ...prev, business_profile_id: profilesData[0].id }));
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
      setStatusMsg({ type: 'error', text: 'Failed to load campaigns.' });
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: '', text: '' }), 3000);
  };

  const handleOpenModal = (campaign = null) => {
    if (campaign) {
      setEditingId(campaign.id);
      setFormData({
        business_profile_id: campaign.business_profile_id,
        name: campaign.name,
        goal: campaign.goal,
        description: campaign.description,
        status: campaign.status
      });
    } else {
      setEditingId(null);
      setFormData({
        business_profile_id: profiles.length > 0 ? profiles[0].id : '',
        name: '',
        goal: '',
        description: '',
        status: 'draft'
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await updateCampaign(editingId, formData);
        showMessage('success', 'Campaign successfully updated.');
      } else {
        await createCampaign(formData);
        showMessage('success', 'Campaign successfully created.');
      }
      handleCloseModal();
      fetchData();
    } catch (err) {
      showMessage('error', err.response?.data?.error || 'Failed to save campaign.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    try {
      await deleteCampaign(id);
      showMessage('success', 'Campaign successfully deleted.');
      fetchData();
    } catch (err) {
      showMessage('error', 'Failed to delete campaign.');
    }
  };

  const handleStatusToggle = async (campaign) => {
    const newStatus = campaign.status === 'active' ? 'draft' : 'active';
    try {
      await updateCampaign(campaign.id, { ...campaign, status: newStatus });
      showMessage('success', `Campaign marked as ${newStatus}.`);
      fetchData();
    } catch (err) {
      showMessage('error', 'Failed to update status.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full min-h-[60vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-400 animate-pulse">Loading Campaigns...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (profiles.length === 0) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto text-center mt-20">
          <div className="bg-white rounded-xl p-12 border border-amber-200 shadow-sm">
            <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Create a business profile first.</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Before creating marketing campaigns, Atom needs to learn about your business to generate accurate content.
            </p>
            <Link to="/business-profile">
              <Button variant="primary">Setup Business Profile</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-lg py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
  const labelClass = "block text-sm font-medium text-slate-600 mb-2 ml-1";

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <Target className="w-8 h-8 text-indigo-600" />
              Campaigns
            </h1>
            <p className="text-slate-500">
              Manage your marketing campaigns and initiatives in one place.
            </p>
          </div>
          <Button variant="primary" onClick={() => handleOpenModal()} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </div>

        {statusMsg.text && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-8 p-4 rounded-lg flex items-start gap-3 ${
              statusMsg.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-600' 
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}
          >
            {statusMsg.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />}
            <p className="text-sm font-medium">{statusMsg.text}</p>
          </motion.div>
        )}

        {campaigns.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-sm">
            <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-indigo-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">No campaigns yet</h3>
            <p className="text-slate-500 max-w-lg mx-auto mb-8">
              Create your first marketing campaign to start organizing your AI generated content.
            </p>
            <Button variant="secondary" onClick={() => handleOpenModal()}>
              Create Campaign
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.map((campaign, idx) => (
              <motion.div 
                key={campaign.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white p-6 rounded-xl relative group hover:shadow-md transition-shadow border border-slate-200 shadow-sm flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-3 py-1 text-xs rounded-full font-medium cursor-pointer transition-colors ${
                    campaign.status === 'active' ? 'bg-green-50 text-green-600 border border-green-200 hover:bg-green-100' : 
                    campaign.status === 'draft' ? 'bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100' : 
                    'bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200'
                  }`} onClick={() => handleStatusToggle(campaign)} title="Click to toggle status">
                    {campaign.status.toUpperCase()}
                  </div>
                  
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(campaign)} className="text-slate-400 hover:text-indigo-600 bg-slate-100 p-2 rounded-lg transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(campaign.id)} className="text-slate-400 hover:text-red-500 bg-slate-100 p-2 rounded-lg transition-colors" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2">{campaign.name}</h3>
                <p className="text-indigo-600 text-sm font-medium mb-3">{campaign.goal}</p>
                <p className="text-slate-500 text-sm flex-1 mb-6">{campaign.description}</p>
                
                <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
                  Created {new Date(campaign.created_at).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/30"
                onClick={handleCloseModal}
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white w-full max-w-lg rounded-xl overflow-hidden relative z-10 border border-slate-200 shadow-xl"
              >
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Target className="w-5 h-5 text-indigo-600" />
                    {editingId ? 'Edit Campaign' : 'New Campaign'}
                  </h2>
                  <button type="button" onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div>
                    <label className={labelClass}>Business Profile</label>
                    <select 
                      name="business_profile_id" 
                      value={formData.business_profile_id} 
                      onChange={handleChange} 
                      className={`${inputClass} appearance-none`}
                      required
                      disabled={profiles.length === 1}
                    >
                      {profiles.map(p => (
                        <option key={p.id} value={p.id}>{p.business_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Campaign Name</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className={inputClass} 
                      placeholder="e.g. Summer Sale 2024" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className={labelClass}>Campaign Goal</label>
                    <input 
                      type="text" 
                      name="goal" 
                      value={formData.goal} 
                      onChange={handleChange} 
                      className={inputClass} 
                      placeholder="e.g. Drive 100 new signups" 
                      required 
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange} 
                      className={`${inputClass} min-h-[100px] resize-y`} 
                      placeholder="Briefly describe the campaign strategy..." 
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Status</label>
                    <select 
                      name="status" 
                      value={formData.status} 
                      onChange={handleChange} 
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="pt-4 flex gap-3 justify-end">
                    <Button type="button" variant="secondary" onClick={handleCloseModal}>
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={saving}>
                      {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Campaign'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default Campaigns;
