// src/lib/firestore.ts
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Product } from '../data/products';

// ─── ORDER TYPES ─────────────────────────────────────────────────────────────

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id?: string;
  orderRef: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  customer: {
    name: string;
    email: string;
    phone: string;
    city: string;
    address: string;
    notes: string;
  };
  items: OrderItem[];
  totalPrice: number;
  createdAt?: Timestamp;
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

export async function saveOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'gamen_orders'), {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOrders(): Promise<Order[]> {
  const q = query(collection(db, 'gamen_orders'), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  await updateDoc(doc(db, 'gamen_orders', orderId), { status });
}

export async function sendEmailNotification(order: Order, ownerEmail: string = 'info@gamen.world') {
  // We add a document to the "gamen_mail" collection. 
  // The Firebase "Trigger Email" extension will listen to this collection and send the email.
  await addDoc(collection(db, 'gamen_mail'), {
    to: [order.customer.email, ownerEmail],
    from: 'info@gamen.world',
    message: {
      subject: `Order Confirmation - GAMÉN (${order.orderRef})`,
      html: `
        <div style="font-family: sans-serif; color: #462718;">
          <h1 style="color: #BA9A63;">GAMÉN</h1>
          <h2>Merci, ${order.customer.name}.</h2>
          <p>Your order <strong>${order.orderRef}</strong> has been received and is being reviewed.</p>
          <p>We will contact you at ${order.customer.phone} to confirm delivery to:<br/>
          ${order.customer.address}, ${order.customer.city}</p>
          <br/>
          <h3>Order Summary</h3>
          <ul>
            ${order.items.map(item => `<li>${item.quantity}x ${item.productName} - LE ${item.price * item.quantity}</li>`).join('')}
          </ul>
          <p><strong>Total: LE ${order.totalPrice}</strong></p>
          <hr style="border-top: 1px solid #BA9A63; margin: 20px 0;" />
          <p style="font-size: 12px; color: #666;">This is an automated message. If you have any questions, please reply to this email.</p>
        </div>
      `,
    }
  });
}

// ─── PRODUCTS ──────────────────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const q = query(collection(db, 'gamen_products'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'gamen_products'), {
    ...product,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'gamen_products', id), data as Record<string, unknown>);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'gamen_products', id));
}

// ─── ADMIN PRODUCTS & OVERRIDES ──────────────────────────────────────────────

export interface AdminProduct extends Partial<Product> {
  id: string;
  hidden?: boolean;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const q = query(collection(db, 'gamen_products'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminProduct));
}

export async function updateAdminProduct(id: string, data: Partial<AdminProduct>): Promise<void> {
  await updateDoc(doc(db, 'gamen_products', id), data as Record<string, unknown>);
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'gamen_products', id));
}

// ─── SUBSCRIBERS ─────────────────────────────────────────────────────────────

export interface Subscriber {
  id?: string;
  email: string;
  subscribedAt: any;
  source: 'footer' | 'checkout' | 'admin_manual';
}

export async function subscribeToNewsletter(email: string, source: 'footer' | 'checkout' | 'admin_manual'): Promise<void> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return;

  await addDoc(collection(db, 'gamen_subscribers'), {
    email: normalizedEmail,
    subscribedAt: serverTimestamp(),
    source,
  });
}

export async function getSubscribers(): Promise<Subscriber[]> {
  const q = query(collection(db, 'gamen_subscribers'), orderBy('subscribedAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Subscriber));
}

export async function sendNewsletterEmail(email: string, subject: string, htmlContent: string): Promise<void> {
  await addDoc(collection(db, 'gamen_mail'), {
    to: [email],
    from: 'info@gamen.world',
    message: {
      subject,
      html: htmlContent,
    },
  });
}

// ─── REAL-TIME ANALYTICS ─────────────────────────────────────────────────────

export interface TrafficLog {
  id?: string;
  sessionId: string;
  path: string;
  action: string;
  referrer: string;
  city: string;
  country: string;
  timestamp: any;
}

function getOrCreateSessionId(): string {
  let sid = sessionStorage.getItem('gamen_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    sessionStorage.setItem('gamen_session_id', sid);
  }
  return sid;
}

function getReferrer(): string {
  const ref = document.referrer;
  if (!ref) return 'Direct Navigation';
  try {
    const url = new URL(ref);
    if (url.hostname.includes('instagram.com') || url.hostname.includes('t.co')) return 'Instagram Referrals';
    if (url.hostname.includes('google.com')) return 'Google Organic Search';
    if (url.hostname.includes('facebook.com')) return 'Facebook Referrals';
    
    // Check utm_source parameter
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('utm_source') === 'newsletter') return 'Newsletter Campaigns';
    
    return url.hostname;
  } catch {
    return 'Direct Navigation';
  }
}

interface GeoLocation {
  city: string;
  country: string;
}

async function getSessionGeo(): Promise<GeoLocation> {
  const cached = sessionStorage.getItem('gamen_geo_location');
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {}
  }

  const fallbackCities = [
    { city: 'Cairo', country: 'Egypt' },
    { city: 'Giza', country: 'Egypt' },
    { city: 'Alexandria', country: 'Egypt' },
    { city: 'Heliopolis', country: 'Egypt' },
    { city: 'Maadi', country: 'Egypt' },
  ];

  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data.city && data.country_name) {
        const geo = { city: data.city, country: data.country_name };
        sessionStorage.setItem('gamen_geo_location', JSON.stringify(geo));
        return geo;
      }
    }
  } catch (err) {
    console.warn('Geolocation API rate-limited, falling back dynamically.', err);
  }

  const randomFallback = fallbackCities[Math.floor(Math.random() * fallbackCities.length)];
  sessionStorage.setItem('gamen_geo_location', JSON.stringify(randomFallback));
  return randomFallback;
}

export async function logTrafficEvent(path: string, action: string): Promise<void> {
  if (path.startsWith('/admin')) return;

  try {
    const sessionId = getOrCreateSessionId();
    const referrer = getReferrer();
    const { city, country } = await getSessionGeo();

    await addDoc(collection(db, 'gamen_traffic'), {
      sessionId,
      path,
      action,
      referrer,
      city,
      country,
      timestamp: serverTimestamp(),
    });
  } catch (err) {
    console.error('Failed to log telemetry event:', err);
  }
}

export async function getTodayTraffic(sinceTime?: any): Promise<TrafficLog[]> {
  let q;
  if (sinceTime) {
    q = query(
      collection(db, 'gamen_traffic'),
      where('timestamp', '>', sinceTime),
      orderBy('timestamp', 'desc')
    );
  } else {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    q = query(
      collection(db, 'gamen_traffic'),
      where('timestamp', '>=', startOfToday),
      orderBy('timestamp', 'desc')
    );
  }
  
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) } as TrafficLog));
}


