import React, { useEffect, useState } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { productoService } from '../services/productoService';
import { ProductoFormModal } from '../components/ProductoFormModal';
import {
  showSuccessAlert,
  showErrorAlert,
  showConfirmDialog,
} from '../../../utils/alerts';

const moneda = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
});

export const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const cargarProductos = async () => {
    setLoading(true);

    try {
      const data = await productoService.listarProductos();
      setProductos(data.content || data || []);
    } catch (error) {
      showErrorAlert(
        'Error de carga',
        error.response?.data?.message || 'No se pudieron obtener los productos'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleNuevo = () => {
    setProductoSeleccionado(null);
    setIsModalOpen(true);
  };

  const handleEditar = (producto) => {
    setProductoSeleccionado(producto);
    setIsModalOpen(true);
  };

  const handleEliminar = async (id) => {
    const result = await showConfirmDialog(
      '¿Desactivar producto?',
      'El producto cambiará su estado a inactivo'
    );

    if (result.isConfirmed) {
      try {
        await productoService.eliminarProducto(id);
        showSuccessAlert('Desactivado', 'Producto desactivado con éxito');
        cargarProductos();
      } catch (error) {
        showErrorAlert(
          'Error',
          error.response?.data?.message || 'No se pudo desactivar el producto'
        );
      }
    }
  };

  const handleSubmitForm = async (formData) => {
    try {
      if (productoSeleccionado) {
        await productoService.actualizarProducto(
          productoSeleccionado.idProducto,
          formData
        );

        showSuccessAlert('Actualizado', 'Producto actualizado correctamente');
      } else {
        await productoService.guardarProducto(formData);
        showSuccessAlert('Registrado', 'Nuevo producto creado correctamente');
      }

      setIsModalOpen(false);
      cargarProductos();
    } catch (error) {
      showErrorAlert(
        'Error al guardar',
        error.response?.data?.message || 'Ocurrió un error en el servidor'
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-800">
              Catálogo de Productos
            </h1>

            <p className="text-xs text-slate-500">
              Administración del inventario y precios
            </p>
          </div>
        </div>

        <button
          onClick={handleNuevo}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase">
                  <th className="p-4">ID</th>
                  <th className="p-4">Producto</th>
                  <th className="p-4">Marca</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4 text-center">Stock</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 text-sm">
                {productos.length > 0 ? (
                  productos.map((item) => (
                    <tr
                      key={item.idProducto}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="p-4 font-semibold text-slate-700">
                        #{item.idProducto}
                      </td>

                      <td className="p-4 font-medium text-slate-900">
                        {item.nombre}
                      </td>

                      <td className="p-4 text-slate-600">
                        {item.marca || 'Sin marca'}
                      </td>

                      <td className="p-4">
                        <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                          {item.categoria || 'Sin categoría'}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                            Number(item.stock ?? 0) > 0
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {item.stock ?? 0}
                        </span>
                      </td>

                      <td className="p-4 font-semibold text-slate-800">
                        {moneda.format(Number(item.precio) || 0)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            item.estado
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {item.estado ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Activo
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Inactivo
                            </>
                          )}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={() => handleEditar(item)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleEliminar(item.idProducto)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Desactivar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No hay productos registrados en la base de datos.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ProductoFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitForm}
        productoEditar={productoSeleccionado}
      />
    </div>
  );
};