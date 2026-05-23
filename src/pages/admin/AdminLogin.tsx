// src/pages/admin/AdminLogin.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const { login, isAdmin, error } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAdmin, navigate]);

  if (isAdmin) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      // Navigation is handled by the useEffect watching isAdmin
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display font-normal text-3xl text-amber-400 tracking-[0.25em] mb-1 uppercase">G<span className="font-lambda">Λ</span>MÉN</h1>
          <h2 className="font-accent text-sm text-amber-400/60 uppercase tracking-widest">Λtelier Portal</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-1.5">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="admin@gamen.eg"
            />
          </div>

          <div>
            <label htmlFor="admin-password" className="block text-gray-500 text-[10px] uppercase tracking-[0.15em] mb-1.5">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm px-4 py-3 focus:outline-none focus:border-amber-500/50 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-500 text-gray-950 text-xs uppercase tracking-[0.2em] font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border border-gray-950/40 border-t-gray-950 rounded-full animate-spin" />
            ) : 'Sign In'}
          </button>
        </form>

        <p className="text-gray-700 text-[10px] text-center mt-8">
          This portal is restricted to authorized GΛMÉN administrators only.
        </p>
      </motion.div>
    </div>
  );
}
