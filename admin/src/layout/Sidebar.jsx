import { BarChart3, FolderKanban, Settings, Users } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { prefetchAdminRoute } from '../App';
import logoImg from '../assets/logo.png';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/admin/leads', label: 'Leads', icon: Users },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/team', label: 'Team', icon: Users },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white/95 p-4 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:p-6">
      <div className="mb-6 flex items-center gap-3">
        <img src={logoImg} alt="Atish Renewables" className="h-10 w-10 object-contain rounded-xl" />
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">CRM Panel</p>
          <h1 className="text-base font-semibold text-slate-900">Atish Admin</h1>
        </div>
      </div>

      <nav className="grid gap-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onMouseEnter={() => prefetchAdminRoute(item.to)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon size={16} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
