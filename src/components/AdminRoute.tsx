// src/components/AdminRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import type { ReactNode } from 'react';

export default function AdminRoute({ children }: { children: ReactNode }) {
  const { admin, isAdmin, loading } = useAdminAuth();
  const isTrueAdmin = isAdmin && (admin?.email === 'michaelmitry13@gmail.com' || admin?.email === 'admin@gamen.eg');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isTrueAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
