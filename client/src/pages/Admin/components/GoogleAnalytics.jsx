import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { m } from 'framer-motion';
import { Loader2, Users, Eye, Globe, MapPin, Map, Calendar } from 'lucide-react';
import api from '../../../utils/api';
import StatCard from './StatCard';

const COLORS = ['#E31B23', '#2c2c2c', '#8c8c8c', '#eaeaea', '#555555'];
const PRIMARY_COLOR = '#E31B23';

const GoogleAnalytics = () => {
  const [data, setData] = useState(null);
  const [deviceData, setDeviceData] = useState([]);
  const [topPages, setTopPages] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [ageData, setAgeData] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [stateData, setStateData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [mainRes, deviceRes, pagesRes, trafficRes, ageRes, countryRes, stateRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/analytics/device'),
          api.get('/analytics/top-pages'),
          api.get('/analytics/traffic-sources'),
          api.get('/analytics/age-distribution'),
          api.get('/analytics/country-distribution'),
          api.get('/analytics/state-distribution')
        ]);
        
        setData(mainRes.data);
        setDeviceData(deviceRes.data);
        setTopPages(pagesRes.data);
        setTrafficData(trafficRes.data);
        setAgeData(ageRes.data);
        setCountryData(countryRes.data);
        setStateData(stateRes.data);
      } catch (err) {
        console.error('Failed to fetch Google Analytics data:', err);
        setError('Could not load analytics. Check your API credentials.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-surface p-8 rounded-sm border border-surface shadow-sm mt-8 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 size={32} className="animate-spin text-primary mb-4 opacity-50" />
        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Syncing with Google Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-surface p-8 rounded-sm border border-red-500/20 shadow-sm mt-8 text-center">
        <p className="text-red-500 font-serif italic mb-2">{error}</p>
        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Please verify your GA_PROPERTY_ID and GA_PRIVATE_KEY</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 mt-12">
      <h3 className="text-2xl font-serif text-main italic border-b border-surface pb-4 flex items-center gap-3">
        Website Traffic 
        <span className="text-[10px] font-sans font-bold uppercase tracking-widest bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">Last 30 Days</span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatCard label="Total Page Views" value={data.totalViews.toLocaleString()} icon={Eye} />
        <StatCard label="Active Users" value={data.totalUsers.toLocaleString()} icon={Users} />
      </div>

      <m.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-surface p-6 md:p-8 border border-surface shadow-sm rounded-sm"
      >
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-8">Page Views Over Time</h4>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={PRIMARY_COLOR} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={PRIMARY_COLOR} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(val) => val.split('-').slice(1).join('/')} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ fontSize: '12px', borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#111' }}
              />
              <Area type="monotone" dataKey="views" name="Page Views" stroke={PRIMARY_COLOR} strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </m.div>

      {/* Top Pages - Responsive Cards matching StatCard style */}
      <m.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-surface p-6 md:p-8 border border-surface shadow-sm rounded-sm"
      >
        <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 flex items-center gap-2">
          <Globe size={14} /> Top Performing Client Pages
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {topPages.map((page, index) => (
            <m.div 
              whileHover={{ y: -5 }}
              key={index} 
              className="bg-surface p-6 border border-surface shadow-sm rounded-sm group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700" />
              <div className="relative z-10 space-y-4">
                <span className="text-xs font-mono text-gray-400 block truncate" title={page.page}>
                  {page.page === '/' ? '/home' : page.page}
                </span>
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-3xl font-serif text-main italic">{page.views}</span>
                  <span className="text-[9px] uppercase tracking-widest text-gray-300 font-bold">Views</span>
                </div>
              </div>
            </m.div>
          ))}
          {topPages.length === 0 && (
             <div className="col-span-5 text-center text-sm text-gray-400 py-4">No page data available</div>
          )}
        </div>
      </m.div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Device Breakdown */}
        <m.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-surface p-6 md:p-8 border border-surface shadow-sm rounded-sm col-span-1"
        >
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Device Breakdown</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="views"
                  nameKey="device"
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: 'none' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </m.div>

        {/* Traffic Sources */}
        <m.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-surface p-6 md:p-8 border border-surface shadow-sm rounded-sm col-span-1 lg:col-span-2"
        >
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Traffic Sources</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trafficData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eaeaea" />
                <XAxis type="number" hide />
                <YAxis dataKey="source" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} width={100} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: '12px', borderRadius: '4px', border: 'none' }} />
                <Bar dataKey="sessions" fill={PRIMARY_COLOR} radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </m.div>

        {/* Age Distribution */}
        <m.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="bg-surface p-6 md:p-8 border border-surface shadow-sm rounded-sm col-span-1"
        >
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 flex items-center gap-2">
            <Calendar size={14} /> Age Groups
          </h4>
          <div className="h-64 w-full flex items-center justify-center">
            {ageData && ageData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                  <XAxis dataKey="ageBracket" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} />
                  <YAxis hide />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: '12px', borderRadius: '4px', border: 'none' }} />
                  <Bar dataKey="sessions" fill={PRIMARY_COLOR} radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400 text-center px-4">
                Not enough data. GA requires more traffic to show demographics.
              </p>
            )}
          </div>
        </m.div>

        {/* Country Distribution */}
        <m.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="bg-surface p-6 md:p-8 border border-surface shadow-sm rounded-sm col-span-1"
        >
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 flex items-center gap-2">
            <Globe size={14} /> Top Countries
          </h4>
          <div className="h-64 w-full flex items-center justify-center">
            {countryData && countryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData.slice(0,5)} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eaeaea" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="country" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#666' }} width={80} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ fontSize: '12px', borderRadius: '4px', border: 'none' }} />
                  <Bar dataKey="sessions" fill={PRIMARY_COLOR} radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400 text-center px-4">No country data available yet.</p>
            )}
          </div>
        </m.div>

        {/* State/Region Distribution */}
        <m.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="bg-surface p-6 md:p-8 border border-surface shadow-sm rounded-sm col-span-1"
        >
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6 flex items-center gap-2">
            <MapPin size={14} /> Top Regions
          </h4>
          <div className="h-64 w-full flex items-center justify-center">
            {stateData && stateData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stateData.slice(0,5)}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="sessions"
                    nameKey="region"
                  >
                    {stateData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: 'none' }} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-gray-400 text-center px-4">No regional data available yet.</p>
            )}
          </div>
        </m.div>

      </div>
    </div>
  );
};

export default GoogleAnalytics;
