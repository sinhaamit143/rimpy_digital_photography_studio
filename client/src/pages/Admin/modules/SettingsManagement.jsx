import React, { useState, useEffect } from 'react';
import { 
  Loader2, MapPin, Clock, Phone, Mail, Instagram, Facebook, MessageSquare, Video, Save 
} from 'lucide-react';
import api from '../../../utils/api';

const SettingsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    address: '', workingHours: '', phone: '', email: '',
    instagram: '', facebook: '', whatsapp: '', youtube: ''
  });

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/settings', settings);
      alert('Settings updated successfully!');
    } catch (err) { alert('Failed to update settings'); }
    finally { setIsSaving(false); }
  };

  if (loading) return <div className="py-24 flex flex-col items-center justify-center text-primary"><Loader2 size={40} className="animate-spin mb-4 opacity-20" /><p className="text-[10px] uppercase tracking-widest font-bold">Accessing Vault...</p></div>;

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div>
        <h3 className="text-4xl font-serif text-dark mb-2 italic">Studio Identity</h3>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Configure your public presence and contact points</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-white p-10 border border-gray-100 shadow-sm rounded-sm space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-4">
               <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary"><MapPin size={14} /> Studio Location</label>
               <textarea rows="3" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-primary outline-none font-serif italic text-dark resize-none" placeholder="Enter physical address..." />
             </div>
             <div className="space-y-4">
               <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary"><Clock size={14} /> Working Hours</label>
               <input type="text" value={settings.workingHours} onChange={e => setSettings({...settings, workingHours: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-primary outline-none font-bold text-dark" placeholder="e.g. Mon-Sat: 10AM - 8PM" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-gray-50 pt-10">
             <div className="space-y-4">
               <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary"><Phone size={14} /> Public Phone</label>
               <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-primary outline-none font-bold text-dark" placeholder="+91 XXXXX XXXXX" />
             </div>
             <div className="space-y-4">
               <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary"><Mail size={14} /> Public Email</label>
               <input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-primary outline-none font-bold text-dark" placeholder="hello@studio.com" />
             </div>
          </div>
        </div>

        <div className="bg-white p-10 border border-gray-100 shadow-sm rounded-sm space-y-10">
           <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 flex items-center gap-3">Social Media Presence <div className="h-px bg-gray-100 flex-1" /></h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-pink-600"><Instagram size={14} /> Instagram URL</label>
                <input type="text" value={settings.instagram} onChange={e => setSettings({...settings, instagram: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-pink-600 outline-none font-sans text-xs" />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-blue-600"><Facebook size={14} /> Facebook URL</label>
                <input type="text" value={settings.facebook} onChange={e => setSettings({...settings, facebook: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-blue-600 outline-none font-sans text-xs" />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-green-600"><MessageSquare size={14} /> WhatsApp Number</label>
                <input type="text" value={settings.whatsapp} onChange={e => setSettings({...settings, whatsapp: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-green-600 outline-none font-sans text-xs" placeholder="Incl. country code" />
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-red-600"><Video size={14} /> YouTube Channel</label>
                <input type="text" value={settings.youtube} onChange={e => setSettings({...settings, youtube: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-red-600 outline-none font-sans text-xs" />
              </div>
           </div>
        </div>

        <div className="flex justify-end">
           <button disabled={isSaving} className="flex items-center gap-4 px-12 py-5 bg-dark text-white uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-primary transition-all shadow-2xl rounded-sm group">
             {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} className="group-hover:scale-125 transition-transform" />}
             Update Studio Profile
           </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsManagement;
