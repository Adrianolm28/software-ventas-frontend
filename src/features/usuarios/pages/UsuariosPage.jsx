import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  RefreshCw,
  Trash2,
  Edit,
  ShieldAlert,
  ShieldCheck,
  User,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { usuarioService } from '../services/usuarioService';
import { showSuccessAlert, showErrorAlert, showConfirmDialog } from '../../../utils/alerts';
import { UsuarioModal } from '../components/UsuarioModal';

const renderRolBadge = (rol) => {
  const r = (rol || '').toUpperCase();
  switch (r) {
    case 'ADMIN':
      return (
        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full text-xs font-bold">
          <ShieldAlert className="w-3.5 h-3.5" /> ADMIN
        </span>
      );
    case 'ADMINISTRADOR':
      return (
        <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" /> ADMINISTRADOR
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
          <User className="w-3.5 h-3.5" /> VENDEDOR
        </span>
      );
  }
};

export const UsuariosPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, [page]);

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const data = await usuarioService.listarUsuarios(page, 10);
      setUsuarios(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch (error) {
      showErrorAlert(
        'Error al cargar usuarios',
        error.response?.data?.message || 'Error de conexión con el servidor.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCrearNuevo = () => {
    setSelectedUsuario(null);
    setIsModalOpen(true);
  };

  const handleEditar = (usuario) => {
    setSelectedUsuario(usuario);
    setIsModalOpen(true);
  };

  const handleEliminar = async (idUsuario) => {
    const result = await showConfirmDialog(
      '¿Eliminar usuario?',
      'Esta acción eliminará el usuario permanentemente del sistema.'
    );

    if (result.isConfirmed) {
      try {
        await usuarioService.eliminarUsuario(idUsuario);
        showSuccessAlert('Usuario Eliminado', 'El usuario ha sido removido correctamente.');
        cargarUsuarios();
      } catch (error) {
        showErrorAlert(
          'No se pudo eliminar',
          error.response?.data?.message || 'Ocurrió un error al intentar eliminar el usuario.'
        );
      }
    }
  };

  const filteredUsuarios = usuarios.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[1400px] mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Gestión de Usuarios
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Administra las cuentas de acceso y roles del personal
          </p>
        </div>

        <button
          onClick={handleCrearNuevo}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-md shadow-indigo-200"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <button
            onClick={cargarUsuarios}
            className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-16">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">ID Usuario</th>
                  <th className="p-4">Username</th>
                  <th className="p-4">Rol / Permiso</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredUsuarios.length > 0 ? (
                  filteredUsuarios.map((u) => (
                    <tr key={u.idUsuario} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-mono text-xs text-slate-500">
                        {u.idUsuario?.slice(0, 8)}...
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {u.username}
                      </td>
                      <td className="p-4">{renderRolBadge(u.rol)}</td>
                      <td className="p-4">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleEditar(u)}
                            className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                            title="Editar usuario"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEliminar(u.idUsuario)}
                            className="p-2 text-slate-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-slate-400">
                      No se encontraron usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <p className="text-xs text-slate-500">
              Página {page + 1} de {totalPages} ({totalElements} usuarios)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 0))}
                disabled={page === 0}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <UsuarioModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        usuarioEdit={selectedUsuario}
        onSaveSuccess={cargarUsuarios}
      />
    </div>
  );
};