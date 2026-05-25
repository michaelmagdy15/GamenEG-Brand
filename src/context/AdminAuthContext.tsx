// src/context/AdminAuthContext.tsx
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AdminAuthContextType {
  admin: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAdmin(user);
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail !== 'michaelmitry13@gmail.com' && cleanEmail !== 'admin@gamen.eg') {
      setError('Access Denied: Unauthorized administrator email.');
      throw new Error('Unauthorized account');
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid credentials. Please try again.');
      throw new Error('Invalid credentials');
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const isAdmin = !!admin && (admin.email === 'michaelmitry13@gmail.com' || admin.email === 'admin@gamen.eg');

  return (
    <AdminAuthContext.Provider
      value={{ admin, isAdmin, loading, login, logout, error }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
