import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { m } from 'framer-motion';

const COLORS = ['#454a3a', '#c49a6c', '#121212', '#a3a3a3', '#6b7280'];

const AdminAnalytics = ({ orders }) => {
  if (!orders || orders.length === 0) return null;

  // 1. Top Selling Products
  const productCount = {};
  orders.forEach(o => {
    productCount[o.productTitle] = (productCount[o.productTitle] || 0) + 1;
  });
  const topProducts = Object.keys(productCount)
    .map(key => ({ name: key, count: productCount[key] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // 2. Top Categories
  const categoryCount = {};
  orders.forEach(o => {
    categoryCount[o.category] = (categoryCount[o.category] || 0) + 1;
  });
  const topCategories = Object.keys(categoryCount).map(key => ({ name: key, value: categoryCount[key] }));

  // 3. Best Price Range
  const priceRanges = {
    '₹0 - ₹500': 0,
    '₹501 - ₹1500': 0,
    '₹1501 - ₹3000': 0,
    '₹3000+': 0
  };
  orders.forEach(o => {
    const price = parseFloat(o.price);
    if (price <= 500) priceRanges['₹0 - ₹500']++;
    else if (price <= 1500) priceRanges['₹501 - ₹1500']++;
    else if (price <= 3000) priceRanges['₹1501 - ₹3000']++;
    else priceRanges['₹3000+']++;
  });
  const priceData = Object.keys(priceRanges).map(key => ({ range: key, orders: priceRanges[key] }));

  return (
    <div className="space-y-8 mt-12">
      <h3 className="text-2xl font-serif text-dark italic border-b border-gray-100 pb-4">Real-Time Sales Analytics</h3>
      
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Top Products Bar Chart */}
        <m.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm"
        >
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Top Selling Products</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(val) => val.length > 10 ? val.substring(0, 10) + '...' : val} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: '#fbfbfb' }} contentStyle={{ fontSize: '12px', borderRadius: '4px' }} />
                <Bar dataKey="count" fill="#454a3a" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </m.div>

        {/* Categories Pie Chart */}
        <m.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm"
        >
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Sales by Category</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topCategories} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {topCategories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </m.div>

        {/* Price Range Bar Chart */}
        <m.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm lg:col-span-2"
        >
          <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-6">Best Selling Price Ranges</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <XAxis dataKey="range" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip cursor={{ fill: '#fbfbfb' }} contentStyle={{ fontSize: '12px', borderRadius: '4px' }} />
                <Bar dataKey="orders" fill="#c49a6c" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </m.div>

      </div>
    </div>
  );
};

export default AdminAnalytics;
