// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LogOut,
  Package,
  ShoppingBag,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useProductsContext } from '../../context/ProductsContext';
import {
  getOrders,
  getAdminProducts,
  deleteAdminProduct,
  updateAdminProduct,
  updateOrderStatus,
  type Order,
  type AdminProduct,
} from '../../lib/firestore';
import type { Product } from '../../data/products';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';

type Tab = 'products' | 'orders';

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const { refreshProducts } = useProductsContext();
  const [tab, setTab] = useState<Tab>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProds, setLoadingProds] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoadingProds(true);
    try {
      const prods = await getAdminProducts();
      setProducts(prods);
    } finally {
      setLoadingProds(false);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadOrders();
  }, [loadProducts, loadOrders]);

  // Delete product
  const handleDeleteAdminProd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await deleteAdminProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await refreshProducts();
  };

  // Toggle product sold-out
  const toggleAdminSoldOut = async (id: string, current: boolean) => {
    await updateAdminProduct(id, { isSoldOut: !current });
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isSoldOut: !current } : p))
    );
    await refreshProducts();
  };

  const openEditModal = (product: AdminProduct) => {
    setEditingProduct(product);
  };


  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <h1 className="font-display font-normal text-xl text-amber-400 tracking-[0.2em] uppercase">G<span className="font-lambda">Λ</span>MÉN</h1>
          <span className="text-gray-600 text-xs uppercase tracking-widest">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
            ← View Site
          </Link>
          <span className="text-gray-600 text-xs">{admin?.email}</span>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-gray-500 hover:text-red-400 text-xs transition-colors"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard label="Total Products" value={products.length} icon={<Package size={18} />} />
          <StatCard label="Total Orders" value={orders.length} icon={<ShoppingBag size={18} />} />
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-1 mb-6 bg-gray-900 p-1 rounded w-fit">
          <TabBtn active={tab === 'products'} onClick={() => setTab('products')} icon={<Package size={14} />} label="Products" />
          <TabBtn active={tab === 'orders'} onClick={() => setTab('orders')} icon={<ShoppingBag size={14} />} label={`Orders (${orders.length})`} />
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm text-gray-400 uppercase tracking-widest">All Products</h2>
              <div className="flex gap-2">
                <button
                  onClick={loadProducts}
                  className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs px-3 py-2 border border-gray-800 transition-colors"
                >
                  <RefreshCw size={12} className={loadingProds ? 'animate-spin' : ''} />
                  Refresh
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-gray-950 text-xs px-4 py-2 font-semibold transition-colors"
                >
                  <Plus size={13} /> Add Product
                </button>
              </div>
            </div>

            {/* Products List */}
            {products.length === 0 ? (
              <div className="text-center py-20 text-gray-700">
                <Package size={40} strokeWidth={0.5} className="mx-auto mb-4" />
                <p className="text-sm">No products found.</p>
              </div>
            ) : (
              <div>
                <div className="hidden md:block">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-[10px] uppercase tracking-widest">
                        <th className="text-left px-4 py-3">Product</th>
                        <th className="text-left px-4 py-3">Collection</th>
                        <th className="text-left px-4 py-3">Price (EGP)</th>
                        <th className="text-center px-4 py-3">Sold Out</th>
                        <th className="text-center px-4 py-3">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors">
                          <td className="px-4 py-3">
                            <div>
                              <p className="text-gray-200 font-medium text-xs">{p.name}</p>
                              <p className="text-gray-600 text-[10px]">{p.wood}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] uppercase tracking-wider text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded">
                              {p.collection}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 group">
                              <span className="text-gray-300 text-xs">{(p.price || 0).toLocaleString()}</span>
                              <button onClick={() => openEditModal(p)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 hover:text-amber-400 p-1">
                                <Edit2 size={11} />
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggleAdminSoldOut(p.id, !!p.isSoldOut)}
                              className={`text-xs px-2 py-1 rounded transition-colors ${p.isSoldOut ? 'bg-red-500/20 text-red-400 hover:bg-red-500/10' : 'bg-green-500/10 text-green-500 hover:bg-green-500/20'}`}
                            >
                              {p.isSoldOut ? 'Sold Out' : 'In Stock'}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteAdminProd(p.id)}
                              className="text-gray-600 hover:text-red-400 transition-colors p-2"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards for Products */}
                <div className="grid grid-cols-1 gap-4 md:hidden p-4">
                  {products.map((p) => (
                    <div key={p.id} className="bg-gray-800/30 border border-gray-800 rounded p-4 flex flex-col gap-3">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="text-gray-200 font-medium text-sm">{p.name}</p>
                          <p className="text-gray-500 text-[10px] mt-0.5">{p.wood}</p>
                          <span className="inline-block mt-2 text-[10px] uppercase tracking-wider text-amber-500/70 bg-amber-500/10 px-2 py-0.5 rounded">
                            {p.collection}
                          </span>
                        </div>
                        <p className="text-amber-400 text-sm font-medium">{(p.price || 0).toLocaleString()} <span className="text-[10px] text-gray-500">EGP</span></p>
                      </div>
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-800/50 mt-1">
                        <button onClick={() => openEditModal(p)} className="flex-1 py-2 text-xs flex justify-center items-center gap-1.5 border border-gray-700 text-gray-400 rounded hover:text-amber-400 hover:border-amber-500/50 transition-colors">
                          <Edit2 size={12} /> Edit
                        </button>
                        <button
                          onClick={() => toggleAdminSoldOut(p.id, !!p.isSoldOut)}
                          className={`flex-1 py-2 text-xs rounded transition-colors ${p.isSoldOut ? 'bg-red-500/20 text-red-400' : 'bg-green-500/10 text-green-500'}`}
                        >
                          {p.isSoldOut ? 'Sold Out' : 'In Stock'}
                        </button>
                        <button
                          onClick={() => handleDeleteAdminProd(p.id)}
                          className="px-3 py-2 border border-red-500/30 rounded text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm text-gray-400 uppercase tracking-widest">Recent Orders</h2>
              <button
                onClick={loadOrders}
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs px-3 py-2 border border-gray-800 transition-colors"
              >
                <RefreshCw size={12} className={loadingOrders ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-20 text-gray-700">
                <ShoppingBag size={40} strokeWidth={0.5} className="mx-auto mb-4" />
                <p className="text-sm">No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.map((order) => (
                  <div key={order.id} className="bg-gray-900 border border-gray-800 rounded">
                    <div
                      className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-4 cursor-pointer hover:bg-gray-800/40 transition-colors gap-4"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : (order.id ?? null))}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                        <div>
                          <p className="text-amber-400 text-xs font-mono">{order.orderRef}</p>
                          <p className="text-gray-500 text-[10px] mt-0.5">
                            {order.createdAt ? new Date((order.createdAt as unknown as { seconds: number }).seconds * 1000).toLocaleDateString('en-EG') : 'Just now'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-200 text-xs">{order.customer.name}</p>
                          <p className="text-gray-500 text-[10px]">{order.customer.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-300 text-xs">{order.totalPrice.toLocaleString()} EGP</p>
                          <p className="text-gray-600 text-[10px]">{order.items.length} item(s)</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-3 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-gray-800">
                        <select
                          value={order.status}
                          onChange={async (e) => {
                            if (!confirm(`Are you sure you want to change order status to ${e.target.value}?`)) return;
                            const newStatus = e.target.value as Order['status'];
                            await updateOrderStatus(order.id!, newStatus);
                            setOrders((prev) =>
                              prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o))
                            );
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-3 py-2 rounded focus:outline-none focus:border-amber-500/40"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <div className="p-2 border border-gray-700 rounded text-gray-400">
                          {expandedOrder === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedOrder === order.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 pt-2 border-t border-gray-800 grid md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Customer</p>
                              <div className="space-y-1 text-xs text-gray-400">
                                <p>{order.customer.name} · {order.customer.email}</p>
                                <p>{order.customer.phone}</p>
                                <p>{order.customer.city} — {order.customer.address}</p>
                                {order.customer.notes && <p className="text-amber-400/70">Note: {order.customer.notes}</p>}
                              </div>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2">Items</p>
                              <div className="space-y-1">
                                {order.items.map((item, i) => (
                                  <div key={i} className="flex justify-between text-xs text-gray-400">
                                    <span>{item.productName} × {item.quantity}</span>
                                    <span className="text-gray-300">{(item.price * item.quantity).toLocaleString()} EGP</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddProductModal
            onClose={() => setShowAddModal(false)}
            onAdded={async () => { setShowAddModal(false); loadProducts(); await refreshProducts(); }}
          />
        )}
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
            onUpdated={async () => { setEditingProduct(null); loadProducts(); await refreshProducts(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded p-5 flex items-center gap-4">
      <div className="text-amber-400/60">{icon}</div>
      <div>
        <p className="text-2xl text-gray-200 font-light">{value}</p>
        <p className="text-[10px] uppercase tracking-widest text-gray-600">{label}</p>
      </div>
    </div>
  );
}

function TabBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-xs rounded transition-colors ${
        active ? 'bg-amber-500 text-gray-950 font-semibold' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
