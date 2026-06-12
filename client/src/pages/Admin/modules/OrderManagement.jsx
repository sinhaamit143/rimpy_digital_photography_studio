import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ShoppingCart, RefreshCw, Loader2, MessageCircle, MapPin, PackageOpen, X, Trash2 } from 'lucide-react';
import api from '../../../utils/api';
import DeleteConfirmModal from '../../../components/Common/DeleteConfirmModal';

const OrderManagement = ({ refreshStats }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    setRefreshing(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders);
      if (refreshStats) refreshStats();
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/orders/${id}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o));
      if (refreshStats) refreshStats();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status.');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-surface-hover text-main/60 border-surface';
    }
  };

  const openWhatsApp = (order) => {
    const phone = order.phone.replace(/[^0-9]/g, '');
    let finalPhone = phone;
    if (phone.length === 10) finalPhone = `91${phone}`;

    const BACKEND_URL = window.location.hostname === 'localhost' 
      ? 'http://localhost:5004' 
      : window.location.origin;

    let imageUrlStr = '';
    if (order.product?.imageUrl) {
      imageUrlStr = order.product.imageUrl.startsWith('http') 
        ? order.product.imageUrl 
        : `${BACKEND_URL}${order.product.imageUrl}`;
    }

    const message = `${imageUrlStr ? imageUrlStr + '\n\n' : ''}Hi there! Thank you for reaching out to Rimpy Digital Photography Studio. 📸 We have received your inquiry for the *${order.productTitle}* at *₹${order.price}*.

We would love to help you get this sorted. To proceed, could you please let us know a few quick details?

Please let us know if you will be picking up your order from our studio on Railway Road, or if you require delivery. We offer local delivery within Karnal, alongside comprehensive domestic and worldwide shipping.

Once we finalize the details, how would you prefer to make the advance payment? For local orders, we accept UPI (Google Pay/PhonePe) or Cash at the studio. If you're ordering internationally, we can easily set up payment via PayPal or a secure payment link!`;

    const url = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <Loader2 size={40} className="animate-spin mb-4 text-primary" />
        <p className="text-[10px] uppercase tracking-widest font-bold">Loading Orders...</p>
      </div>
    );
  }

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const currentOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end bg-surface p-6 border border-surface shadow-sm rounded-sm">
        <div>
          <h3 className="text-2xl font-serif text-main mb-2">Order Management</h3>
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
            {orders.length} Total Orders
          </p>
        </div>
        <button 
          onClick={fetchOrders}
          disabled={refreshing}
          className="p-3 bg-secondary text-primary rounded-sm hover:bg-primary hover:text-white transition-all border border-surface disabled:opacity-50 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          <span className="hidden md:inline">Refresh</span>
        </button>
      </div>

      <div className="bg-surface border border-surface shadow-sm rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-secondary/50 border-b border-surface">
                <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Order ID</th>
                <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Customer</th>
                <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Product</th>
                <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Location</th>
                <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Date</th>
                <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">Status</th>
                <th className="p-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-gray-400">
                    <PackageOpen size={40} className="mx-auto mb-4 opacity-50" />
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold">No orders found.</p>
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-surface hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <span className="text-[10px] font-mono font-bold text-gray-500">#{order.id.toString().padStart(4, '0')}</span>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-bold text-main">{order.name}</p>
                      <p className="text-[10px] text-gray-500">{order.phone}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {order.product?.imageUrl && (
                          <img src={order.product.imageUrl} alt="Product" className="w-8 h-8 rounded-sm object-cover border border-gray-200" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-main line-clamp-1 max-w-[150px]">{order.productTitle}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] text-primary">₹{order.price}</p>
                            <span className="text-[8px] uppercase tracking-widest bg-secondary px-2 py-0.5 rounded-full border border-surface text-gray-500">{order.category}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <MapPin size={12} className="text-primary" />
                        <span>{order.district}, {order.state} - {order.pinCode}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border outline-none cursor-pointer appearance-none text-center ${getStatusColor(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-[10px] uppercase tracking-widest font-bold text-primary hover:text-main transition-colors"
                        >
                          Details
                        </button>
                        <button 
                          onClick={() => openWhatsApp(order)}
                          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-sm"
                          title="Contact via WhatsApp"
                        >
                          <MessageCircle size={14} />
                        </button>
                        <button 
                          onClick={() => setDeleteData(order)}
                          className="bg-red-50 text-red-500 p-2 rounded-full hover:bg-red-100 transition-colors shadow-sm"
                          title="Delete Order"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-surface p-4 border border-surface shadow-sm rounded-sm">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-4 py-2 bg-secondary text-main text-[10px] uppercase tracking-widest font-bold disabled:opacity-50 hover:bg-gray-200 transition-colors rounded-sm"
            >
              Previous
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-4 py-2 bg-secondary text-main text-[10px] uppercase tracking-widest font-bold disabled:opacity-50 hover:bg-gray-200 transition-colors rounded-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <m.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-dark/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <m.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="bg-surface rounded-sm shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-surface bg-secondary/50">
                <h3 className="text-xl font-serif">Order Details <span className="text-gray-400 text-sm ml-2 font-mono">#{selectedOrder.id.toString().padStart(4, '0')}</span></h3>
                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Customer Info</h4>
                    <p className="text-sm font-bold text-main">{selectedOrder.name}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.email}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Delivery Address</h4>
                    <p className="text-sm text-gray-600">{selectedOrder.district}, {selectedOrder.state}</p>
                    <p className="text-sm text-gray-600">{selectedOrder.country} - {selectedOrder.pinCode}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Customer Message</h4>
                    <p className="text-sm text-gray-600 bg-secondary p-4 rounded-sm border border-surface italic">
                      {selectedOrder.message || "No additional message provided."}
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Product Info</h4>
                    {selectedOrder.product?.imageUrl && (
                      <img src={selectedOrder.product.imageUrl} alt="Product" className="w-full aspect-video object-cover rounded-sm mb-4 border border-surface" />
                    )}
                    <p className="text-lg font-serif font-bold text-main">{selectedOrder.productTitle}</p>
                    <p className="text-xs uppercase tracking-widest text-primary mb-2">{selectedOrder.category}</p>
                    <p className="text-xl font-bold text-main">₹{selectedOrder.price}</p>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Current Status</h4>
                    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full border ${getStatusColor(selectedOrder.status)}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>

      <DeleteConfirmModal 
        isOpen={!!deleteData} 
        onClose={() => setDeleteData(null)} 
        onConfirm={async () => { 
          setIsDeleting(true); 
          try { 
            await api.delete(`/orders/${deleteData.id}`); 
            setDeleteData(null); 
            fetchOrders(); 
          } catch(err) { 
            alert(err.response?.data?.message || 'Failed to delete order.'); 
            setDeleteData(null); 
          } finally { 
            setIsDeleting(false); 
          } 
        }} 
        title={deleteData ? `Order #${deleteData.id.toString().padStart(4, '0')} from ${deleteData.name}` : ''} 
        loading={isDeleting} 
      />
    </div>
  );
};

export default OrderManagement;
