import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Tag, Loader2 } from 'lucide-react';
import { getCategorias, deleteCategoria } from '../services/categoriaService';
import { CategoriaFormModal } from '../components/CategoriaFormModal';

export function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para el Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleCreate = () => {
    setSelectedCategoria(null);
    setIsModalOpen(true);
  };

  const handleEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await deleteCategoria(id);
        fetchCategorias();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
        alert('No se pudo eliminar la categoría. Puede tener productos asociados.');
      }
    }
  };

  const filteredCategorias = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.descripcion && cat.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Tag className="w-7 h-7 text-indigo-600" />
            Gestión de Categorías
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra las categorías de tus productos en el sistema
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm shadow-indigo-200"
        >
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </button>
      </div>

      {/* Buscador */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all shadow-sm"
        />
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-sm">Cargando categorías...</p>
          </div>
        ) : filteredCategorias.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            No se encontraron categorías registrados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100 text-gray-600 font-semibold">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Nombre</th>
                  <th className="py-3.5 px-6">Descripción</th>
                  <th className="py-3.5 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCategorias.map((categoria) => (
                  <tr
                    key={categoria.idCategoria}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-mono text-xs text-gray-500">
                      #{categoria.idCategoria}
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {categoria.nombre}
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {categoria.descripcion || (
                        <span className="italic text-gray-400">Sin descripción</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(categoria)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Editar Categoría"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(categoria.idCategoria)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar Categoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <CategoriaFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCategorias}
        categoriaToEdit={selectedCategoria}
      />
    </div>
  );
}