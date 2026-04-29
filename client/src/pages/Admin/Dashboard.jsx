import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, ShoppingBag, Image as ImageIcon, Settings, LogOut, 
  Plus, Menu, X, Star, MessageSquare, Edit2, Trash2, Loader2, 
  Filter, Upload, Calendar, ZoomIn, ChevronDown, CheckCircle2,
  FolderPlus, Tags, User, Layers, ImagePlus, RefreshCw, AlertTriangle, Quote,
  Mail, Phone, Clock, MailOpen, CheckCircle, MapPin, Instagram, Facebook, Video, Send, Save, Bell
} from 'lucide-react';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5004' : '';

const StatCard = ({ label, value, icon: Icon, isWarning }) => (
  <div className={`bg-white p-8 border border-gray-100 shadow-sm group hover:border-primary transition-all duration-500 relative overflow-hidden rounded-sm`}>
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-sm transition-all ${isWarning && value > 0 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-secondary text-primary group-hover:bg-primary group-hover:text-white'}`}>
        <Icon size={20} />
      </div>
      {isWarning && value > 0 && <span className="text-[8px] font-bold bg-red-500 text-white px-2 py-1 rounded-full uppercase tracking-tighter">New Leads</span>}
    </div>
    <h4 className="text-4xl font-serif text-dark mb-2 tracking-tighter">{value}</h4>
    <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 group-hover:text-primary transition-colors">{label}</p>
  </div>
);

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, title, loading }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-dark/90 backdrop-blur-sm" />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-white w-full max-w-md rounded-sm shadow-2xl relative z-10 overflow-hidden">
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-100"><AlertTriangle size={40} /></div>
            <div><h4 className="text-2xl font-serif text-dark mb-2 italic">Confirm Deletion</h4><p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 leading-relaxed px-4">Delete <span className="text-red-500">"{title}"</span>? This action is permanent.</p></div>
            <div className="flex gap-4 pt-4"><button onClick={onClose} className="flex-1 py-4 bg-secondary text-dark uppercase tracking-widest text-[10px] font-bold hover:bg-gray-200 transition-all">Cancel</button><button onClick={onConfirm} disabled={loading} className="flex-1 py-4 bg-red-600 text-white uppercase tracking-widest text-[10px] font-bold hover:bg-red-700 transition-all shadow-xl flex items-center justify-center gap-2">{loading ? <Loader2 size={14} className="animate-spin" /> : 'Delete'}</button></div>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- PRODUCT MANAGEMENT MODULE ---

const ProductManagement = ({ refreshStats }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [modalType, setModalType] = useState(null); 
  const [deleteData, setDeleteData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showZoom, setShowZoom] = useState(null);
  const [formData, setFormData] = useState({ title: '', price: '', description: '', categoryId: '' });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([api.get('/products'), api.get('/products/categories')]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) { console.error('Fetch error:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.price || !formData.categoryId) {
      alert('Please fill in all required fields.');
      return;
    }
    if (modalType === 'add' && !imageFile) {
      alert('Please select a product image.');
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('description', formData.description || '');
    data.append('categoryId', formData.categoryId);
    if (imageFile) data.append('image', imageFile);

    try {
      if (modalType === 'add') { 
        await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }); 
      } else { 
        await api.put(`/products/${selectedProduct.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); 
      }
      setModalType(null); 
      fetchData(); 
      refreshStats();
    } catch (err) { 
      const msg = err.response?.data?.message || 'Failed to save product. Please try again.';
      alert(msg); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const filteredProducts = filter === 'All' ? products : products.filter(p => p.category?.name === filter);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div><h3 className="text-3xl font-serif text-dark mb-2 italic">Product Inventory</h3><p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Manage studio shop items</p></div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative group flex-1 lg:flex-none min-w-[150px]"><Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full pl-10 pr-10 py-4 bg-white border border-gray-100 outline-none text-[10px] uppercase tracking-widest font-bold text-dark appearance-none cursor-pointer focus:border-primary transition-all shadow-sm"><option value="All">All Categories</option>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div>
          <button onClick={() => { setModalType('category'); setNewCategoryName(''); }} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-secondary border border-primary/10 text-primary uppercase tracking-widest text-[10px] font-bold hover:bg-primary hover:text-white transition-all shadow-sm rounded-sm"><FolderPlus size={16} /> Genre</button>
          <button onClick={() => { 
            setModalType('add'); 
            setFormData({ title: '', price: '', description: '', categoryId: '' }); 
            setImagePreview(null); 
            setImageFile(null); 
            setSelectedProduct(null);
          }} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all shadow-xl rounded-sm"><Plus size={16} /> Add Item</button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-sm">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-primary"><Loader2 size={40} className="animate-spin mb-4 opacity-20" /><p className="text-[10px] uppercase tracking-widest font-bold">Syncing Inventory...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  <th className="px-8 py-6">Item</th><th className="px-8 py-6">Category</th><th className="px-8 py-6">Price</th><th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-8 py-6"><div className="flex items-center gap-4"><div onClick={() => setShowZoom(p.imageUrl)} className="w-16 h-16 bg-secondary rounded-sm overflow-hidden relative cursor-zoom-in group/img border border-gray-100 shadow-sm"><img src={p.imageUrl?.startsWith('http') ? p.imageUrl : `${BASE_URL}${p.imageUrl}`} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" /><div className="absolute inset-0 bg-dark/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"><ZoomIn size={16} className="text-white" /></div></div><span className="font-serif text-dark font-bold line-clamp-1">{p.title}</span></div></td>
                    <td className="px-8 py-6"><span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-secondary text-primary border border-primary/10 rounded-full">{p.category?.name}</span></td>
                    <td className="px-8 py-6 font-bold text-dark text-base"><span className="text-primary mr-1">₹</span>{p.price.toLocaleString('en-IN')}</td>
                    <td className="px-8 py-6 text-right"><div className="flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><button onClick={() => { setModalType('edit'); setSelectedProduct(p); setFormData({ title: p.title, price: p.price, description: p.description, categoryId: p.categoryId }); setImagePreview(p.imageUrl?.startsWith('http') ? p.imageUrl : `${BASE_URL}${p.imageUrl}`); }} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={16} /></button><button onClick={() => setDeleteData(p)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalType === 'category' && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-dark/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-sm shadow-2xl relative z-10 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-secondary/30">
                <h4 className="text-lg font-serif text-dark italic">Product Categories</h4>
                <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-dark"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-8">
                <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar pr-2">
                  <h5 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Existing Categories</h5>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <div key={cat.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-sm group">
                        <span className="font-bold text-dark text-xs">{cat.name} <span className="text-[9px] text-gray-400 font-normal ml-2">({cat.products?.length || 0} items)</span></span>
                        <button 
                          onClick={async () => {
                            if(cat.products?.length > 0) return alert('Cannot delete category with products.');
                            setIsSubmitting(true);
                            try {
                              await api.delete(`/products/categories/${cat.id}`);
                              fetchData();
                            } catch(e) { alert(e.response?.data?.message || 'Delete failed'); }
                            finally { setIsSubmitting(false); }
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={async (e) => { e.preventDefault(); if(!newCategoryName) return; setIsSubmitting(true); try { await api.post('/products/categories', { name: newCategoryName }); setNewCategoryName(''); fetchData(); } catch(err){ alert('Fail'); } finally { setIsSubmitting(false); } }} className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Add New Category</label>
                    <input type="text" required value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-dark font-sans" placeholder="Category Name" />
                  </div>
                  <button disabled={isSubmitting} className="w-full py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all rounded-sm flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Create Category'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {(modalType === 'add' || modalType === 'edit') && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-dark/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-white w-full max-w-3xl max-h-[90vh] rounded-sm shadow-2xl relative z-10 overflow-hidden flex flex-col"><div className="p-6 border-b border-gray-100 flex justify-between items-center bg-secondary/30 shrink-0"><h4 className="text-xl font-serif text-dark italic">{modalType === 'add' ? 'Add Item' : 'Edit Item'}</h4><button onClick={() => setModalType(null)} className="text-gray-400 hover:text-dark"><X size={28} /></button></div><form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Title</label><input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-dark font-sans" /></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Price (₹)</label><input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-dark font-sans" /></div></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Category</label><select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-dark appearance-none font-sans"><option value="">Select Category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Description</label><textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none resize-none font-serif italic text-dark" /></div><div className="space-y-2 pb-6"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Image</label><div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-200 hover:border-primary p-12 text-center cursor-pointer bg-secondary/30 group rounded-sm"><input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />{imagePreview ? <img src={imagePreview} className="w-full max-w-[200px] h-40 mx-auto object-cover border-4 border-white shadow-lg" /> : <Upload size={30} className="mx-auto text-gray-300 group-hover:text-primary" />}</div></div></form><div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0"><button type="button" onClick={() => setModalType(null)} className="flex-1 py-4 bg-white border border-gray-200 text-dark uppercase tracking-widest text-[10px] font-bold">Cancel</button><button onClick={handleSubmit} disabled={isSubmitting} className="flex-[2] py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all rounded-sm">{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save'}</button></div></motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal isOpen={!!deleteData} onClose={() => setDeleteData(null)} onConfirm={async () => { setIsSubmitting(true); try { await api.delete(`/products/${deleteData.id}`); setDeleteData(null); fetchData(); refreshStats(); } finally { setIsSubmitting(false); } }} title={deleteData?.title} loading={isSubmitting} />
    </div>
  );
};

// --- PORTFOLIO MANAGEMENT MODULE ---

const PortfolioManagement = ({ refreshStats }) => {
  const [albums, setAlbums] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [modalType, setModalType] = useState(null); 
  const [deleteData, setDeleteData] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showZoom, setShowZoom] = useState(null);
  const [albumData, setAlbumData] = useState({ title: '', clientName: '', categoryId: '' });
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingImg, setIsDeletingImg] = useState(null);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [albumRes, catRes] = await Promise.all([api.get('/portfolio/albums'), api.get('/portfolio/categories')]);
      setAlbums(albumRes.data);
      setCategories(catRes.data);
    } catch (err) { console.error('Fetch error:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAlbumSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!albumData.title || !albumData.clientName || !albumData.categoryId) {
      alert('Please fill in all album details.');
      return;
    }
    if (modalType === 'album' && !coverFile) {
      alert('Please upload a cover photo for the album.');
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('title', albumData.title);
    data.append('clientName', albumData.clientName);
    data.append('categoryId', albumData.categoryId);
    if (coverFile) data.append('image', coverFile);
    try {
      if (modalType === 'album') { 
        await api.post('/portfolio/albums', data, { headers: { 'Content-Type': 'multipart/form-data' } }); 
      } else { 
        await api.put(`/portfolio/albums/${selectedAlbum.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); 
      }
      setModalType(null); 
      fetchData(); 
      refreshStats();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save album. Please try again.';
      alert(msg);
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const filteredAlbums = filter === 'All' ? albums : albums.filter(a => a.category?.name === filter);

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div><h3 className="text-3xl font-serif text-dark mb-2 italic">Portfolio Gallery</h3><p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Manage client shoots</p></div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto"><div className="relative group flex-1 lg:flex-none min-w-[150px] font-sans"><Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full pl-10 pr-10 py-4 bg-white border border-gray-100 outline-none text-[10px] uppercase tracking-widest font-bold text-dark appearance-none cursor-pointer focus:border-primary transition-all shadow-sm"><option value="All">All Genres</option>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div><button onClick={() => { setModalType('category'); }} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-secondary border border-primary/10 text-primary uppercase tracking-widest text-[10px] font-bold hover:bg-primary hover:text-white transition-all shadow-sm rounded-sm"><FolderPlus size={16} /> Genre</button><button onClick={() => { 
          setModalType('album'); 
          setAlbumData({ title: '', clientName: '', categoryId: '' }); 
          setCoverPreview(null); 
          setCoverFile(null);
          setSelectedAlbum(null);
        }} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all shadow-xl rounded-sm"><Plus size={16} /> New Album</button></div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-sm">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-primary"><Loader2 size={40} className="animate-spin mb-4 opacity-20" /><p className="text-[10px] uppercase tracking-widest font-bold">Loading rolls...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  <th className="px-8 py-6 w-20">Sr No</th><th className="px-8 py-6">Album</th><th className="px-8 py-6">Genre</th><th className="px-8 py-6">Count</th><th className="px-8 py-6">Date</th><th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAlbums.map((a, index) => (
                  <tr key={a.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-8 py-6 font-bold text-dark text-xs opacity-50">{index + 1}</td>
                    <td className="px-8 py-6"><div className="flex items-center gap-4"><div onClick={() => setShowZoom(a.coverImage)} className="w-16 h-12 bg-secondary rounded-sm overflow-hidden relative cursor-zoom-in group/img border border-gray-100 shadow-sm"><img src={a.coverImage?.startsWith('http') ? a.coverImage : `${BASE_URL}${a.coverImage}`} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" /></div><div className="flex flex-col"><span className="font-serif text-dark font-bold line-clamp-1">{a.title}</span><span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Client: {a.clientName}</span></div></div></td>
                    <td className="px-8 py-6"><span className="text-[9px] uppercase tracking-widest font-bold px-3 py-1 bg-secondary text-primary border border-primary/10 rounded-full">{a.category?.name}</span></td>
                    <td className="px-8 py-6"><button onClick={() => { setSelectedAlbum(a); setModalType('media'); }} className="flex items-center gap-2 text-primary hover:text-dark transition-colors font-bold text-[10px] uppercase tracking-widest"><Layers size={14} /> {a.images?.length || 0} Assets</button></td>
                    <td className="px-8 py-6 text-gray-400 text-[10px] uppercase font-bold">{new Date(a.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-8 py-6 text-right"><div className="flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><button onClick={() => { setSelectedAlbum(a); setModalType('editAlbum'); setAlbumData({ title: a.title, clientName: a.clientName, categoryId: a.categoryId }); setCoverPreview(a.coverImage?.startsWith('http') ? a.coverImage : `${BASE_URL}${a.coverImage}`); }} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={16} /></button><button onClick={() => setDeleteData(a)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modalType === 'category' && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-dark/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-md rounded-sm shadow-2xl relative z-10 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-secondary/30">
                <h4 className="text-lg font-serif text-dark italic">Portfolio Genres</h4>
                <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-dark"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-8">
                <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar pr-2">
                  <h5 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Existing Genres</h5>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <div key={cat.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-sm group">
                        <span className="font-bold text-dark text-xs">{cat.name} <span className="text-[9px] text-gray-400 font-normal ml-2">({cat.albums?.length || 0} albums)</span></span>
                        <button 
                          onClick={async () => {
                            if(cat.albums?.length > 0) return alert('Cannot delete genre with albums.');
                            setIsSubmitting(true);
                            try {
                              await api.delete(`/portfolio/categories/${cat.id}`);
                              fetchData();
                            } catch(e) { alert(e.response?.data?.message || 'Delete failed'); }
                            finally { setIsSubmitting(false); }
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={async (e) => { e.preventDefault(); if(!newCategoryName) return; setIsSubmitting(true); try { await api.post('/portfolio/categories', { name: newCategoryName }); setNewCategoryName(''); fetchData(); } finally { setIsSubmitting(false); } }} className="space-y-6 pt-6 border-t border-gray-100">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Add New Genre</label>
                    <input type="text" required value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-dark font-sans" placeholder="Genre Name" />
                  </div>
                  <button disabled={isSubmitting} className="w-full py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all rounded-sm flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Create Genre'}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}

        {(modalType === 'album' || modalType === 'editAlbum') && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-dark/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-white w-full max-w-2xl max-h-[90vh] rounded-sm shadow-2xl relative z-10 overflow-hidden flex flex-col">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-secondary/30 shrink-0">
                <h4 className="text-2xl font-serif text-dark italic">{modalType === 'album' ? 'New Album' : 'Edit Album'}</h4>
                <button onClick={() => setModalType(null)} className="text-gray-400 hover:text-dark"><X size={28} /></button>
              </div>
              <form onSubmit={handleAlbumSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Title</label><input type="text" required value={albumData.title} onChange={e => setAlbumData({...albumData, title: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-dark font-sans" /></div>
                  <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Client</label><input type="text" required value={albumData.clientName} onChange={e => setAlbumData({...albumData, clientName: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-dark font-sans" /></div>
                </div>
                <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Genre</label><select required value={albumData.categoryId} onChange={e => setAlbumData({...albumData, categoryId: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-dark appearance-none font-sans"><option value="">Select Genre</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div className="space-y-2 pb-6"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Cover Photo</label><div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-200 hover:border-primary p-12 text-center cursor-pointer bg-secondary/30 group rounded-sm"><input type="file" ref={fileInputRef} onChange={(e) => { const file = e.target.files[0]; if(file){ setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); } }} className="hidden" accept="image/*" />{coverPreview ? <img src={coverPreview} className="w-full h-48 object-cover border-4 border-white shadow-lg" /> : <Upload size={32} className="mx-auto text-gray-300 group-hover:text-primary" />}</div></div>
              </form>
              <div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0"><button type="button" onClick={() => setModalType(null)} className="flex-1 py-4 bg-white border border-gray-200 text-dark uppercase tracking-widest text-[10px] font-bold">Cancel</button><button onClick={handleAlbumSubmit} disabled={isSubmitting} className="flex-[2] py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all rounded-sm">{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save'}</button></div>
            </motion.div>
          </div>
        )}

        {modalType === 'media' && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-dark/80 backdrop-blur-md" /><motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-white w-full max-w-4xl max-h-[90vh] rounded-sm shadow-2xl relative z-10 overflow-hidden flex flex-col"><div className="p-6 border-b border-gray-100 flex justify-between items-center bg-secondary/30 shrink-0"><div><h4 className="text-xl font-serif text-dark italic">{selectedAlbum?.title}</h4><p className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Media Manager</p></div><button onClick={() => setModalType(null)} className="text-gray-400 hover:text-dark"><X size={28} /></button></div><div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{selectedAlbum?.images?.map((img) => (<div key={img.id} className="relative aspect-square bg-secondary group overflow-hidden rounded-sm"><img src={img.imageUrl?.startsWith('http') ? img.imageUrl : `http://localhost:5004${img.imageUrl}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><button onClick={async () => { setIsDeletingImg(img.id); try { await api.delete(`/portfolio/images/${img.id}`); const r = await api.get('/portfolio/albums'); setSelectedAlbum(r.data.find(al => al.id === selectedAlbum.id)); fetchData(); } finally { setIsDeletingImg(null); } }} disabled={isDeletingImg === img.id} className="p-3 bg-red-500 text-white rounded-full shadow-lg">{isDeletingImg === img.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}</button></div></div>))}</div><div className="border-t border-gray-100 pt-10"><h5 className="text-[10px] uppercase tracking-widest font-bold text-primary mb-4 flex items-center gap-2"><ImagePlus size={14} /> Add Assets</h5><div onClick={() => galleryInputRef.current.click()} className="border-2 border-dashed border-gray-200 hover:border-primary p-12 text-center cursor-pointer bg-secondary/10 group rounded-sm"><input type="file" ref={galleryInputRef} multiple onChange={(e) => setGalleryFiles(e.target.files)} className="hidden" accept="image/*" /><Upload size={32} className="mx-auto mb-4 text-gray-300 group-hover:text-primary transition-all" /><p className="text-[10px] font-bold uppercase tracking-widest text-dark">Select Images</p>{galleryFiles.length > 0 && <p className="mt-4 text-primary font-bold text-xs">{galleryFiles.length} staged</p>}</div></div></div><div className="p-8 bg-gray-50 border-t border-gray-100 shrink-0"><button onClick={async (e) => { e.preventDefault(); if(galleryFiles.length===0)return; setIsSubmitting(true); const d=new FormData(); Array.from(galleryFiles).forEach(f=>d.append('images', f)); try { await api.post(`/portfolio/albums/${selectedAlbum.id}/images`, d, {headers:{'Content-Type':'multipart/form-data'}}); setGalleryFiles([]); const r=await api.get('/portfolio/albums'); setSelectedAlbum(r.data.find(al=>al.id===selectedAlbum.id)); fetchData(); } finally { setIsSubmitting(false); } }} disabled={isSubmitting || galleryFiles.length === 0} className="w-full py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-xl rounded-sm">{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={14} />}</button></div></motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal isOpen={!!deleteData} onClose={() => setDeleteData(null)} onConfirm={async () => { setIsSubmitting(true); try { await api.delete(`/portfolio/albums/${deleteData.id}`); setDeleteData(null); fetchData(); refreshStats(); } finally { setIsSubmitting(false); } }} title={deleteData?.title} loading={isSubmitting} />
    </div>
  );
};

// --- TESTIMONIAL MANAGEMENT MODULE ---

const TestimonialManagement = ({ refreshStats }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); 
  const [deleteData, setDeleteData] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [formData, setFormData] = useState({ name: '', comment: '', rating: 5 });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/testimonials');
      setTestimonials(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      alert('Please provide at least a Client Name and a Comment.');
      return;
    }
    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name);
    data.append('comment', formData.comment);
    data.append('rating', formData.rating);
    if (imageFile) data.append('image', imageFile);

    try {
      if (modalType === 'add') { await api.post('/testimonials', data, { headers: { 'Content-Type': 'multipart/form-data' } }); }
      else { await api.put(`/testimonials/${selectedReview.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); }
      setModalType(null); fetchData(); refreshStats();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save testimonial. Please try again.';
      alert(msg);
    } finally { setIsSubmitting(false); }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div><h3 className="text-3xl font-serif text-dark mb-2 italic">Client Testimonials</h3><p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Manage customer feedback</p></div>
        <button onClick={() => { 
          setModalType('add'); 
          setFormData({ name: '', comment: '', rating: 5 }); 
          setImagePreview(null);
          setImageFile(null); // Explicitly clear the file
          setSelectedReview(null); // Clear selected review
        }} className="flex items-center gap-3 px-8 py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all shadow-xl rounded-sm"><Plus size={16} /> Add Testimonial</button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-sm">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-primary"><Loader2 size={40} className="animate-spin mb-4 opacity-20" /><p className="text-[10px] uppercase tracking-widest font-bold">Collecting feedback...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  <th className="px-8 py-6 w-20">Sr No</th><th className="px-8 py-6">Client</th><th className="px-8 py-6">Comment</th><th className="px-8 py-6">Rating</th><th className="px-8 py-6">Date</th><th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {testimonials.map((t, index) => (
                  <tr key={t.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-8 py-6 font-bold text-dark text-xs opacity-50">{index + 1}</td>
                    <td className="px-8 py-6"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-dark rounded-full overflow-hidden border border-white/10 shadow-sm flex items-center justify-center"><img src={t.imageUrl?.startsWith('http') ? t.imageUrl : `${BASE_URL}${t.imageUrl}`} className="w-full h-full object-contain" /></div><span className="font-serif text-dark font-bold">{t.name}</span></div></td>
                    <td className="px-8 py-6 text-xs text-gray-400 italic font-serif line-clamp-1 max-w-[300px]">"{t.comment}"</td>
                    <td className="px-8 py-6"><div className="flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />)}</div></td>
                    <td className="px-8 py-6 text-gray-400 text-[10px] uppercase font-bold">{new Date(t.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right"><div className="flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><button onClick={() => { setSelectedReview(t); setModalType('edit'); setFormData({ name: t.name, comment: t.comment, rating: t.rating }); setImagePreview(t.imageUrl?.startsWith('http') ? t.imageUrl : `${BASE_URL}${t.imageUrl}`); }} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={16} /></button><button onClick={() => setDeleteData(t)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {(modalType === 'add' || modalType === 'edit') && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-dark/80 backdrop-blur-md" /><motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-white w-full max-w-2xl max-h-[90vh] rounded-sm shadow-2xl relative z-10 overflow-hidden flex flex-col"><div className="p-8 border-b border-gray-100 flex justify-between items-center bg-secondary/30 shrink-0"><h4 className="text-2xl font-serif text-dark italic">{modalType === 'add' ? 'New Testimonial' : 'Edit Review'}</h4><button onClick={() => setModalType(null)} className="text-gray-400 hover:text-dark"><X size={28} /></button></div><form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar"><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Client Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-dark font-sans" /></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Rating</label><div className="flex gap-4 p-4 bg-secondary/50 rounded-sm">{[1,2,3,4,5].map(num => <button key={num} type="button" onClick={() => setFormData({...formData, rating: num})} className={`transition-all ${formData.rating >= num ? 'text-yellow-400 scale-125' : 'text-gray-300'}`}><Star size={24} className={formData.rating >= num ? "fill-yellow-400" : ""} /></button>)}</div></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Comment</label><textarea rows="4" required value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none resize-none font-serif italic text-dark" /></div><div className="space-y-2 pb-6"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Photo / Logo</label><div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-200 hover:border-primary p-12 text-center cursor-pointer bg-dark group rounded-sm flex flex-col items-center relative overflow-hidden"><div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" /><input type="file" ref={fileInputRef} onChange={(e) => { const f=e.target.files[0]; if(f){ setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} className="hidden" accept="image/*" />{imagePreview ? <img src={imagePreview} className="w-32 h-32 rounded-full object-contain border-4 border-white/20 shadow-xl relative z-10" /> : <User size={40} className="text-gray-500 relative z-10" />}<p className="mt-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold relative z-10">Supports Transparent PNGs</p></div></div></form><div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0"><button type="button" onClick={() => setModalType(null)} className="flex-1 py-4 bg-white border border-gray-200 text-dark uppercase tracking-widest text-[10px] font-bold">Cancel</button><button onClick={handleSubmit} disabled={isSubmitting} className="flex-[2] py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all rounded-sm flex items-center justify-center gap-3">{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Publish'}</button></div></motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal isOpen={!!deleteData} onClose={() => setDeleteData(null)} onConfirm={async () => { setIsSubmitting(true); try { await api.delete(`/testimonials/${deleteData.id}`); setDeleteData(null); fetchData(); refreshStats(); } finally { setIsSubmitting(false); } }} title={deleteData?.name} loading={isSubmitting} />
    </div>
  );
};

// --- INQUIRY MANAGEMENT MODULE ---

const InquiryManagement = ({ refreshStats }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteData, setDeleteData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/contact');
      setInquiries(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const toggleRead = async (id) => {
    setIsUpdating(id);
    try {
      await api.patch(`/contact/${id}/read`);
      fetchData();
      refreshStats();
    } catch (err) { alert('Update failed'); }
    finally { setIsUpdating(null); }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center">
        <div><h3 className="text-3xl font-serif text-dark mb-2 italic">Client Inquiries</h3><p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Incoming leads and shoot requests</p></div>
        <button 
          onClick={fetchData} 
          className="flex items-center gap-3 px-6 py-4 bg-secondary text-primary uppercase tracking-widest text-[10px] font-bold hover:bg-primary hover:text-white transition-all shadow-sm rounded-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Sync Leads
        </button>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden rounded-sm">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-primary"><Loader2 size={40} className="animate-spin mb-4 opacity-20" /><p className="text-[10px] uppercase tracking-widest font-bold">Fetching leads...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-gray-100 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  <th className="px-8 py-6 w-20">Sr No</th><th className="px-8 py-6">Client Info</th><th className="px-8 py-6">Message</th><th className="px-8 py-6">Status</th><th className="px-8 py-6">Received</th><th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inq, index) => (
                  <tr key={inq.id} className={`transition-colors group ${!inq.isRead ? 'bg-primary/[0.02] border-l-4 border-l-primary' : 'hover:bg-secondary/20 border-l-4 border-l-transparent'}`}>
                    <td className="px-8 py-6 font-bold text-dark text-xs opacity-50">{index + 1}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-serif text-dark font-bold flex items-center gap-2">{inq.name} {!inq.isRead && <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />}</span>
                        <div className="flex items-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                          <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-primary transition-colors"><Mail size={10} /> {inq.email}</a>
                          <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-primary transition-colors"><Phone size={10} /> {inq.phone}</a>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="p-4 bg-secondary/30 rounded-sm text-xs text-dark font-serif italic max-w-xs line-clamp-2 hover:line-clamp-none transition-all cursor-help border border-transparent hover:border-primary/10">
                        {inq.message}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <button onClick={() => toggleRead(inq.id)} disabled={isUpdating === inq.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold transition-all border ${inq.isRead ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' : 'bg-primary text-white border-primary shadow-lg shadow-primary/20 hover:scale-105'}`}>
                         {isUpdating === inq.id ? <Loader2 size={10} className="animate-spin" /> : (inq.isRead ? <CheckCircle size={10} /> : <MailOpen size={10} />)}
                         {inq.isRead ? 'Responded' : 'New Inquiry'}
                       </button>
                    </td>
                    <td className="px-8 py-6 text-gray-400 text-[10px] uppercase font-bold flex items-center gap-2"><Clock size={10} /> {new Date(inq.createdAt).toLocaleDateString()}</td>
                    <td className="px-8 py-6 text-right"><button onClick={() => setDeleteData(inq)} className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <DeleteConfirmModal 
        isOpen={!!deleteData} 
        onClose={() => setDeleteData(null)} 
        onConfirm={async () => { 
          setIsSubmitting(true);
          try { 
            await api.delete(`/contact/${deleteData.id}`); 
            setDeleteData(null); 
            fetchData(); 
            refreshStats(); 
          } catch(e) { 
            alert('Delete failed'); 
          } finally {
            setIsSubmitting(false);
          }
        }} 
        title={`Inquiry from ${deleteData?.name}`} 
        loading={isSubmitting}
      />
    </div>
  );
};

// --- SETTINGS MANAGEMENT MODULE ---

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

// --- MAIN ADMIN DASHBOARD ---

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview');
  const [counts, setCounts] = useState({ products: 0, albums: 0, testimonials: 0, unreadLeads: 0, totalLeads: 0 });
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard },
    { name: 'Products', icon: ShoppingBag },
    { name: 'Portfolio', icon: ImageIcon },
    { name: 'Testimonials', icon: Star },
    { name: 'Inquiries', icon: MessageSquare },
    { name: 'Settings', icon: Settings },
  ];

  const fetchCounts = async () => {
    try {
      const [p, a, t, i] = await Promise.all([
        api.get('/products'),
        api.get('/portfolio/albums'),
        api.get('/testimonials'),
        api.get('/contact')
      ]);
      const unreadCount = i.data.filter(msg => !msg.isRead).length;
      setCounts({ 
        products: p.data.length, 
        albums: a.data.length, 
        testimonials: t.data.length, 
        unreadLeads: unreadCount,
        totalLeads: i.data.length
      });
    } catch (err) { console.error('Stats error:', err); }
  };

  useEffect(() => { 
    fetchCounts(); 
    // Auto-sync every 60 seconds to check for new leads
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id) {
        await api.post('/auth/logout', { userId: user.id });
      }
    } catch (err) {
      console.error('Logout sync failed:', err);
    } finally {
      localStorage.clear();
      setTimeout(() => {
        navigate('/admin');
      }, 800); // Small delay for visual polish
    }
  };

  return (
    <div className="flex h-screen bg-secondary overflow-hidden selection:bg-primary selection:text-white font-sans">
      <AnimatePresence>
        {isLoggingOut && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-dark/90 backdrop-blur-md flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-24 h-24 border-2 border-primary/20 border-t-primary rounded-full" />
              <img src="/logo_rdps2.png" className="w-10 absolute inset-0 m-auto brightness-0 invert opacity-50" alt="Logo" />
            </div>
            <div className="text-center space-y-2">
              <h4 className="text-xl font-serif text-white italic">Securing Session</h4>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold animate-pulse">Clearing vault & redirecting...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.aside initial={false} animate={{ width: sidebarOpen ? '280px' : '80px' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="h-full bg-dark text-white flex flex-col z-50 relative shadow-2xl border-r border-white/5">
        <div className="p-6 flex items-center justify-between border-b border-white/5 h-20">
          <AnimatePresence mode='wait'>
            {sidebarOpen ? (
              <motion.img key="logo" initial={{ opacity: 0 }} animate={{ opacity: 1 }} src="/logo_rdps.png" alt="Logo" className="h-10 brightness-0 invert" />
            ) : (
              <motion.img key="icon" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} src="/logo_rdps2.png" alt="Icon" className="h-8 brightness-0 invert mx-auto" />
            )}
          </AnimatePresence>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button key={item.name} onClick={() => setActiveTab(item.name)} className={`w-full flex items-center gap-4 p-3 rounded-sm transition-all group ${activeTab === item.name ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'hover:bg-white/5 text-gray-400'}`}>
              <item.icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">{item.name}</span>}
              {sidebarOpen && item.name === 'Inquiries' && counts.unreadLeads > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full animate-bounce shadow-lg">NEW</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5 h-20">
          <button onClick={handleLogout} className="w-full flex items-center gap-4 p-3 rounded-sm text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all">
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-[10px] uppercase tracking-widest font-bold">Logout</span>}
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 z-30">
          <div className="flex items-center gap-6">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-secondary rounded-sm transition-colors text-dark"><Menu size={24} /></button>
            <h2 className="text-xl font-serif text-dark italic">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('Inquiries')}
              className="relative p-2 text-gray-400 hover:text-primary transition-all hover:bg-secondary rounded-full"
            >
              <Bell size={22} />
              {counts.unreadLeads > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                  {counts.unreadLeads}
                </span>
              )}
            </button>
            <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded-full border border-primary/20 font-serif font-bold text-primary shadow-inner">R</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
           <AnimatePresence mode='wait'>
             <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                {activeTab === 'Overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <StatCard label="Products" value={counts.products} icon={ShoppingBag} />
                    <StatCard label="Albums" value={counts.albums} icon={ImageIcon} />
                    <StatCard label="Testimonials" value={counts.testimonials} icon={Star} />
                    <StatCard label="Total Leads" value={counts.totalLeads} icon={Layers} />
                  </div>
                )}
                {activeTab === 'Products' && <ProductManagement refreshStats={fetchCounts} />}
                {activeTab === 'Portfolio' && <PortfolioManagement refreshStats={fetchCounts} />}
                {activeTab === 'Testimonials' && <TestimonialManagement refreshStats={fetchCounts} />}
                {activeTab === 'Inquiries' && <InquiryManagement refreshStats={fetchCounts} />}
                {activeTab === 'Settings' && <SettingsManagement />}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
