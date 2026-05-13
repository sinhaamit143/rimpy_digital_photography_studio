import React, { useState, useEffect } from 'react';
import { 
  Trash2, Loader2, RefreshCw, Mail, Phone, Clock, CheckCircle, MailOpen
} from 'lucide-react';
import api from '../../../utils/api';
import Pagination from '../../../components/Common/Pagination';
import DeleteConfirmModal from '../../../components/Common/DeleteConfirmModal';

const InquiryManagement = ({ refreshStats }) => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteData, setDeleteData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [pagination, setPagination] = useState(null);

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const res = await api.get(`/contact?page=${page}&limit=10`);
      setInquiries(res.data.inquiries);
      setPagination(res.data.pagination);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(1); }, []);

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
        <div><h3 className="text-3xl font-serif text-main mb-2 italic">Client Inquiries</h3><p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Incoming leads and shoot requests</p></div>
        <button 
          onClick={() => fetchData(1)} 
          className="flex items-center gap-3 px-6 py-4 bg-secondary text-primary uppercase tracking-widest text-[10px] font-bold hover:bg-primary hover:text-white transition-all shadow-sm rounded-sm"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Sync Leads
        </button>
      </div>

      <div className="bg-surface border border-surface shadow-sm overflow-hidden rounded-sm">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-primary"><Loader2 size={40} className="animate-spin mb-4 opacity-20" /><p className="text-[10px] uppercase tracking-widest font-bold">Fetching leads...</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-secondary/50 border-b border-surface text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                  <th className="px-8 py-6 w-20">Sr No</th><th className="px-8 py-6">Client Info</th><th className="px-8 py-6">Message</th><th className="px-8 py-6">Status</th><th className="px-8 py-6">Received</th><th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inquiries.map((inq, index) => (
                  <tr key={inq.id} className={`transition-colors group ${!inq.isRead ? 'bg-primary/[0.02] border-l-4 border-l-primary' : 'hover:bg-secondary/20 border-l-4 border-l-transparent'}`}>
                    <td className="px-8 py-6 font-bold text-main text-xs opacity-50">{((pagination?.page - 1) * pagination?.limit) + index + 1}</td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-1">
                        <span className="font-serif text-main font-bold flex items-center gap-2">{inq.name} {!inq.isRead && <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />}</span>
                        <div className="flex items-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                          <a href={`mailto:${inq.email}`} className="flex items-center gap-1 hover:text-primary transition-colors"><Mail size={10} /> {inq.email}</a>
                          <a href={`tel:${inq.phone}`} className="flex items-center gap-1 hover:text-primary transition-colors"><Phone size={10} /> {inq.phone}</a>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="p-4 bg-secondary/30 rounded-sm text-xs text-main font-serif italic max-w-xs line-clamp-2 hover:line-clamp-none transition-all cursor-help border border-transparent hover:border-primary/10">
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

      <Pagination 
        pagination={pagination} 
        onPageChange={(page) => fetchData(page)} 
      />

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

export default InquiryManagement;
