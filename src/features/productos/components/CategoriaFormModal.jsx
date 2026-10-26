import React, { useState, useEffect } from 'react';
import { X, Save, Tag, AlignLeft } from 'lucide-react';
import { createCategoria, updateCategoria } from '../services/categoriaService';

export function CategoriaFormModal({ isOpen, onClose, onSuccess, categoriaToEdit }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categoriaToEdit) {
      setFormData({
        nombre: categoriaToEdit.nombre || '',
        descripcion: categoriaToEdit.descripcion || ''
      });
    } else {
      setFormData({ nombre: '', descripcion: '' });
    }
    setError('');
  }, [categoriaToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nombre.trim()) {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      if (categoriaToEdit) {
        await updateCategoria(categoriaToEdit.idCategoria, formData);
      } else {
        await createCategoria(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al guardar la categoría.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 bg-indigo-600 text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Tag className="w-5 h-5" />
            {categoriaToEdit ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-indigo-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de la Categoría <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Bebidas, Lácteos, Electrodomésticos"
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                placeholder="Breve descripción de la categoría..."
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
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