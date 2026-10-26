import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, RefreshCw, Key, Shield, User } from 'lucide-react';
import { usuarioService } from '../services/usuarioService';
import { showSuccessAlert, showErrorAlert } from '../../../utils/alerts';

export function UsuarioModal({ isOpen, onClose, usuarioEdit, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rol: 'VENDEDOR',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (usuarioEdit) {
      setFormData({
        username: usuarioEdit.username || '',
        password: '',
        rol: usuarioEdit.rol || 'VENDEDOR',
      });
    } else {
      setFormData({ username: '', password: '', rol: 'VENDEDOR' });
    }
  }, [usuarioEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username) {
      showErrorAlert('Campo Requerido', 'El nombre de usuario es obligatorio.');
      return;
    }

    if (!usuarioEdit && !formData.password) {
      showErrorAlert('Campo Requerido', 'La contraseña es obligatoria para nuevos usuarios.');
      return;
    }

    setLoading(true);
    try {
      if (usuarioEdit) {
        await usuarioService.actualizarUsuario(usuarioEdit.idUsuario, formData);
        showSuccessAlert('Usuario Actualizado', 'Los datos del usuario han sido actualizados.');
      } else {
        await usuarioService.crearUsuario(formData);
        showSuccessAlert('Usuario Creado', 'El nuevo usuario se ha registrado con éxito.');
      }
      onSaveSuccess();
      onClose();
    } catch (error) {
      showErrorAlert(
        'Error',
        error.response?.data?.message || 'Ocurrió un error al procesar la solicitud.'
      );
    } finally { // <-- CORREGIDO: Decía "fontally"
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            <h3 className="font-semibold text-base">
              {usuarioEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-indigo-600" /> Username *
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ej: jperez"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              {usuarioEdit ? 'Contraseña (Dejar en blanco para no cambiar)' : 'Contraseña *'}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required={!usuarioEdit}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-indigo-600" /> Rol del Usuario
            </label>
            <select
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="ADMIN">ADMIN (Administrador Completo)</option>
              <option value="ADMINISTRADOR">ADMINISTRADOR (Gestor)</option>
              <option value="VENDEDOR">VENDEDOR (Cajero / Operador POS)</option>
            </select>
          </div>

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-indigo-200"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" /> Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}