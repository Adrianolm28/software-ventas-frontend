import { NavLink, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  Tag,
  Users,
  UserCog,
  LogOut,
  Store,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ENLACES = [
  { to: '/ventas', label: 'Ventas', icon: ShoppingCart },
  { to: '/productos', label: 'Productos', icon: Package },
  { to: '/categorias', label: 'Categorías', icon: Tag },
  { to: '/clientes', label: 'Clientes', icon: Users },
  {
    to: '/usuarios',
    label: 'Usuarios',
    icon: UserCog,
    roles: ['ADMIN', 'ADMINISTRADOR'],
  },
];

const ROL_ESTILO = {
  ADMIN: 'bg-rose-50 text-rose-600',
  ADMINISTRADOR: 'bg-amber-50 text-amber-700',
  VENDEDOR: 'bg-emerald-50 text-emerald-700',
};

export const Sidebar = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 shrink-0 bg-white text-slate-600 border-r border-slate-200 flex flex-col">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Store className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold text-slate-800">Sistema Ventas</span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1">
        {ENLACES.filter((l) => !l.roles || hasRole(...l.roles)).map(
          ({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          )
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold uppercase">
            {user?.username?.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">
              {user?.username}
            </p>
            <span
              className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-semibold ${
                ROL_ESTILO[user?.rol] || 'bg-slate-100 text-slate-600'
              }`}
            >
              {user?.rol}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};