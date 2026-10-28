import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Store, User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/ventas" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username.trim(), password);
      navigate(location.state?.from?.pathname || '/ventas', { replace: true });
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Usuario o contraseña incorrectos'
          : 'No se pudo conectar con el servidor'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex bg-slate-50 text-slate-800">
      {/* Panel Izquierdo - Celeste Elegante */}
      <div className="hidden lg:flex lg:w-1/2 bg-sky-500 text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-sky-400/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="bg-white/20 p-2.5 rounded-xl border border-white/20">
            <Store className="w-7 h-7 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Sistema Ventas</span>
        </div>

        <div className="relative z-10 my-auto max-w-md">
          <h1 className="text-4xl font-extrabold mb-4 leading-tight">
            Gestión inteligente para tu negocio
          </h1>
          <p className="text-sky-100 text-base leading-relaxed">
            Registra ventas y consulta productos y clientes desde un punto de venta rápido, intuitivo y moderno.
          </p>
        </div>

        <div className="relative z-10 text-xs text-sky-100/80">
          © {new Date().getFullYear()} Sistema de Ventas. Todos los derechos reservados.
        </div>
      </div>

      {/* Panel Derecho - Formulario Blanco Minimalista */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <div className="inline-flex lg:hidden bg-sky-100 p-3 rounded-xl mb-4">
              <Store className="w-8 h-8 text-sky-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">¡Bienvenido!</h2>
            <p className="text-slate-500 text-sm mt-1">
              Ingresa tus credenciales para acceder al sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  autoComplete="username"
                  placeholder="Tu usuario"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-sky-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl p-3.5">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-sky-500/20 transition-all"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};