import React, { useState, useEffect } from 'react';
import { X, Save, Tag, DollarSign, Barcode, CheckCircle } from 'lucide-react';
import api from "../../../api/axiosClient";

export const ProductoFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  productoEditar,
}) => {
  const [formData, setFormData] = useState({
    idProducto: '',
    nombre: '',
    precio: '',
    idCategoria: '',
    estado: true,
  });

  const [categorias, setCategorias] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Cargar categorías para el selector dropdown
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await api.get('/api/categorias');
        const data = response.data.content || response.data || [];
        setCategorias(data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };

    if (isOpen) {
      fetchCategorias();
    }
  }, [isOpen]);

  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (productoEditar) {
      setFormData({
        idProducto: productoEditar.idProducto || '',
        nombre: productoEditar.nombre || '',
        precio: productoEditar.precio || '',
        idCategoria: productoEditar.idCategoria || '',
        estado: productoEditar.estado ?? true,
      });
    } else {
      setFormData({
        idProducto: '',
        nombre: '',
        precio: '',
        idCategoria: '',
        estado: true,
      });
    }
  }, [productoEditar, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        precio: parseFloat(formData.precio),
        idCategoria: formData.idCategoria ? Number(formData.idCategoria) : null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Cabecera del Modal */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-lg">
            {productoEditar ? 'Editar Producto' : 'Nuevo Producto'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Código / ID Producto */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Código / ID Producto
            </label>
            <div className="relative">
              <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="idProducto"
                value={formData.idProducto}
                onChange={handleChange}
                disabled={!!productoEditar}
                required
                placeholder="Ej. PROD001"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white disabled:opacity-60"
              />
            </div>
          </div>

          {/* Nombre del Producto */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
              Nombre del Producto
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              placeholder="Ej. Teclado Mecánico RGB"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          {/* Precio y Categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Precio ($)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1">
                Categoría
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  name="idCategoria"
                  value={formData.idCategoria}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:bg-white"
                >
                  <option value="">Seleccionar...</option>
                  {categorias.map((cat) => (
                    <option key={cat.idCategoria || cat.id} value={cat.idCategoria || cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Estado Activo / Inactivo */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="estado"
              name="estado"
              checked={formData.estado}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <label htmlFor="estado" className="text-sm font-medium text-slate-700 select-none flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Producto Activo
            </label>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-colors shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {submitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};