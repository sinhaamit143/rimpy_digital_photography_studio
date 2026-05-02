import React, { useState, useEffect, useRef } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, Star, Loader2, User, X 
} from 'lucide-react';
import api from '../../../utils/api';
import Pagination from '../../../components/Common/Pagination';
import DeleteConfirmModal from '../../../components/Common/DeleteConfirmModal';

const BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5004' : '';

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

  const [pagination, setPagination] = useState(null);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/testimonials?page=${page}&limit=10`);
      setTestimonials(res.data.testimonials);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(1); }, []);

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
      console.error('Testimonial save error:', err);
      const serverMsg = err.response?.data?.message;
      const errorMsg = serverMsg || err.message || 'Failed to save testimonial. Please try again.';
      alert(errorMsg);
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
          setImageFile(null); 
          setSelectedReview(null); 
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
                    <td className="px-8 py-6 font-bold text-dark text-xs opacity-50">{((pagination?.page - 1) * pagination?.limit) + index + 1}</td>
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

      <Pagination 
        pagination={pagination} 
        onPageChange={(page) => fetchData(page)} 
      />

      <AnimatePresence>
        {(modalType === 'add' || modalType === 'edit') && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalType(null)} className="absolute inset-0 bg-dark/80 backdrop-blur-md" /><m.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} className="bg-white w-full max-w-2xl max-h-[90vh] rounded-sm shadow-2xl relative z-10 overflow-hidden flex flex-col"><div className="p-8 border-b border-gray-100 flex justify-between items-center bg-secondary/30 shrink-0"><h4 className="text-2xl font-serif text-dark italic">{modalType === 'add' ? 'New Testimonial' : 'Edit Review'}</h4><button onClick={() => setModalType(null)} className="text-gray-400 hover:text-dark" aria-label="Close"><X size={28} /></button></div><form onSubmit={handleSubmit} className="p-10 space-y-8 overflow-y-auto custom-scrollbar"><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Client Name</label><input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none font-bold text-dark font-sans" /></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Rating</label><div className="flex gap-4 p-4 bg-secondary/50 rounded-sm">{[1,2,3,4,5].map(num => <button key={num} type="button" onClick={() => setFormData({...formData, rating: num})} className={`transition-all ${formData.rating >= num ? 'text-yellow-400 scale-125' : 'text-gray-300'}`}><Star size={24} className={formData.rating >= num ? "fill-yellow-400" : ""} /></button>)}</div></div><div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Comment</label><textarea rows="4" required value={formData.comment} onChange={e => setFormData({...formData, comment: e.target.value})} className="w-full p-4 bg-secondary border-b border-transparent focus:border-primary outline-none resize-none font-serif italic text-dark" /></div><div className="space-y-2 pb-6"><label className="text-[10px] uppercase tracking-widest font-bold text-primary">Photo / Logo</label><div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed border-gray-200 hover:border-primary p-12 text-center cursor-pointer bg-dark group rounded-sm flex flex-col items-center relative overflow-hidden"><div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" /><input type="file" ref={fileInputRef} onChange={(e) => { const f=e.target.files[0]; if(f){ setImageFile(f); setImagePreview(URL.createObjectURL(f)); } }} className="hidden" accept="image/*" />{imagePreview ? <img src={imagePreview} className="w-32 h-32 rounded-full object-contain border-4 border-white/20 shadow-xl relative z-10" /> : <User size={40} className="text-gray-500 relative z-10" />}<p className="mt-4 text-[9px] uppercase tracking-widest text-gray-400 font-bold relative z-10">Supports Transparent PNGs</p></div></div></form><div className="p-8 bg-gray-50 border-t border-gray-100 flex gap-4 shrink-0"><button type="button" onClick={() => setModalType(null)} className="flex-1 py-4 bg-white border border-gray-200 text-dark uppercase tracking-widest text-[10px] font-bold">Cancel</button><button onClick={handleSubmit} disabled={isSubmitting} className="flex-[2] py-4 bg-dark text-white uppercase tracking-widest text-[10px] font-bold hover:bg-primary transition-all rounded-sm flex items-center justify-center gap-3">{isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Publish'}</button></div></m.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal isOpen={!!deleteData} onClose={() => setDeleteData(null)} onConfirm={async () => { setIsSubmitting(true); try { await api.delete(`/testimonials/${deleteData.id}`); setDeleteData(null); fetchData(); refreshStats(); } finally { setIsSubmitting(false); } }} title={deleteData?.name} loading={isSubmitting} />
    </div>
  );
};

export default TestimonialManagement;
