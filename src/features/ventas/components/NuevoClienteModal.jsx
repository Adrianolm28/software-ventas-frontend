import React, { useState } from 'react';
import { X, UserPlus, Save, RefreshCw } from 'lucide-react';
import api from '../../../api/axiosClient';
import { showSuccessAlert, showErrorAlert } from '../../../utils/alerts';

export function NuevoClienteModal({ isOpen, onClose, onClienteCreado }) {
  const [formData, setFormData] = useState({
    idCliente: '', // DNI / RUC
    nombre: '',
    apellidos: '',
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idCliente || !formData.nombre) {
      showErrorAlert('Campos Incompletos', 'El documento y el nombre son obligatorios.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/api/clientes', formData);
      const clienteCreado = response.data;

      showSuccessAlert('Cliente Registrado', `Cliente ${clienteCreado.nombre} creado con éxito.`);
      
      // Notificamos al POS el nuevo cliente para auto-seleccionarlo
      onClienteCreado(clienteCreado);
      
      // Limpiamos y cerramos
      setFormData({ idCliente: '', nombre: '', apellidos: '' });
      onClose();
    } catch (error) {
      showErrorAlert(
        'Error al crear cliente',
        error.response?.data?.message || 'No se pudo registrar el cliente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-indigo-600 text-white">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            <h3 className="font-semibold text-base">Registro Rápido de Cliente</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              DNI / RUC (ID Cliente) *
            </label>
            <input
              type="text"
              name="idCliente"
              value={formData.idCliente}
              onChange={handleChange}
              placeholder="Ej: 71234567"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Nombres *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Apellidos
            </label>
            <input
              type="text"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              placeholder="Ej: Pérez (Opcional)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
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
                  <Save className="w-4 h-4" /> Guardar y Seleccionar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}