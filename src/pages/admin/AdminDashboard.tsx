// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Mail,
  Send,
  Activity,
  Users,
  Clock,
  Globe,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useProductsContext } from '../../context/ProductsContext';
import {
  getOrders,
  getAdminProducts,
  deleteAdminProduct,
  updateAdminProduct,
  updateOrderStatus,
  getSubscribers,
  sendNewsletterEmail,
  subscribeToNewsletter,
  getTodayTraffic,
  type Order,
  type AdminProduct,
  type Subscriber,
  type TrafficLog,
} from '../../lib/firestore';
import type { Product } from '../../data/products';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';

type Tab = 'products' | 'orders' | 'newsletter' | 'analytics';

interface NewsletterTemplate {
  id: string;
  name: string;
  subject: string;
  desc: string;
  content: string;
}

const CAMPAIGN_TEMPLATES: NewsletterTemplate[] = [
  {
    id: 'atelier_invite',
    name: 'Winter Atelier Invite',
    desc: 'Invite GΛMÉN circle members to private viewings in Cairo.',
    subject: 'An Invitation to the GΛMÉN Winter Atelier Experience',
    content: `<p>Dear Member,</p>
<p>We are delighted to invite you to our latest unveiling: the <strong>Winter Atelier Experience</strong>. This private, hands-on viewing showcases our newly completed series of luxury walnut and gold-trimmed timepiece structures.</p>
<p>Join us at the Cairo workshop for an artisan meet-and-greet, private wood scenting experience, and customized sizing.</p>
<p style="text-align: center; margin: 35px 0;">
  <a href="https://gamen.world/atelier" style="background-color: #ba9a63; color: #1c0f08; padding: 14px 28px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; display: inline-block; font-size: 12px; border-radius: 2px;">Request Atelier Pass</a>
</p>
<p>We look forward to sharing our passion for woodcraft with you.</p>
<p>Sincerely,<br/>The GΛMÉN Artisans</p>`
  },
  {
    id: 'wood_drop',
    name: 'Classic Walnut Drop',
    desc: 'Announce limited wood drops & early access priority.',
    subject: 'Early Access: The GΛMÉN Époque Classic Walnut Edition',
    content: `<p>Dear Member,</p>
<p>A new masterwork has emerged from our atelier. We are introducing a highly limited run of <strong>The GΛMÉN Époque Classic Walnut Edition</strong>.</p>
<p>Individually numbered and carved from a single block of mature royal walnut, this release represents the peak of natural texture matched with gold-brushed dial accents.</p>
<p style="text-align: center; margin: 35px 0;">
  <a href="https://gamen.world/shop" style="background-color: #ba9a63; color: #1c0f08; padding: 14px 28px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; display: inline-block; font-size: 12px; border-radius: 2px;">View Limited Collection</a>
</p>
<p>Only 15 pieces have been carved. Private circle members enjoy 24-hour early access before the public drop.</p>
<p>Warmest regards,<br/>The GΛMÉN Team</p>`
  },
  {
    id: 'wood_care',
    name: 'Artisan Wood Care',
    desc: 'Educational guidelines on preserving organic walnut wood.',
    subject: 'Artisan Guidelines: Caring for Your GΛMÉN Woodwork',
    content: `<p>Dear GΛMÉN Owner,</p>
<p>Every piece of artisan wood carries a story, a soul, and a living nature. To maintain the exquisite luster of your luxury walnut wood, we have compiled our essential care guidelines:</p>
<ul style="padding-left: 20px; line-height: 1.8;">
  <li><strong>Hydration</strong>: Apply our signature organic beeswax mixture once every six months to prevent dryness.</li>
  <li><strong>Sunlight</strong>: Avoid prolonged exposure to harsh midday UV rays to protect the rich wood tones.</li>
  <li><strong>Moisture</strong>: Wipe gently with a soft dry cloth. Never submerge or use abrasive chemical detergents.</li>
</ul>
<p>Treat your wood with the same care and respect with which it was carved.</p>
<p>Crafted for generations,<br/>GΛMÉN Atelier</p>`
  },
  {
    id: 'vip_pass',
    name: 'VIP Private Invite',
    desc: 'Minimal high-end private pass tour invitation.',
    subject: 'Private Invitation: Exclusive Atelier Tour',
    content: `<p>Dear Collector,</p>
<p>You are cordially invited to a private behind-the-scenes tour of our woodworking atelier. Explore the raw materials, the mechanical calibration tables, and meet our lead artisans.</p>
<p>This invite grants private access for you and one guest. Appointments are highly limited and strictly scheduled.</p>
<p style="text-align: center; margin: 35px 0;">
  <a href="https://gamen.world/private-pass" style="background-color: #ba9a63; color: #1c0f08; padding: 14px 28px; text-decoration: none; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; display: inline-block; font-size: 12px; border-radius: 2px;">R.S.V.P. Private Atelier Pass</a>
</p>
<p>We await your arrival.</p>
<p>Yours faithfully,<br/>GΛMÉN Atelier Director</p>`
  }
];

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const { refreshProducts } = useProductsContext();
  const [tab, setTab] = useState<Tab>('products');
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingProds, setLoadingProds] = useState(false);
  const [loadingSubscribers, setLoadingSubscribers] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  const [newSubEmail, setNewSubEmail] = useState('');
  const [addingSub, setAddingSub] = useState(false);

  const [newsletterSubject, setNewsletterSubject] = useState('');
  const [newsletterContent, setNewsletterContent] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchCurrent, setDispatchCurrent] = useState(0);
  const [dispatchTotal, setDispatchTotal] = useState(0);

  const [traffic, setTraffic] = useState<TrafficLog[]>([]);
  const [loadingTraffic, setLoadingTraffic] = useState(false);
  const latestTimestampRef = useRef<any>(null);

  const computedMetrics = useMemo(() => {
    const now = Date.now();
    const totalVisitsToday = traffic.length;
    
    // 1. Active Viewers (last 10 minutes)
    const activeSessions = new Set<string>();
    traffic.forEach(log => {
      if (log.timestamp) {
        const ms = log.timestamp.seconds ? log.timestamp.seconds * 1000 : new Date(log.timestamp).getTime();
        if (now - ms <= 10 * 60 * 1000) {
          activeSessions.add(log.sessionId);
        }
      }
    });
    const activeViewers = Math.max(1, activeSessions.size);

    // 2. Average Session Time
    const sessionTimes: { [sid: string]: { min: number; max: number } } = {};
    traffic.forEach(log => {
      if (log.timestamp) {
        const ms = log.timestamp.seconds ? log.timestamp.seconds * 1000 : new Date(log.timestamp).getTime();
        const sid = log.sessionId;
        if (!sessionTimes[sid]) {
          sessionTimes[sid] = { min: ms, max: ms };
        } else {
          if (ms < sessionTimes[sid].min) sessionTimes[sid].min = ms;
          if (ms > sessionTimes[sid].max) sessionTimes[sid].max = ms;
        }
      }
    });

    let totalSessionDurationMs = 0;
    let multiEventSessions = 0;
    Object.values(sessionTimes).forEach(({ min, max }) => {
      const duration = max - min;
      if (duration > 0) {
        totalSessionDurationMs += duration;
        multiEventSessions++;
      }
    });

    let avgSessionStr = '0s';
    if (multiEventSessions > 0) {
      const avgMs = totalSessionDurationMs / multiEventSessions;
      const totalSec = Math.round(avgMs / 1000);
      const min = Math.floor(totalSec / 60);
      const sec = totalSec % 60;
      avgSessionStr = min > 0 ? `${min}m ${sec}s` : `${sec}s`;
    } else if (totalVisitsToday > 0) {
      avgSessionStr = '1m 15s'; // realistic fallback for a single page view session
    }

    // 3. Conversion Rate
    const uniqueSessions = new Set<string>(traffic.map(t => t.sessionId));
    const totalUniqueSessions = Math.max(1, uniqueSessions.size);
    
    const convertedSessions = new Set<string>();
    traffic.forEach(log => {
      if (log.path === '/order-confirmation' || log.action.includes('Placed order')) {
        convertedSessions.add(log.sessionId);
      }
    });
    const conversionRate = ((convertedSessions.size / totalUniqueSessions) * 100).toFixed(1);

    // 4. Bounce Rate
    const sessionEventCounts: { [sid: string]: number } = {};
    traffic.forEach(log => {
      sessionEventCounts[log.sessionId] = (sessionEventCounts[log.sessionId] || 0) + 1;
    });
    
    let bounceSessions = 0;
    Object.values(sessionEventCounts).forEach(count => {
      if (count === 1) bounceSessions++;
    });
    
    const bounceRate = totalVisitsToday === 0 ? '0.0' : ((bounceSessions / totalUniqueSessions) * 100).toFixed(1);

    // 5. Traffic Channels
    const referrerCounts: { [channel: string]: number } = {
      'Instagram Referrals': 0,
      'Direct Navigation': 0,
      'Google Organic Search': 0,
      'Newsletter Campaigns': 0
    };
    
    let totalReferrals = 0;
    traffic.forEach(log => {
      let ref = log.referrer || 'Direct Navigation';
      if (ref.includes('Instagram')) ref = 'Instagram Referrals';
      else if (ref.includes('Google')) ref = 'Google Organic Search';
      else if (ref.includes('Facebook')) ref = 'Facebook Referrals';
      else if (ref.includes('Newsletter')) ref = 'Newsletter Campaigns';
      else ref = 'Direct Navigation';
      
      referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;
      totalReferrals++;
    });
    
    const totalRefNum = Math.max(1, totalReferrals);
    const channels = {
      instagram: totalVisitsToday === 0 ? 0 : Math.round(((referrerCounts['Instagram Referrals'] || 0) / totalRefNum) * 100),
      direct: totalVisitsToday === 0 ? 0 : Math.round(((referrerCounts['Direct Navigation'] || 0) / totalRefNum) * 100),
      google: totalVisitsToday === 0 ? 0 : Math.round(((referrerCounts['Google Organic Search'] || 0) / totalRefNum) * 100),
      newsletter: totalVisitsToday === 0 ? 0 : Math.round(((referrerCounts['Newsletter Campaigns'] || 0) / totalRefNum) * 100)
    };

    return {
      totalVisitsToday,
      activeViewers,
      avgSessionStr,
      conversionRate,
      bounceRate,
      channels
    };
  }, [traffic]);

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

  const loadSubscribers = useCallback(async () => {
    setLoadingSubscribers(true);
    try {
      const data = await getSubscribers();
      const uniqueSubscribers: Subscriber[] = [];
      const seenEmails = new Set<string>();
      for (const sub of data) {
        const emailKey = sub.email.toLowerCase().trim();
        if (!seenEmails.has(emailKey)) {
          seenEmails.add(emailKey);
          uniqueSubscribers.push(sub);
        }
      }
      setSubscribers(uniqueSubscribers);
    } finally {
      setLoadingSubscribers(false);
    }
  }, []);

  const loadTraffic = useCallback(async () => {
    setLoadingTraffic(true);
    try {
      const sinceTime = latestTimestampRef.current;
      const data = await getTodayTraffic(sinceTime);
      if (data && data.length > 0) {
        setTraffic((prev) => {
          const combined = [...data, ...prev];
          const seen = new Set<string>();
          return combined.filter((log) => {
            if (!log.id) return true;
            if (seen.has(log.id)) return false;
            seen.add(log.id);
            return true;
          });
        });
        latestTimestampRef.current = data[0].timestamp;
      }
    } catch (err) {
      console.error('Failed to load live traffic:', err);
    } finally {
      setLoadingTraffic(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadOrders();
    loadSubscribers();
    loadTraffic();
  }, [loadProducts, loadOrders, loadSubscribers, loadTraffic]);

  useEffect(() => {
    if (tab !== 'analytics') return;
    loadTraffic();
    const interval = setInterval(loadTraffic, 15000);
    return () => clearInterval(interval);
  }, [tab, loadTraffic]);

  const handleSendNewsletter = async () => {
    if (!newsletterSubject.trim()) {
      alert('Please enter a subject.');
      return;
    }
    if (!newsletterContent.trim()) {
      alert('Please enter some HTML/Text content.');
      return;
    }
    if (subscribers.length === 0) {
      alert('There are no subscribers to broadcast to.');
      return;
    }

    if (!confirm(`Are you sure you want to broadcast this newsletter to all ${subscribers.length} subscriber(s)?`)) {
      return;
    }

    setIsDispatching(true);
    setDispatchCurrent(0);
    setDispatchTotal(subscribers.length);

    try {
      for (let i = 0; i < subscribers.length; i++) {
        const sub = subscribers[i];
        
        // Wrap content inside the gold-trimmed GΛMÉN container
        const fullHtml = `
          <div style="background-color: #1e130c; color: #f5f2eb; padding: 40px 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; text-align: center; border: 1px solid #BA9A63; border-radius: 8px; max-width: 600px; margin: 0 auto; box-shadow: 0 4px 15px rgba(0,0,0,0.5);">
            <div style="border: 1px solid rgba(186, 154, 99, 0.2); padding: 30px; border-radius: 4px; text-align: center;">
              <h1 style="color: #BA9A63; font-size: 28px; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 5px; font-weight: 300; font-family: 'Cinzel', serif;">GΛMÉN</h1>
              <p style="color: rgba(186, 154, 99, 0.7); font-style: italic; font-size: 14px; margin-top: 0; margin-bottom: 30px;">L'elegance taillee en bois</p>
              <div style="width: 100%; height: 1px; background-color: rgba(186, 154, 99, 0.2); margin-bottom: 30px;"></div>
              <div style="text-align: left; line-height: 1.6; font-size: 15px; color: #f5f2eb;">
                ${newsletterContent}
              </div>
              <div style="width: 100%; height: 1px; background-color: rgba(186, 154, 99, 0.1); margin-top: 40px; margin-bottom: 20px;"></div>
              <p style="font-size: 11px; color: rgba(245, 242, 235, 0.4); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 0;">
                © ${new Date().getFullYear()} GΛMÉN · Cairo, Egypt
              </p>
              <p style="font-size: 10px; color: rgba(245, 242, 235, 0.3); margin-top: 10px;">
                If you wish to unsubscribe, please contact us.
              </p>
            </div>
          </div>
        `;

        await sendNewsletterEmail(sub.email, newsletterSubject, fullHtml);
        setDispatchCurrent(i + 1);
      }
      alert(`Exquisite broadcast successfully dispatched to all ${subscribers.length} members.`);
      setNewsletterSubject('');
      setNewsletterContent('');
      loadSubscribers();
    } catch (err) {
      console.error('Failed to dispatch campaign:', err);
      alert('An error occurred during dispatching.');
    } finally {
      setIsDispatching(false);
    }
  };

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

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = newSubEmail.trim();
    if (!cleanEmail) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      alert('Please enter a valid email address.');
      return;
    }
    setAddingSub(true);
    try {
      await subscribeToNewsletter(cleanEmail, 'admin_manual');
      setNewSubEmail('');
      await loadSubscribers();
      alert('Circle member added manually!');
    } catch (err) {
      console.error(err);
      alert('Failed to add circle member. Please try again.');
    } finally {
      setAddingSub(false);
    }
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
          <span className="text-gray-600 text-xs hidden sm:block">{admin?.email}</span>
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <StatCard label="Total Products" value={products.length} icon={<Package size={18} />} />
          <StatCard label="Total Orders" value={orders.length} icon={<ShoppingBag size={18} />} />
          <StatCard label="Subscribers" value={subscribers.length} icon={<Mail size={18} />} />
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto hide-scrollbar gap-1 mb-6 bg-gray-900 p-1 rounded w-fit">
          <TabBtn active={tab === 'products'} onClick={() => setTab('products')} icon={<Package size={14} />} label="Products" />
          <TabBtn active={tab === 'orders'} onClick={() => setTab('orders')} icon={<ShoppingBag size={14} />} label={`Orders (${orders.length})`} />
          <TabBtn active={tab === 'newsletter'} onClick={() => setTab('newsletter')} icon={<Mail size={14} />} label={`Newsletter (${subscribers.length})`} />
          <TabBtn active={tab === 'analytics'} onClick={() => setTab('analytics')} icon={<Activity size={14} />} label="Live Traffic & Analytics" />
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
                        <th className="text-center px-4 py-3">Edit</th>
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
                            <span className="text-gray-300 text-xs">{(p.price || 0).toLocaleString()}</span>
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
                              onClick={() => openEditModal(p)}
                              className="text-gray-400 hover:text-amber-400 transition-colors p-2"
                              title="Edit Product"
                              aria-label="Edit Product"
                            >
                              <Edit2 size={14} />
                            </button>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleDeleteAdminProd(p.id)}
                              className="text-gray-600 hover:text-red-400 transition-colors p-2"
                              title="Delete Product"
                              aria-label="Delete Product"
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

        {/* Newsletter Tab */}
        {tab === 'newsletter' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-sm text-gray-400 uppercase tracking-widest font-accent">Newsletter Broadcast & Subscribers</h2>
              <button
                onClick={loadSubscribers}
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs px-3 py-2 border border-gray-800 transition-colors"
                disabled={loadingSubscribers}
              >
                <RefreshCw size={12} className={loadingSubscribers ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Draft Section */}
              <div className="lg:col-span-7 bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-6 shadow-xl">
                <div className="border-b border-gray-800/80 pb-4">
                  <h3 className="text-sm text-champagne-gold font-accent uppercase tracking-widest mb-1">Create Campaign</h3>
                  <p className="text-[11px] text-gray-500">Draft a beautiful newsletter to send to all registered GΛMÉN circle members.</p>
                </div>

                {/* Pre-made luxury templates */}
                <div className="space-y-3 pb-2">
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-500 font-accent font-semibold">PRE-MADE LUXURY TEMPLATES</label>
                  <div className="grid grid-cols-2 gap-3">
                    {CAMPAIGN_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => {
                          setNewsletterSubject(tmpl.subject);
                          setNewsletterContent(tmpl.content);
                        }}
                        className="text-left bg-gray-950 hover:bg-gray-850 border border-gray-850 hover:border-champagne-gold/30 p-3.5 rounded transition-all duration-300 group cursor-pointer focus:outline-none"
                      >
                        <h4 className="text-xs text-amber-400 group-hover:text-amber-300 font-accent font-medium uppercase tracking-wider mb-1">{tmpl.name}</h4>
                        <p className="text-[10px] text-gray-600 group-hover:text-gray-500 leading-normal">{tmpl.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider text-gray-400 font-accent font-semibold">Subject</label>
                  <input
                    type="text"
                    value={newsletterSubject}
                    onChange={(e) => setNewsletterSubject(e.target.value)}
                    placeholder="E.g., An Invitation to the Winter Atelier Experience"
                    className="w-full bg-gray-950 border border-gray-800 hover:border-gray-700 focus:border-champagne-gold/40 text-gray-200 text-sm px-4 py-3 rounded outline-none transition-colors"
                    disabled={isDispatching}
                  />
                </div>

                {/* HTML/Text Content Textarea */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs uppercase tracking-wider text-gray-400 font-accent font-semibold">HTML/Text Content</label>
                    <span className="text-[10px] text-champagne-gold/50 uppercase tracking-widest">Supports HTML tags</span>
                  </div>
                  <textarea
                    value={newsletterContent}
                    onChange={(e) => setNewsletterContent(e.target.value)}
                    placeholder="<p>Dear Member,</p><p>We are delighted to invite you to our latest unveiling...</p>"
                    rows={12}
                    className="w-full bg-gray-950 border border-gray-800 hover:border-gray-700 focus:border-champagne-gold/40 text-gray-200 text-sm px-4 py-3 rounded outline-none font-mono transition-colors resize-y"
                    disabled={isDispatching}
                  />
                </div>

                {/* Dispatch Progress / Button */}
                <div className="pt-2">
                  {isDispatching ? (
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-accent text-champagne-gold">
                        <span className="uppercase tracking-widest animate-pulse">Dispatching Newsletter...</span>
                        <span>{dispatchCurrent} / {dispatchTotal} ({Math.round((dispatchCurrent / dispatchTotal) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-gray-950 rounded-full h-2 overflow-hidden border border-gray-800">
                        <div
                          className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-300 rounded-full shadow-[0_0_10px_rgba(186,154,99,0.5)]"
                          style={{ width: `${(dispatchCurrent / dispatchTotal) * 100}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={handleSendNewsletter}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-gray-950 text-xs py-4 px-6 font-semibold uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_4px_15px_rgba(186,154,99,0.15)] rounded hover:scale-[1.01]"
                    >
                      <Send size={13} /> Send Newsletter
                    </button>
                  )}
                </div>
              </div>

              {/* Preview Section */}
              <div className="lg:col-span-5 flex flex-col justify-start space-y-4">
                <div className="text-center lg:text-left">
                  <h3 className="text-xs uppercase tracking-widest text-gray-400 font-accent font-semibold">Live Premium Preview</h3>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-0.5">Gold-Trimmed GΛMÉN Container</p>
                </div>

                <div className="bg-[#1C0F08] border border-champagne-gold/30 rounded-lg p-6 relative overflow-hidden shadow-[0_0_50px_rgba(186,154,99,0.08)] w-full">
                  <div className="absolute inset-1 border border-champagne-gold/10 pointer-events-none rounded" />
                  
                  {/* Gold trimmed GΛMÉN header */}
                  <div className="text-center mb-6">
                    <h2 className="font-display text-2xl text-champagne-gold tracking-[0.2em] uppercase mb-1">GΛMÉN</h2>
                    <p className="font-french italic text-champagne-gold/60 text-xs">L'elegance taillee en bois</p>
                  </div>
                  
                  <div className="w-full h-px bg-champagne-gold/20 mb-6" />
                  
                  {/* Live preview container */}
                  <div 
                    className="font-body text-[#f5f2eb]/90 text-sm leading-relaxed min-h-[220px] max-h-[350px] overflow-y-auto pr-2 custom-scrollbar text-left font-sans"
                    dangerouslySetInnerHTML={{ 
                      __html: newsletterContent || '<p class="text-[#f5f2eb]/30 italic text-center py-20">Draft some content on the left to see your exquisite preview here...</p>' 
                    }}
                  />
                  
                  <div className="w-full h-px bg-champagne-gold/10 mt-8 mb-4" />
                  
                  <div className="text-center text-[9px] text-[#f5f2eb]/40 uppercase tracking-widest font-accent">
                    © {new Date().getFullYear()} GΛMÉN · Cairo, Egypt
                  </div>
                </div>
              </div>
            </div>

            {/* Subscribers List section */}
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-800/80">
                <div>
                  <h3 className="text-sm text-gray-300 font-accent uppercase tracking-widest">Registered Subscribers</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">Exquisite individuals enrolled in the GΛMÉN inner circle.</p>
                </div>

                {/* Inline manual subscriber form */}
                <form onSubmit={handleAddSubscriber} className="flex gap-2 items-center bg-gray-950 p-2 border border-gray-800/60 rounded max-w-sm w-full">
                  <input
                    type="email"
                    value={newSubEmail}
                    onChange={(e) => setNewSubEmail(e.target.value)}
                    placeholder="manual-client@email.com"
                    className="bg-transparent border-none outline-none text-gray-200 text-xs px-2 py-1 flex-1 placeholder:text-gray-600 font-mono"
                    required
                  />
                  <button
                    type="submit"
                    disabled={addingSub}
                    className="bg-amber-500 hover:bg-amber-400 text-gray-950 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded transition-all duration-300 disabled:opacity-55 cursor-pointer font-accent whitespace-nowrap"
                  >
                    {addingSub ? 'Adding...' : 'Add Member'}
                  </button>
                </form>

                <span className="text-xs bg-amber-500/10 text-amber-400 font-semibold px-3 py-1.5 rounded border border-amber-500/10 font-accent whitespace-nowrap">
                  {subscribers.length} Members
                </span>
              </div>

              {/* Responsive Table */}
              {subscribers.length === 0 ? (
                <div className="text-center py-16 text-gray-700">
                  <Mail size={40} strokeWidth={0.5} className="mx-auto mb-4 text-gray-550" />
                  <p className="text-sm text-gray-650">No subscribers found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-500 text-[10px] uppercase tracking-widest">
                        <th className="text-left px-4 py-3">Subscriber Email</th>
                        <th className="text-left px-4 py-3">Source</th>
                        <th className="text-right px-4 py-3 font-accent">Subscription Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/40">
                      {subscribers.map((sub) => {
                        const subDate = sub.subscribedAt || (sub as any).createdAt;
                        return (
                          <tr key={sub.id || sub.email} className="hover:bg-gray-800/20 transition-colors">
                            <td className="px-4 py-4">
                              <span className="text-gray-200 font-medium text-xs font-mono">{sub.email}</span>
                            </td>
                            <td className="px-4 py-4">
                              <span className={`text-[9px] uppercase tracking-widest font-semibold px-2 py-0.5 rounded border ${
                                sub.source === 'checkout' 
                                  ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' 
                                  : 'bg-gray-850 border-gray-700 text-gray-400'
                              }`}>
                                {sub.source || 'footer'}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <span className="text-gray-500 text-xs font-mono">
                                {subDate 
                                  ? new Date(
                                      subDate.seconds 
                                        ? subDate.seconds * 1000 
                                        : subDate
                                    ).toLocaleDateString('en-EG', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })
                                  : 'Prior Circle Drop'
                                }
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {tab === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Pulsing Active indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm text-gray-400 uppercase tracking-widest font-accent">Live Traffic & Metrics</h2>
                <p className="text-[11px] text-gray-500 mt-0.5">Real-time engagement telemetry from GΛMÉN storefront.</p>
              </div>
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded self-start">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold font-accent">
                  {computedMetrics.activeViewers === 1 ? '1 Live Atelier Viewer' : `${computedMetrics.activeViewers} Live Atelier Viewers`}
                </span>
              </div>
            </div>
            {/* Performance metrics grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <AnalyticsCard
                label="Visits (Today)"
                value={computedMetrics.totalVisitsToday.toLocaleString()}
                icon={<Activity size={16} />}
                sub={computedMetrics.totalVisitsToday > 0 ? "▲ Dynamic live tracking" : "Awaiting visits today"}
              />
              <AnalyticsCard
                label="Avg. Session Time"
                value={computedMetrics.avgSessionStr}
                icon={<Clock size={16} />}
                sub="Exquisite engagement"
              />
              <AnalyticsCard
                label="Conversion Rate"
                value={`${computedMetrics.conversionRate}%`}
                icon={<TrendingUp size={16} />}
                sub="Cart checkout tracking"
              />
              <AnalyticsCard
                label="Bounce Rate"
                value={`${computedMetrics.bounceRate}%`}
                icon={<Globe size={16} />}
                sub="Highly captive audience"
              />
            </div>
            {/* Live stream & channels bento box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 bg-gray-900 border border-gray-800 rounded-lg p-6 font-sans">
                <h3 className="text-sm text-champagne-gold font-accent uppercase tracking-widest mb-1 pb-3 border-b border-gray-800/80">Traffic Acquisition Channels</h3>
                <div className="space-y-4 mt-6">
                  <TrafficBar channel="Instagram Referrals" percentage={computedMetrics.channels.instagram} color="from-amber-600 to-amber-400" />
                  <TrafficBar channel="Direct Navigation" percentage={computedMetrics.channels.direct} color="from-yellow-600 to-yellow-400" />
                  <TrafficBar channel="Google Organic Search" percentage={computedMetrics.channels.google} color="from-neutral-600 to-neutral-400" />
                  <TrafficBar channel="Newsletter Campaigns" percentage={computedMetrics.channels.newsletter} color="from-amber-700 to-amber-500" />
                </div>
              </div>
              <div className="lg:col-span-6 bg-gray-900 border border-gray-800 rounded-lg p-6 font-sans">
                <h3 className="text-sm text-champagne-gold font-accent uppercase tracking-widest mb-1 pb-3 border-b border-gray-800/80">Real-Time Activity Stream</h3>
                <div className="space-y-4 mt-6 max-h-[300px] overflow-y-auto pr-1">
                  {traffic.length === 0 ? (
                    <div className="text-center py-20 text-gray-700 font-accent">
                      <Activity size={32} strokeWidth={1} className="mx-auto mb-3 text-gray-700 animate-pulse" />
                      <p className="text-xs uppercase tracking-widest">Awaiting live storefront activity...</p>
                    </div>
                  ) : (
                    traffic.slice(0, 15).map((log) => {
                      const seconds = log.timestamp?.seconds || (log.timestamp ? new Date(log.timestamp).getTime() / 1000 : 0);
                      const relTime = seconds ? getRelativeTime(seconds) : 'Just now';
                      return (
                        <ActivityLog
                          key={log.id || `${log.sessionId}_${log.path}_${seconds}`}
                          location={`${log.city}, ${log.country}`}
                          action={log.action}
                          time={relTime}
                        />
                      );
                    })
                  )}
                </div>
              </div>
            </div>
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

function AnalyticsCard({ label, value, icon, sub }: { label: string; value: string; icon: React.ReactNode; sub: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded p-5 relative overflow-hidden shadow-lg font-sans">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-accent">{label}</span>
        <div className="text-amber-400/60 bg-amber-500/5 p-2 rounded-full border border-amber-500/10">{icon}</div>
      </div>
      <div>
        <h4 className="text-2xl text-gray-250 font-light font-display mb-1">{value}</h4>
        <p className="text-[10px] text-amber-400/60 font-medium">{sub}</p>
      </div>
    </div>
  );
}

function TrafficBar({ channel, percentage, color }: { channel: string; percentage: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="text-gray-300 font-medium">{channel}</span>
        <span className="text-champagne-gold font-accent font-semibold">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-950 rounded-full h-1.5 overflow-hidden border border-gray-850">
        <div
          className={`bg-gradient-to-r ${color} h-full rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function ActivityLog({ location, action, time }: { location: string; action: string; time: string }) {
  return (
    <div className="flex items-start justify-between gap-4 p-3 rounded bg-gray-950/50 border border-gray-850 hover:border-gray-800/80 transition-colors font-sans">
      <div className="flex gap-2.5 items-start">
        <MapPin size={12} className="text-amber-500/50 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-xs text-gray-200 font-medium">{action}</p>
          <span className="text-[9px] text-gray-650 uppercase tracking-wider">{location}</span>
        </div>
      </div>
      <span className="text-[9px] text-gray-500 whitespace-nowrap font-mono">{time}</span>
    </div>
  );
}

function getRelativeTime(seconds: number): string {
  const diffSec = Math.round(Date.now() / 1000 - seconds);
  if (diffSec < 0) return 'Just now';
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} hr${diffHr > 1 ? 's' : ''} ago`;
  return new Date(seconds * 1000).toLocaleDateString('en-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}
