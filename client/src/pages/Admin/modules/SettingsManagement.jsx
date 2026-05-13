import React, { useState, useEffect } from 'react';
import { 
  Loader2, MapPin, Clock, Phone, Mail, Instagram, Facebook, MessageSquare, Video, Save, ChevronDown, Sun, Moon 
} from 'lucide-react';
import api from '../../../utils/api';

const SettingsManagement = () => {
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const presetThemes = {
    'Rimpy Default': { primary: '#E31B23', secondary: '#fdfbf7', accent: '#CC0000', dark: '#111111', 'text-main': '#111111', 'text-light': '#555555', surface: '#ffffff', 'surface-hover': '#f4f1ea', border: '#ebe5d9' },
    'Dark Red': { primary: '#E31B23', secondary: '#111111', accent: '#CC0000', dark: '#0a0a0a', 'text-main': '#f9fafb', 'text-light': '#a3a3a3', surface: '#1a1a1a', 'surface-hover': '#262626', border: '#333333' },
    'Midnight Blue': { primary: '#3b82f6', secondary: '#0f172a', accent: '#2563eb', dark: '#020617', 'text-main': '#f8fafc', 'text-light': '#94a3b8', surface: '#1e293b', 'surface-hover': '#334155', border: '#475569' },
    'Forest Gold': { primary: '#d97706', secondary: '#064e3b', accent: '#b45309', dark: '#022c22', 'text-main': '#fef3c7', 'text-light': '#a7f3d0', surface: '#065f46', 'surface-hover': '#047857', border: '#10b981' },
    'Royal Purple': { primary: '#a855f7', secondary: '#1e1b4b', accent: '#c084fc', dark: '#1e1b4b', 'text-main': '#f5f3ff', 'text-light': '#c4b5fd', surface: '#2e1065', 'surface-hover': '#3b0764', border: '#4c1d95' },
    'Slate Monolith': { primary: '#94a3b8', secondary: '#0f172a', accent: '#cbd5e1', dark: '#020617', 'text-main': '#f8fafc', 'text-light': '#64748b', surface: '#1e293b', 'surface-hover': '#0f172a', border: '#334155' }
  };

  const [settings, setSettings] = useState({
    address: '', workingHours: '', phone: '', email: '',
    instagram: '', facebook: '', whatsapp: '', youtube: '',
    themeColors: presetThemes['Rimpy Default']
  });

  const hexToRgb = (hex) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return `${r} ${g} ${b}`;
  };

  const applyThemePreview = (colors) => {
    const root = document.documentElement;
    if(colors.primary) root.style.setProperty('--color-primary', hexToRgb(colors.primary));
    if(colors.secondary) root.style.setProperty('--color-secondary', hexToRgb(colors.secondary));
    if(colors.accent) root.style.setProperty('--color-accent', hexToRgb(colors.accent));
    if(colors.dark) root.style.setProperty('--color-dark', hexToRgb(colors.dark));
    if(colors['text-main']) root.style.setProperty('--color-text-main', hexToRgb(colors['text-main']));
    if(colors['text-light']) root.style.setProperty('--color-text-light', hexToRgb(colors['text-light']));
    if(colors.surface) root.style.setProperty('--color-surface', hexToRgb(colors.surface));
    if(colors['surface-hover']) root.style.setProperty('--color-surface-hover', hexToRgb(colors['surface-hover']));
    if(colors.border) root.style.setProperty('--color-border', hexToRgb(colors.border));
  };

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings({
        ...res.data,
        themeColors: res.data.themeColors || presetThemes['Rimpy Default']
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleThemeChange = (themeName) => {
    const colors = presetThemes[themeName];
    setSettings({...settings, themeColors: colors});
    applyThemePreview(colors);
  };

  const handleColorChange = (key, value) => {
    const newColors = { ...settings.themeColors, [key]: value };
    setSettings({...settings, themeColors: newColors});
    applyThemePreview(newColors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put('/settings', settings);
      localStorage.setItem('rimpyTheme', JSON.stringify(settings.themeColors));
      alert('Settings updated successfully!');
    } catch (err) { alert('Failed to update settings'); }
    finally { setIsSaving(false); }
  };

  if (loading) return <div className="py-24 flex flex-col items-center justify-center text-primary"><Loader2 size={40} className="animate-spin mb-4 opacity-20" /><p className="text-[10px] uppercase tracking-widest font-bold">Accessing Vault...</p></div>;

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div>
        <h3 className="text-4xl font-serif text-main mb-2 italic">Studio Identity</h3>
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Configure your public presence and contact points</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-surface p-10 border border-surface shadow-sm rounded-sm space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="space-y-4">
               <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary"><MapPin size={14} /> Studio Location</label>
               <textarea rows="3" value={settings.address} onChange={e => setSettings({...settings, address: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-primary outline-none font-serif italic text-main resize-none" placeholder="Enter physical address..." />
             </div>
             <div className="space-y-4">
               <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary"><Clock size={14} /> Working Hours</label>
               <input type="text" value={settings.workingHours} onChange={e => setSettings({...settings, workingHours: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-primary outline-none font-bold text-main" placeholder="e.g. Mon-Sat: 10AM - 8PM" />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-surface pt-10">
             <div className="space-y-4">
               <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary"><Phone size={14} /> Public Phone</label>
               <input type="text" value={settings.phone} onChange={e => setSettings({...settings, phone: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-primary outline-none font-bold text-main" placeholder="+91 XXXXX XXXXX" />
             </div>
             <div className="space-y-4">
               <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-primary"><Mail size={14} /> Public Email</label>
               <input type="email" value={settings.email} onChange={e => setSettings({...settings, email: e.target.value})} className="w-full p-4 bg-secondary/50 border-b border-transparent focus:border-primary outline-none font-bold text-main" placeholder="hello@studio.com" />
             </div>
          </div>
        </div>

        <div className="bg-surface p-10 border border-surface shadow-sm rounded-sm space-y-10">
           <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 flex items-center gap-3">Social Media Presence <div className="h-px bg-primary/20 flex-1" /></h4>
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

        <div className="bg-surface p-10 border border-surface shadow-sm rounded-sm space-y-10">
           <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 flex items-center gap-3">Appearance <div className="h-px bg-primary/20 flex-1" /></h4>
           
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 border border-surface shadow-sm rounded-sm bg-secondary/30 gap-6">
             <div>
               <h5 className="font-serif text-xl text-main mb-2">Theme Mode</h5>
               <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Switch between Rimpy Default (Light) and Dark Mode</p>
             </div>
             
             <button
               type="button"
               onClick={() => {
                 const isDark = settings.themeColors?.surface === '#1a1a1a';
                 const newTheme = isDark ? presetThemes['Rimpy Default'] : presetThemes['Dark Red'];
                 setSettings({ ...settings, themeColors: newTheme });
                 applyThemePreview(newTheme);
               }}
               className={`relative w-24 h-12 rounded-full transition-colors duration-500 ease-in-out p-1 flex items-center shadow-inner ${
                 settings.themeColors?.surface === '#1a1a1a' ? 'bg-primary' : 'bg-gray-300'
               }`}
             >
                <div
                  className={`w-10 h-10 rounded-full bg-white shadow-lg transform transition-transform duration-500 ease-in-out flex items-center justify-center ${
                    settings.themeColors?.surface === '#1a1a1a' ? 'translate-x-12' : 'translate-x-0'
                  }`}
                >
                  {settings.themeColors?.surface === '#1a1a1a' ? (
                    <Moon size={18} className="text-primary" />
                  ) : (
                    <Sun size={18} className="text-orange-500" />
                  )}
                </div>
             </button>
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
