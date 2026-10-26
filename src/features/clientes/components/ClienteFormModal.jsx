import React, { useState, useEffect } from 'react';
import { X, Save, User, CreditCard } from 'lucide-react';
import { createCliente, updateCliente } from '../services/clienteService';

export function ClienteFormModal({ isOpen, onClose, onSuccess, clienteToEdit }) {
  const [formData, setFormData] = useState({
    idCliente: '',
    nombre: '',
    apellidos: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (clienteToEdit) {
      setFormData({
        idCliente: clienteToEdit.idCliente || '',
        nombre: clienteToEdit.nombre || '',
        apellidos: clienteToEdit.apellidos || '',
      });
    } else {
      setFormData({ idCliente: '', nombre: '', apellidos: '' });
    }
    setError('');
  }, [clienteToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.idCliente.trim() || !formData.nombre.trim() || !formData.apellidos.trim()) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      if (clienteToEdit) {
        await updateCliente(clienteToEdit.idCliente, formData);
      } else {
        await createCliente(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Error al guardar el cliente. Verifique que la identificación no esté duplicada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="flex justify-between items-center px-6 py-4 bg-indigo-600 text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-5 h-5" />
            {clienteToEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Identificación (DNI / RUC) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="idCliente"
                value={formData.idCliente}
                onChange={handleChange}
                disabled={!!clienteToEdit}
                placeholder="Ej. 12345678"
                className={`w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm ${
                  clienteToEdit ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombres <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Carlos"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Apellidos <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                placeholder="Ej. Pérez Gómez"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}