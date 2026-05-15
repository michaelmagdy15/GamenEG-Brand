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
  const docRef = await addDoc(collection(db, 'orders'), {
    ...order,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function getOrders(): Promise<Order[]> {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Order));
}

export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
  await updateDoc(doc(db, 'orders', orderId), { status });
}

// ─── ADMIN PRODUCTS ───────────────────────────────────────────────────────────

export type AdminProduct = Partial<Product> & {
  id: string;
  source: 'admin';
  hidden?: boolean;
};

export type ProductOverride = {
  id: string; // matches static product id
  isSoldOut?: boolean;
  price?: number;
  hidden?: boolean;
};

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const snap = await getDocs(collection(db, 'products'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminProduct));
}

export async function addAdminProduct(product: Omit<AdminProduct, 'source'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    source: 'admin',
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateAdminProduct(id: string, data: Partial<AdminProduct>): Promise<void> {
  await updateDoc(doc(db, 'products', id), data as Record<string, unknown>);
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

// ─── STATIC PRODUCT OVERRIDES ─────────────────────────────────────────────────

export async function getProductOverrides(): Promise<ProductOverride[]> {
  const snap = await getDocs(collection(db, 'productOverrides'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ProductOverride));
}

export async function setProductOverride(id: string, data: Partial<ProductOverride>): Promise<void> {
  await setDoc(doc(db, 'productOverrides', id), data, { merge: true });
}
