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

export async function sendEmailNotification(order: Order, ownerEmail: string = 'michaelmitry13@gmail.com') {
  // We add a document to the "mail" collection. 
  // The Firebase "Trigger Email" extension will listen to this collection and send the email.
  await addDoc(collection(db, 'mail'), {
    to: [order.customer.email, ownerEmail],
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
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'products'), {
    ...product,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<void> {
  await updateDoc(doc(db, 'products', id), data as Record<string, unknown>);
}

export async function deleteProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}

// ─── ADMIN PRODUCTS & OVERRIDES ──────────────────────────────────────────────

export interface AdminProduct extends Partial<Product> {
  id: string;
  hidden?: boolean;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminProduct));
}

export async function updateAdminProduct(id: string, data: Partial<AdminProduct>): Promise<void> {
  await updateDoc(doc(db, 'products', id), data as Record<string, unknown>);
}

export async function deleteAdminProduct(id: string): Promise<void> {
  await deleteDoc(doc(db, 'products', id));
}
