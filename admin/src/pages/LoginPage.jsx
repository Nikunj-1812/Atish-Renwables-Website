import { useState } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { setSession } from '../auth/authStore';
import { api } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fromPath = location.state?.from || '/admin/dashboard';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login({ username, password });
      setSession({ token: data.token, username });
      navigate(fromPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4">
      <motion.form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Secure Access</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Admin Login</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage leads and CRM actions.</p>

        <label className="mt-5 grid gap-1 text-sm font-medium text-slate-700">
          Username
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 focus:border-brand-500 focus:outline-none"
              placeholder="admin"
            />
          </div>
        </label>

        <label className="mt-3 grid gap-1 text-sm font-medium text-slate-700">
          Password
          <div className="relative">
            <LockKeyhole size={16} className="pointer-events-none absolute left-3 top-3 text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 focus:border-brand-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
        </label>

        {error ? <p className="mt-3 text-sm font-medium text-rose-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </motion.form>
    </div>
  );
}
