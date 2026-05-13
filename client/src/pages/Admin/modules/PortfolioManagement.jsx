import React, { useState, useEffect, useRef } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  Plus, Filter, Edit2, Trash2, Loader2, Upload, X, 
  Layers, FolderPlus, ImagePlus, RefreshCw, Clock, ImageIcon
} from 'lucide-react';
import api from '../../../utils/api';
import Pagination from '../../../components/Common/Pagination';
import DeleteConfirmModal from '../../../components/Common/DeleteConfirmModal';

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5004' : '';

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

  const [pagination, setPagination] = useState(null);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      let url = `/portfolio/albums?page=${page}&limit=10`;
      if (filter !== 'All') {
        const cat = categories.find(c => c.name === filter);
        if (cat) url += `&categoryId=${cat.id}`;
      }
      
      const [albumRes, catRes] = await Promise.all([
        api.get(url), 
        api.get('/portfolio/categories')
      ]);
      
      setAlbums(albumRes.data.albums);
      setPagination(albumRes.data.pagination);
      setCategories(catRes.data);
    } catch (err) { console.error('Fetch error:', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(1); }, [filter]);

  const handleAlbumSubmit = async (e) => {
    e.preventDefault();
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
      console.error('Album save error:', err);
      const serverMsg = err.response?.data?.message;
      const errorMsg = serverMsg || err.message || 'Failed to save album. Please try again.';
      alert(errorMsg);
    } finally { setIsSubmitting(false); }
  };

  const filteredAlbums = albums;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div><h3 className="text-3xl font-serif text-main mb-2 italic">Portfolio Gallery</h3><p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Manage client shoots</p></div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto"><div className="relative group flex-1 lg:flex-none min-w-[150px] font-sans"><Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" /><select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full pl-10 pr-10 py-4 bg-surface border border-surface outline-none text-[10px] uppercase tracking-widest font-bold text-main appearance-none cursor-pointer focus:border-primary transition-all shadow-sm"><option value="All">All Genres</option>{categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}</select></div><button onClick={() => { setModalType('category'); }} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-4 bg-secondary border border-primary/10 text-primary uppercase tracking-widest text-[10px] font-bold hover:bg-primary hover:text-white transition-all shadow-sm rounded-sm"><FolderPlus size={16} /> Genre</button><button onClick={() => { 
          setModalType('album'); 
          setAlbumData({ title: '', clientName: '', categoryId: '' }); 
          setCoverPreview(null); 
          setCoverFile(null);
          setSelectedAlbum(null);
        }} className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-8 py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all shadow-xl rounded-sm"><Plus size={16} /> New Album</button></div>
      </div>

      <div className="bg-surface border border-surface shadow-sm overflow-hidden rounded-sm">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-primary"><Loader2 size={40} className="animate-spin mb-4 opacity-20" /><p className="text-[10px] uppercase tracking-widest font-bold">Loading rolls...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-surface text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  <th className="px-8 py-6 w-20">Sr No</th><th className="px-8 py-6">Album</th><th className="px-8 py-6">Genre</th><th className="px-8 py-6">Count</th><th className="px-8 py-6">Date</th><th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAlbums.map((a, index) => (
                  <tr key={a.id} className="hover:bg-secondary/20 transition-colors group">
                    <td className="px-8 py-6 font-bold text-main text-xs opacity-50">{((pagination?.page - 1) * pagination?.limit) + index + 1}</td>
                    <td className="px-8 py-6"><div className="flex items-center gap-4"><div onClick={() => setShowZoom(a.coverImage)} className="w-16 h-12 bg-secondary rounded-sm overflow-hidden relative cursor-zoom-in group/img border border-surface shadow-sm"><img src={a.coverImage?.startsWith('http') ? a.coverImage : `${BASE_URL}${a.coverImage}`} className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-500" /></div><div className="flex flex-col"><span className="font-serif text-main font-bold line-clamp-1">{a.title}</span><span className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Client: {a.clientName}</span></div></div></td>
                    <td className="px-8 py-6"><span className="text-[9px] uppercase tracking-widest font-bold px-3 py-1 bg-secondary text-primary border border-primary/10 rounded-full">{a.category?.name}</span></td>
                    <td className="px-8 py-6"><button onClick={() => { setSelectedAlbum(a); setModalType('media'); }} className="flex items-center gap-2 text-primary hover:text-main transition-colors font-bold text-[10px] uppercase tracking-widest"><Layers size={14} /> {a.images?.length || 0} Assets</button></td>
                    <td className="px-8 py-6 text-gray-400 text-[10px] uppercase font-bold">{new Date(a.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-8 py-6 text-right"><div className="flex justify-end gap-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"><button onClick={() => { setSelectedAlbum(a); setModalType('editAlbum'); setAlbumData({ title: a.title, clientName: a.clientName, categoryId: a.categoryId }); setCoverPreview(a.coverImage?.startsWith('http') ? a.coverImage : `${BASE_URL}${a.coverImage}`); }} className="p-2 text-gray-400 hover:text-primary transition-colors"><Edit2 size={16} /></button><button onClick={() => setDeleteData(a)} className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></div></td>
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
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-dark/80 backdrop-blur-md" />
            <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-surface w-full max-w-md rounded-sm shadow-2xl relative z-10 overflow-hidden">
              <div className="p-6 border-b border-surface flex justify-between items-center bg-secondary/30">
                <h4 className="text-lg font-serif text-main italic">Portfolio Genres</h4>
                <button 
                  onClick={() => setModalType(null)} 
                  className="text-gray-400 hover:text-main"
                  aria-label="Close Modal"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-8">
                <div className="space-y-4 max-h-60 overflow-y-auto no-scrollbar pr-2">
                  <h5 className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Existing Genres</h5>
                  <div className="space-y-2">
                    {categories.map(cat => (
                      <div key={cat.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-sm group">
                        <span className="font-bold text-main text-xs">{cat.name} <span className="text-[9px] text-gray-400 font-normal ml-2">({cat.albums?.length || 0} albums)</span></span>
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

                <form onSubmit={async (e) => { e.preventDefault(); if(!newCategoryName) return; setIsSubmitting(true); try { await api.post('/portfolio/categories', { name: newCategoryName }); setNewCategoryName(''); fetchData(); } catch(err){ alert('Fail'); } finally { setIsSubmitting(false); } }} className="space-y-6 pt-6 border-t border-surface">
                  <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-primary">Add New Genre</label>
                    <input type="text" required value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-main font-sans" placeholder="Genre Name" />
                  </div>
                  <button disabled={isSubmitting} className="w-full py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all rounded-sm flex items-center justify-center gap-3">
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : 'Create Genre'}
                  </button>
                </form>
              </div>
            </m.div>
          </div>
        )}

        {(modalType === 'album' || modalType === 'editAlbum') && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-dark/80 backdrop-blur-md" />
            <m.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-surface w-full max-w-2xl max-h-[90vh] rounded-sm shadow-2xl relative z-10 overflow-hidden flex flex-col">
              <div className="p-8 border-b border-surface flex justify-between items-center bg-secondary/30 shrink-0">
                <h4 className="text-2xl font-serif text-main italic">{modalType === 'album' ? 'New Album' : 'Edit Album'}</h4>
                <button 
                  onClick={() => setModalType(null)} 
                  className="text-gray-400 hover:text-main"
                  aria-label="Close Modal"
                >
                  <X size={28} />
                </button>
              </div>
              <form onSubmit={handleAlbumSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Title</label><input type="text" required value={albumData.title} onChange={e => setAlbumData({...albumData, title: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-main font-sans" /></div>
                  <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Client</label><input type="text" required value={albumData.clientName} onChange={e => setAlbumData({...albumData, clientName: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-main font-sans" /></div>
                </div>
                <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Genre</label><select required value={albumData.categoryId} onChange={e => setAlbumData({...albumData, categoryId: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-main appearance-none font-sans"><option value="">Select Genre</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div className="space-y-2 pb-6"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Cover Photo</label><div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-200 hover:border-primary p-12 text-center cursor-pointer bg-secondary/30 group rounded-sm"><input type="file" ref={fileInputRef} onChange={(e) => { const file = e.target.files[0]; if(file){ setCoverFile(file); setCoverPreview(URL.createObjectURL(file)); } }} className="hidden" accept="image/*" />{coverPreview ? <img src={coverPreview} className="w-full h-48 object-cover border-4 border-white shadow-lg" /> : <Upload size={32} className="mx-auto text-gray-300 group-hover:text-primary" />}</div></div>
              </form>
              <div className="p-8 bg-surface-hover border-t border-surface flex gap-4 shrink-0"><button type="button" onClick={() => setModalType(null)} className="flex-1 py-4 bg-surface border border-gray-200 text-main uppercase tracking-widest text-[10px] font-bold">Cancel</button><button onClick={handleAlbumSubmit} disabled={isSubmitting} className="flex-[2] py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all rounded-sm">{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save'}</button></div>
            </m.div>
          </div>
        )}

        {modalType === 'media' && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-dark/80 backdrop-blur-md" /><m.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-surface w-full max-w-4xl max-h-[90vh] rounded-sm shadow-2xl relative z-10 overflow-hidden flex flex-col"><div className="p-6 border-b border-surface flex justify-between items-center bg-secondary/30 shrink-0"><div><h4 className="text-xl font-serif text-main italic">{selectedAlbum?.title}</h4><p className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Media Manager</p></div><button onClick={() => setModalType(null)} className="text-gray-400 hover:text-main" aria-label="Close"><X size={28} /></button></div><div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10"><div className="grid grid-cols-2 md:grid-cols-4 gap-4">{selectedAlbum?.images?.map((img) => (<div key={img.id} className="relative aspect-square bg-secondary group overflow-hidden rounded-sm"><img src={img.imageUrl?.startsWith('http') ? img.imageUrl : `${BASE_URL}${img.imageUrl}`} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-dark/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><button onClick={async () => { setIsDeletingImg(img.id); try { await api.delete(`/portfolio/images/${img.id}`); const r = await api.get('/portfolio/albums'); setSelectedAlbum(r.data.albums.find(al => al.id === selectedAlbum.id)); fetchData(); } finally { setIsDeletingImg(null); } }} disabled={isDeletingImg === img.id} className="p-3 bg-red-500 text-white rounded-full shadow-lg">{isDeletingImg === img.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}</button></div></div>))}</div><div className="border-t border-surface pt-10"><h5 className="text-[10px] uppercase tracking-widest font-bold text-primary mb-4 flex items-center gap-2"><ImagePlus size={14} /> Add Assets</h5><div onClick={() => galleryInputRef.current.click()} className="border-2 border-dashed border-gray-200 hover:border-primary p-12 text-center cursor-pointer bg-secondary/10 group rounded-sm"><input type="file" ref={galleryInputRef} multiple onChange={(e) => setGalleryFiles(e.target.files)} className="hidden" accept="image/*" /><Upload size={32} className="mx-auto mb-4 text-gray-300 group-hover:text-primary transition-all" /><p className="text-[10px] font-bold uppercase tracking-widest text-main">Select Images</p>{galleryFiles.length > 0 && <p className="mt-4 text-primary font-bold text-xs">{galleryFiles.length} staged</p>}</div></div></div><div className="p-8 bg-surface-hover border-t border-surface shrink-0"><button onClick={async (e) => { e.preventDefault(); if(galleryFiles.length===0)return; setIsSubmitting(true); const d=new FormData(); Array.from(galleryFiles).forEach(f=>d.append('images', f)); try { await api.post(`/portfolio/albums/${selectedAlbum.id}/images`, d, {headers:{'Content-Type':'multipart/form-data'}}); setGalleryFiles([]); const r=await api.get('/portfolio/albums'); setSelectedAlbum(r.data.albums.find(al=>al.id===selectedAlbum.id)); fetchData(); } finally { setIsSubmitting(false); } }} disabled={isSubmitting || galleryFiles.length === 0} className="w-full py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-xl rounded-sm">{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={14} />}</button></div></m.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal isOpen={!!deleteData} onClose={() => setDeleteData(null)} onConfirm={async () => { setIsSubmitting(true); try { await api.delete(`/portfolio/albums/${deleteData.id}`); setDeleteData(null); fetchData(); refreshStats(); } finally { setIsSubmitting(false); } }} title={deleteData?.title} loading={isSubmitting} />
    </div>
  );
};

export default PortfolioManagement;
