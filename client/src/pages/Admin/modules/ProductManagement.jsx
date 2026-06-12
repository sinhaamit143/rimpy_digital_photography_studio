import React, { useState, useEffect, useRef } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Filter, Edit2, Trash2, 
  ShoppingBag, Loader2, Upload, X, ZoomIn 
} from 'lucide-react';
import api from '../../../utils/api';
import Pagination from '../../../components/Common/Pagination';
import DeleteConfirmModal from '../../../components/Common/DeleteConfirmModal';

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5004' : '';

const ProductManagement = ({ refreshStats }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [modalType, setModalType] = useState(null); 
  const [deleteData, setDeleteData] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showZoom, setShowZoom] = useState(null);
  const [formData, setFormData] = useState({ title: '', price: '', description: '', categoryId: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const [pagination, setPagination] = useState(null);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/products?page=${page}&limit=10`;
      if (filter !== 'All') {
        const cat = categories.find(c => c.name === filter);
        if (cat) url += `&categoryId=${cat.id}`;
      }

      const [prodRes, catRes] = await Promise.all([
        api.get(url), 
        api.get('/products/categories')
      ]);
      
      setProducts(prodRes.data.products);
      setPagination(prodRes.data.pagination);
      setCategories(catRes.data);
    } catch (err) { console.error('Fetch error:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(1); }, [filter]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.categoryId) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('categoryId', formData.categoryId);
    if (imageFile) data.append('image', imageFile);

    try {
      if (modalType === 'add') { await api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }); }
      else { await api.put(`/products/${selectedProduct.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); }
      setModalType(null); fetchData(); refreshStats();
    } catch (err) {
      console.error('Product save error:', err);
      const serverMsg = err.response?.data?.message;
      const errorMsg = serverMsg || err.message || 'Failed to save product. Please try again.';
      alert(errorMsg);
    } finally { setIsSubmitting(false); }
  };

  const filteredProducts = products;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div><h3 className="text-3xl font-serif text-main mb-2 italic">Product Inventory</h3><p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Manage your boutique store</p></div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto"><div className="relative group flex-1 lg:flex-none min-w-[150px] font-sans"><Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full pl-10 pr-10 py-4 bg-surface border border-surface outline-none text-[10px] uppercase tracking-widest font-bold text-main appearance-none cursor-pointer focus:border-primary transition-all shadow-sm"><option value="All">All Categories</option>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div><button onClick={() => { setModalType('category'); }} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-secondary border border-primary/10 text-primary uppercase tracking-widest text-[10px] font-bold hover:bg-primary hover:text-white transition-all shadow-sm rounded-sm"><Plus size={16} /> Category</button><button onClick={() => { setModalType('add'); setFormData({ title: '', price: '', description: '', categoryId: '' }); setImagePreview(null); setImageFile(null); setSelectedProduct(null); }} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all shadow-xl rounded-sm"><Plus size={16} /> New Item</button></div>
      </div>

      <div className="bg-surface border border-surface shadow-sm overflow-hidden rounded-sm">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-primary"><Loader2 size={40} className="animate-spin mb-4 opacity-20" /><p className="text-[10px] uppercase tracking-widest font-bold">Syncing Inventory...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-surface text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  <th className="px-8 py-6">Item</th><th className="px-8 py-6">Category</th><th className="px-8 py-6">Price</th><th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-8 py-6"><div className="flex items-center gap-4"><div onClick={() => setShowZoom(p.imageUrl)} className="w-16 h-16 bg-secondary rounded-sm overflow-hidden relative cursor-zoom-in group/img border border-surface shadow-sm"><img src={p.imageUrl?.startsWith('http') ? p.imageUrl : `${BASE_URL}${p.imageUrl}`} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" /><div className="absolute inset-0 bg-dark/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center"><ZoomIn size={16} className="text-white" /></div></div><span className="font-serif text-main font-bold line-clamp-1">{p.title}</span></div></td>
                    <td className="px-8 py-6"><span className="text-[10px] uppercase tracking-widest font-bold px-3 py-1 bg-secondary text-primary border border-primary/10 rounded-full">{p.category?.name}</span></td>
                    <td className="px-8 py-6 font-bold text-main text-base"><span className="text-primary mr-1">₹</span>{p.price.toLocaleString('en-IN')}</td>
                    <td className="px-8 py-6 text-right"><div className="flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><button onClick={() => { setModalType('edit'); setSelectedProduct(p); setFormData({ title: p.title, price: p.price, description: p.description, categoryId: p.categoryId }); setImagePreview(p.imageUrl?.startsWith('http') ? p.imageUrl : `${BASE_URL}${p.imageUrl}`); }} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={16} /></button><button onClick={() => setDeleteData(p)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination 
        pagination={pagination} 
        onPageChange={(page) => fetchData(page)} 
      />

      <AnimatePresence>
        {modalType === 'category' && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center p-4">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setModalType(null); setSelectedCategory(null); setNewCategoryName(''); setImagePreview(null); setImageFile(null); }} className="absolute inset-0 bg-dark/80 backdrop-blur-md" />
            <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-surface w-full max-w-md rounded-sm shadow-2xl relative z-10 overflow-hidden">
              <div className="p-6 border-b border-surface flex justify-between items-center bg-secondary/30">
                <h4 className="text-lg font-serif text-main italic">{selectedCategory ? 'Edit Category' : 'Product Categories'}</h4>
                <button 
                  onClick={() => { setModalType(null); setSelectedCategory(null); setNewCategoryName(''); setImagePreview(null); setImageFile(null); }} 
                  className="text-gray-400 hover:text-main"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-8">
                {!selectedCategory && (
                  <div className="space-y-4 max-h-48 overflow-y-auto no-scrollbar pr-2">
                    <h5 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Existing Categories</h5>
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <div key={cat.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-sm group">
                          <div className="flex items-center gap-3">
                            {cat.imageUrl && (
                              <img src={cat.imageUrl.startsWith('http') ? cat.imageUrl : `${BASE_URL}${cat.imageUrl}`} className="w-8 h-8 rounded-full object-cover border border-surface" />
                            )}
                            <span className="font-bold text-main text-xs">{cat.name} <span className="text-[9px] text-gray-400 font-normal ml-2">({cat.products?.length || 0} items)</span></span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => {
                                setSelectedCategory(cat);
                                setNewCategoryName(cat.name);
                                setImagePreview(cat.imageUrl ? (cat.imageUrl.startsWith('http') ? cat.imageUrl : `${BASE_URL}${cat.imageUrl}`) : null);
                              }}
                              className="p-2 text-gray-300 hover:text-primary transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <form 
                  onSubmit={async (e) => { 
                    e.preventDefault(); 
                    if(!newCategoryName) return; 
                    setIsSubmitting(true); 
                    const data = new FormData();
                    data.append('name', newCategoryName);
                    if (imageFile) data.append('image', imageFile);

                    try { 
                      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
                      if (selectedCategory) {
                        await api.put(`/products/categories/${selectedCategory.id}`, data, config);
                      } else {
                        await api.post('/products/categories', data, config);
                      }
                      setNewCategoryName(''); 
                      setImagePreview(null);
                      setImageFile(null);
                      setSelectedCategory(null);
                      fetchData(); 
                    } catch(err){ 
                      alert('Failed to save category'); 
                    } finally { 
                      setIsSubmitting(false); 
                    } 
                  }} 
                  className={`space-y-6 ${!selectedCategory ? 'pt-6 border-t border-surface' : ''}`}
                >
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary">
                      {selectedCategory ? 'Category Name' : 'Add New Category'}
                    </label>
                    <input type="text" required value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-main font-sans" placeholder="Category Name" />
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Category Image</label>
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-primary p-6 text-center cursor-pointer bg-secondary/30 group rounded-sm"
                    >
                      <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                      {imagePreview ? (
                        <img src={imagePreview} className="w-20 h-20 mx-auto object-cover rounded-full border-2 border-white shadow-md" />
                      ) : (
                        <Upload size={20} className="mx-auto text-gray-300 group-hover:text-primary" />
                      )}
                      <p className="text-[9px] mt-2 text-gray-400 uppercase tracking-widest">Click to upload</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {selectedCategory && (
                      <button 
                        type="button"
                        onClick={() => { setSelectedCategory(null); setNewCategoryName(''); setImagePreview(null); }}
                        className="flex-1 py-4 bg-surface border border-gray-200 text-main uppercase tracking-widest text-[10px] font-bold"
                      >
                        Cancel
                      </button>
                    )}
                    <button disabled={isSubmitting} className="flex-[2] py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all rounded-sm flex items-center justify-center gap-3 shadow-lg">
                      {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : (selectedCategory ? 'Update' : 'Create Category')}
                    </button>
                  </div>
                </form>
              </div>
            </m.div>
          </div>
        )}

        {(modalType === 'add' || modalType === 'edit') && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-dark/80 backdrop-blur-md" />
            <m.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-surface w-full max-w-3xl max-h-[90vh] rounded-sm shadow-2xl relative z-10 overflow-hidden flex flex-col"><div className="p-6 border-b border-surface flex justify-between items-center bg-secondary/30 shrink-0"><h4 className="text-xl font-serif text-main italic">{modalType === 'add' ? 'Add Item' : 'Edit Item'}</h4><button onClick={() => setModalType(null)} className="text-gray-400 hover:text-main" aria-label="Close"><X size={28} /></button></div><form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto custom-scrollbar"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Title</label><input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-main font-sans" /></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Price (₹)</label><input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-main font-sans" /></div></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Category</label><select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-main appearance-none font-sans"><option value="">Select Category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Description</label><textarea rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none resize-none font-serif italic text-main" /></div><div className="space-y-2 pb-6"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Image</label><div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-200 hover:border-primary p-12 text-center cursor-pointer bg-secondary/30 group rounded-sm"><input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />{imagePreview ? <img src={imagePreview} className="w-full max-w-[200px] h-40 mx-auto object-cover border-4 border-white shadow-lg" /> : <Upload size={30} className="mx-auto text-gray-300 group-hover:text-primary" />}</div></div></form><div className="p-6 bg-surface-hover border-t border-surface flex gap-4 shrink-0"><button type="button" onClick={() => setModalType(null)} className="flex-1 py-4 bg-surface border border-gray-200 text-main uppercase tracking-widest text-[10px] font-bold">Cancel</button><button onClick={handleSubmit} disabled={isSubmitting} className="flex-[2] py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all rounded-sm">{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save'}</button></div></m.div>
          </div>
        )}

        <AnimatePresence>
          {showZoom && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-20">
              <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowZoom(null)} className="absolute inset-0 bg-dark/95 backdrop-blur-xl" />
              <m.img initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} src={showZoom?.startsWith('http') ? showZoom : `${BASE_URL}${showZoom}`} className="max-w-full max-h-full object-contain relative z-10 shadow-2xl" />
              <button 
                onClick={() => setShowZoom(null)} 
                className="absolute top-10 right-10 text-white/50 hover:text-white z-20"
                aria-label="Close Zoom"
              >
                <X size={40} />
              </button>
            </div>
          )}
        </AnimatePresence>
      </AnimatePresence>

      <DeleteConfirmModal isOpen={!!deleteData} onClose={() => setDeleteData(null)} onConfirm={async () => { setIsSubmitting(true); try { await api.delete(`/products/${deleteData.id}`); setDeleteData(null); fetchData(); refreshStats(); } catch(err) { alert(err.response?.data?.message || 'Failed to delete product.'); setDeleteData(null); } finally { setIsSubmitting(false); } }} title={deleteData?.title} loading={isSubmitting} />
    </div>
  );
};

export default ProductManagement;
