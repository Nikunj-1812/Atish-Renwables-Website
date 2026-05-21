import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearSession, getAdminUser } from '../auth/authStore';
import { api } from '../services/api';
import logoImg from '../assets/logo.png';

export default function Topbar() {
  const navigate = useNavigate();
  const adminName = getAdminUser();

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (_error) {
      // Ignore API logout failure and clear local session.
    }
    clearSession();
    navigate('/admin/login', { replace: true });
  };

  return (
    <header className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-card">
      <div className="flex items-center gap-3">
        <img src={logoImg} alt="Atish Renewables Logo" className="h-8 w-8 object-contain rounded-lg" />
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Welcome back</p>
          <h2 className="text-lg font-semibold text-slate-900">{adminName}</h2>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
}
